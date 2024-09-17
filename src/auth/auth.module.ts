import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { AtStrategy, RtStrategy } from "./strategies"
import { GoogleStrategy } from "./strategies/google.strategy"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { PassportModule } from "@nestjs/passport"
import { SessionSererializer } from "src/utils/Serializer"

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('AT_SECRET'),
                signOptions: { expiresIn: '15m' },
            }),
            inject: [ConfigService],
        }),
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'google' }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '60m' },
        }),
    ],
    providers: [AuthService, AtStrategy, RtStrategy, GoogleStrategy, SessionSererializer, {
        provide: 'AUTH_SERVICE',
        useClass: AuthService
    }],
    controllers: [AuthController],
})

export class AuthModule { }