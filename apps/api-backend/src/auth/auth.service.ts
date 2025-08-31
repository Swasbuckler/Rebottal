import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcrypt';
import { LogInUserDto } from 'src/users/dto/log-in-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService
  ) {}

  private readonly saltRounds = 10;

  async signUp(data: CreateUserDto) {
    const newUserData: CreateUserDto = JSON.parse(JSON.stringify(data));

    const hash = await bcrypt.hash(data.password, this.saltRounds)
    newUserData.password = hash;

    await this.users.create(newUserData);
    return {status: HttpStatus.OK};
  }

  async logIn(data: LogInUserDto) {
    const user = await this.validateUser(data);

    const payload = { uuid: user.uuid, username: user.username };

    const accessTokenExpiration = new Date(Date.now() + process.env.JWT_ACCESS_TOKEN_EXPIRATION!);
    const refreshTokenExpiration = new Date(Date.now() + process.env.JWT_REFRESH_TOKEN_EXPIRATION!);

    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET!,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION!}ms`
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET!,
      expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION!}ms`
    });

  }

  async validateUser(data: LogInUserDto) {
    const user = await this.users.findUser(data.usernameOrEmail);
    
    if (!user) {
      throw new UnauthorizedException();
    }
    if (!(await bcrypt.compare(data.password, user?.password!))) {
      throw new UnauthorizedException();
    }

    const {password, ...result} = user;
    return result;
  }
}
