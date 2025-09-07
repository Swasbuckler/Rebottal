import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private users: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies['AccessToken']
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET!,
    });
  }

  async validate(payload: {uuid: string}) {
    const user = await this.users.findUserByUuid(payload.uuid);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}