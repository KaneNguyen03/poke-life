/* eslint-disable @typescript-eslint/no-explicit-any */
import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as argon from 'argon2'
import { PrismaService } from '../prisma/prisma.service'

import { Users } from '@prisma/client'
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
        // Check if a user with the same email or username already exists
        const existingUser = await this.prisma.users.findFirst({
            where: {
                OR: [
                    { Email: dto.email },
                    { Username: dto.username }
                ]
            }
        })
        const existingCustomer = await this.prisma.customers.findFirst({
            where: {
                OR: [
                    { Email: dto.email },
                    { FullName: dto.username }
                ]
            }
        })

        if (existingUser || existingCustomer) {
            throw new ForbiddenException('User already exists with this email or username')
        }

        // Hash the password
        const hash = await argon.hash(dto.password)

        // Create the new user
        const user = await this.prisma.users
            .create({
                data: {
                    Email: dto.email,
                    Username: dto.username,
                    Password: hash,
                    PhoneNumber: dto.phoneNumber,
                    Address: dto.address,
                    Role: "Customer"
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

        // Create the customer profile
        await this.prisma.customers.create({
            data: {
                CustomerID: user.UserID,
                Address: dto.address,
                PhoneNumber: dto.phoneNumber,
                FullName: dto.username,
                Email: dto.email,
            },
        })

        // Generate tokens
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

    async googleLogin(user: { googleId: string, email: string, name: string }): Promise<Tokens> {
        const existingUser = await this.prisma.users.findUnique({
            where: { Email: user.email },
        })
        if (!existingUser) {
            const newUser = await this.prisma.users.create({
                data: {
                    Email: user.email,
                    Username: user.name,
                    Password: 'google',
                    PhoneNumber: '',
                },
            })
            user.googleId = newUser.UserID
        } else {
            user.googleId = existingUser.UserID
        }

        const tokens = await this.getTokens(user.googleId, user.email)
        await this.updateRtHash(user.googleId, tokens.refresh_token)

        return tokens
    }

    async findUserById(id: string): Promise<Users | null> {
        return this.prisma.users.findUnique({
            where: {
                UserID: id,
            },
        })
    }

    async getUserById(id: string): Promise<Omit<Users, 'password' | 'hashRt'> | null> {
        const user = await this.prisma.users.findUnique({
            where: {
                UserID: id,
            },
        })

        if (!user) {
            return null // User not found
        }

        // Return a new object excluding sensitive fields
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { Password, HashedRt, ...safeUser } = user
        return safeUser as Omit<Users, 'password' | 'hashRt'>
    }
}


