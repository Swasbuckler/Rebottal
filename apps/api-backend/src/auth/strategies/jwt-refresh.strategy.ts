import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private auth: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies['RefreshToken']
      ]),
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET!,
      passReqToCallback: true
    });
  }

  async validate(request: Request, payload: {uuid: string}) {
    const user = await this.auth.validateRefreshToken(
      request.cookies['RefreshToken'],
      payload.uuid
    );

    return user;
  }
}