import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies['RefreshToken']
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET!,
      passReqToCallback: true
    });
  }

  async validate(request: Request, payload: {sub: string, uuid: string}) {
    const {user, sub} = await this.authService.validateRefreshToken(
      request.cookies['RefreshToken'],
      payload
    );
    return {user, sub};
  }
}