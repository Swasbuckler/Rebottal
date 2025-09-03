import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { LogInUserDto } from "src/users/dto/log-in-user.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private auth: AuthService) {
    super({
      usernameField: 'usernameOrEmail'
    });
  }

  async validate(usernameOrEmail: string, password: string) {
    const data: LogInUserDto = {
      usernameOrEmail, 
      password
    };

    const user = await this.auth.validateUser(data);
    return user;
  }
}