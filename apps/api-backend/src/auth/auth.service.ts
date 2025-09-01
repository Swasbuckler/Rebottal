import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcrypt';
import { LogInUserDto } from 'src/users/dto/log-in-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@rebottal/validation-definitions';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService
  ) {}

  async signUp(data: CreateUserDto) {
    await this.users.createUser(data);
    return {status: HttpStatus.OK};
  }

  async logIn(user: User) {        
    const payload = {uuid: user.uuid};

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

    await this.users.updateUser(user.uuid, {
      refreshToken
    });
    const userData = {
      uuid: user.uuid,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    }

    return {userData, accessToken, accessTokenExpiration, refreshToken, refreshTokenExpiration};
  }

  async validateUser(data: LogInUserDto) {
    const user = await this.users.findUser(data.usernameOrEmail);
    
    if (!user) {
      throw new UnauthorizedException();
    }
    if (!(await bcrypt.compare(data.password, user?.password!))) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async logOut(user: User) {
    await this.users.updateUser(user.uuid, {
      refreshToken: null
    });
  }
}
