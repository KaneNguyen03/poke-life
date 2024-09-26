import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AtStrategy, RtStrategy } from './strategies';
import { GoogleStrategy } from './strategies/google.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
//import { SessionSererializer } from "src/utils/Serializer"

import { RolesGuard } from '../common/guards/roles.guard';

// @Module({
//     imports: [
//         JwtModule.registerAsync({
//             imports: [ConfigModule],
//             useFactory: async (configService: ConfigService) => ({
//                 secret: configService.get<string>('AT_SECRET'),
//                 signOptions: { expiresIn: '15m' },
//             }),
//             inject: [ConfigService],
//         }),
//         ConfigModule,
//         PassportModule.register({ defaultStrategy: 'google' }),
//         JwtModule.register({
//             secret: process.env.JWT_SECRET,
//             signOptions: { expiresIn: '60m' },
//         }),
//     ],
//     providers: [AuthService, AtStrategy, RtStrategy, GoogleStrategy, SessionSererializer, {
//         provide: 'AUTH_SERVICE',
//         useClass: AuthService
//     }],
//     controllers: [AuthController],
// })
@Module({
  imports: [
    ConfigModule.forRoot(), // Đảm bảo ConfigModule được cấu hình đúng
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' }, // Access token expiry
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }), // Sử dụng JWT làm default strategy
  ],
  providers: [
    AuthService,
    AtStrategy,
    RtStrategy,
    GoogleStrategy,
    RolesGuard, // Thêm RolesGuard vào providers
    // Không cần thiết phải cung cấp AuthService dưới dạng provider riêng biệt
  ],
  controllers: [AuthController],
  exports: [AuthService], // Export AuthService nếu bạn cần sử dụng nó ở các module khác
})
export class AuthModule {}
