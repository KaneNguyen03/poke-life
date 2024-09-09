import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as argon from 'argon2'
import { PrismaService } from '../prisma/prisma.service'

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { SigninDto, SignupDto } from './dto'
import { JwtPayload, Tokens } from './types'

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService,
    ) { }

    async signupLocal(dto: SignupDto): Promise<Tokens> {
        const hash = await argon.hash(dto.password)

        const user = await this.prisma.users
            .create({
                data: {
                    Email: dto.email,
                    Username: dto.username,
                    Password: hash,
                    PhoneNumber: dto.phoneNumber,
                },
            })
            .catch((error) => {
                if (error instanceof PrismaClientKnownRequestError) {
                    if (error.code === 'P2002') {
                        throw new ForbiddenException('Credentials incorrect')
                    }
                }
                throw error
            })

        const tokens = await this.getTokens(user.UserID, user.Email)
        await this.updateRtHash(user.UserID, tokens.refresh_token)

        return tokens
    }

    async signinLocal(dto: SigninDto): Promise<Tokens> {
        const user = await this.prisma.users.findUnique({
            where: {
                Email: dto.email,
            },
        })

        if (!user) throw new ForbiddenException('Access Denied')

        const passwordMatches = await argon.verify(user.Password, dto.password)
        if (!passwordMatches) throw new ForbiddenException('Access Denied')

        const tokens = await this.getTokens(user.UserID, user.Email)
        await this.updateRtHash(user.UserID, tokens.refresh_token)

        return tokens
    }

    async logout(userId: string): Promise<boolean> {
        await this.prisma.users.updateMany({
            where: {
                UserID: userId,
                HashedRt: {
                    not: null,
                },
            },
            data: {
                HashedRt: null,
            },
        })
        return true
    }

    async refreshTokens(userId: string, rt: string): Promise<Tokens> {
        const user = await this.prisma.users.findUnique({
            where: {
                UserID: userId,
            },
        })
        if (!user || !user.HashedRt) throw new ForbiddenException('Access Denied')

        const rtMatches = await argon.verify(user.HashedRt, rt)
        if (!rtMatches) throw new ForbiddenException('Access Denied')

        const tokens = await this.getTokens(user.UserID, user.Email)
        await this.updateRtHash(user.UserID, tokens.refresh_token)

        return tokens
    }

    async updateRtHash(userId: string, rt: string): Promise<void> {
        const hash = await argon.hash(rt)
        await this.prisma.users.update({
            where: {
                UserID: userId,
            },
            data: {
                HashedRt: hash,
            },
        })
    }

    async getTokens(userId: string, email: string): Promise<Tokens> {
        const jwtPayload: JwtPayload = {
            sub: userId,
            email: email,
        }

        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: this.config.get<string>('AT_SECRET'),
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: this.config.get<string>('RT_SECRET'),
                expiresIn: '7d',
            }),
        ])

        return {
            access_token: at,
            refresh_token: rt,
        }
    }
}
