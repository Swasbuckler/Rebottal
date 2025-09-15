import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { CreateUserFullDto } from "src/user/dto/create-user-full.dto";
import { CreateUserFull } from "@rebottal/app-definitions";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_OAUTH2_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_OAUTH2_CALLBACK_URL!,
      scope: ['profile', 'email']
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
    const user: CreateUserFull = {
      username: profile.displayName,
      email: profile.emails![0].value,
      password: null,
      verified: profile.emails![0].verified,
      role: 'USER'
    };

    return {user};
  }
}