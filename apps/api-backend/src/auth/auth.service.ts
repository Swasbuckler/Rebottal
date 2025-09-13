import { ConflictException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
import { LogInUserDto } from 'src/user/dto/log-in-user.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken, User } from '@rebottal/app-definitions';
import { Response } from 'express';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private refreshTokenService: RefreshTokenService,
    private jwt: JwtService
  ) {}

  private readonly maxRememberMeRefreshTokens = 5;
  private readonly maxNotRememberMeRefreshTokens = 15;

  async signUp(data: CreateUserDto) {
    await this.userService.createUser(data);
    return {status: HttpStatus.OK};
  }

  async getJwtTokens(uuid: string) {
    let randomUuid = crypto.randomUUID();

    while (await this.refreshTokenService.doesSubExists(randomUuid)) {
      randomUuid = crypto.randomUUID();
    }

    const payload = {
      sub: randomUuid, 
      uuid: uuid
    };

    const accessTokenExpiration = new Date(Date.now() + parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION!));
    const refreshTokenExpiration = new Date(Date.now() + parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION!));

    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET!,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION!}ms`
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET!,
      expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION!}ms`
    });

    return {payload, accessToken, accessTokenExpiration, refreshToken, refreshTokenExpiration};
  }

  async logInAndPassCookies(user: User, rememberMe: boolean, response: Response) {
    const refreshTokenCount = await this.refreshTokenService.countRefreshTokensByUserUuid(user.uuid, rememberMe);

    if (rememberMe) {
      if (refreshTokenCount >= this.maxRememberMeRefreshTokens) {
        throw new ConflictException();
      }
    } else {
      if (refreshTokenCount >= this.maxNotRememberMeRefreshTokens) {
        await this.refreshTokenService.deleteEarliestRefreshToken(user.uuid);
      }
    }

    const {payload, accessToken, accessTokenExpiration, refreshToken, refreshTokenExpiration} = await this.getJwtTokens(user.uuid);

    await this.refreshTokenService.createRefreshToken({
      userUuid: user.uuid,
      sub: payload.sub,
      token: refreshToken,
      rememberMe: rememberMe,
      accessedAt: new Date(Date.now()).toISOString(),
      expiresAt: refreshTokenExpiration.toISOString()
    });
    const userData = {
      username: user.username,
      email: user.email,
      role: user.role,
    }

    response.cookie('AccessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: accessTokenExpiration
    });
    
    response.cookie('RefreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: refreshTokenExpiration
    });

    return response.status(HttpStatus.OK).json({
      data: userData,
      message: 'Logged In'
    });
  }

  async refreshAndPassCookies(user: User, sub: string, response: Response) {
    const {payload, accessToken, accessTokenExpiration, refreshToken, refreshTokenExpiration} = await this.getJwtTokens(user.uuid);

    await this.refreshTokenService.updateRefreshToken(
      sub,
      {
        sub: payload.sub,
        token: refreshToken,
        accessedAt: new Date(Date.now()).toISOString(),
        expiresAt: refreshTokenExpiration.toISOString()
      }
    );

    response.cookie('AccessToken', accessToken, {
      httpOnly: true,
      secure: true,
      expires: accessTokenExpiration
    });
    
    response.cookie('RefreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      expires: refreshTokenExpiration
    });

    return response.status(HttpStatus.OK).json({
      message: 'Refresh'
    });
  }

  async validateUser(usernameOrEmail: string, password: string) {
    const user = await this.userService.findUser(usernameOrEmail);
    
    if (!user) {
      throw new UnauthorizedException();
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }

    return user;
  }
  
  async validateUserAndRefreshToken(payload: {sub: string, uuid: string}) {
    const user = await this.userService.findUserByUuid(payload.uuid);
    if (!user) {
      throw new UnauthorizedException();
    }

    const refreshToken = await this.refreshTokenService.findRefreshTokenBySub(payload.sub);
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    return {user, refreshToken};
  }

  async validateAccessToken(payload: {sub: string, uuid: string}) {
    const {user, refreshToken} = await this.validateUserAndRefreshToken(payload);
    return {user, sub: refreshToken.sub};
  }

  async validateRefreshToken(token: string, payload: {sub: string, uuid: string}) {
    const {user, refreshToken} = await this.validateUserAndRefreshToken(payload);

    if (!(await bcrypt.compare(token, refreshToken.token))) {
      throw new UnauthorizedException();
    }

    return {user, sub: refreshToken.sub};
  }

  async logOut(sub: string) {
    await this.refreshTokenService.deleteRefreshToken(sub);
  }
}
