import { AuthService } from './../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { Profile } from 'passport';
import { UserRole } from '../types/user-role.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google-redirect',
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { id, emails, displayName } = profile;
    const user = {
      googleId: id,
      email: emails ? emails[0].value : '',
      name: displayName,
      role: UserRole.Customer,
    };

    // Handle user login/registration here
    const result = await this.authService.googleLogin(user);

    done(null, result);
  }
}
