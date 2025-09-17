import { ConflictException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
import { LogInUserDto } from 'src/user/dto/log-in-user.dto';
import { JwtService } from '@nestjs/jwt';
import { OTP, RefreshToken, User, CreateUserFull } from '@rebottal/app-definitions';
import { Response } from 'express';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { OtpService } from 'src/otp/otp.service';
import { MailerService } from 'src/mailer/mailer.service';
import { CreateOtpDto } from 'src/otp/dto/create-otp.dto';
import { CreateUserFullDto } from 'src/user/dto/create-user-full.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private refreshTokenService: RefreshTokenService,
    private otpService: OtpService,
    private mailerService: MailerService,
    private jwt: JwtService
  ) {}

  private readonly maxRememberMeRefreshTokens = 5;
  private readonly maxNotRememberMeRefreshTokens = 15;
  private readonly otpDuration = 300000;

  async signUp(data: CreateUserDto) {
    await this.userService.createUser(data);
  }

  async getJwtTokens(uuid: string) {
    let randomUuid = crypto.randomUUID();

    while (await this.refreshTokenService.findRefreshTokenBySub(randomUuid)) {
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
      verified: user.verified,
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

    return userData;
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
      sameSite: 'strict',
      expires: accessTokenExpiration
    });
    
    response.cookie('RefreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: refreshTokenExpiration
    });
  }

  async validateUser(usernameOrEmail: string, password: string) {
    const user = await this.userService.findUser(usernameOrEmail);
    
    if (!user || !user.password) {
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
    if (!refreshToken || refreshToken.expiresAt < (new Date(Date.now()))) {
      throw new UnauthorizedException();
    }

    return {user, refreshToken};
  }

  async validateAccessToken(payload: {sub: string, uuid: string}) {
    const {user, refreshToken} = await this.validateUserAndRefreshToken(payload);

    if (Date.now() - refreshToken.accessedAt.getTime() >= parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION!)) {
      throw new UnauthorizedException();
    }

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

  async requestVerification(user: User) {
    const otpCode = await this.mailerService.generateOTP();
    
    const otpData: CreateOtpDto = {
      userUuid: user.uuid,
      code: otpCode,
      purpose: 'VERIFICATION',
      createdAt: new Date(Date.now()).toISOString(),
      expiresAt: new Date(Date.now() + this.otpDuration).toISOString()
    }
    
    const otp = await this.otpService.findOTPByUserUuidAndPurpose(user.uuid, 'VERIFICATION');
    if (!otp) {
      this.otpService.createOTP(otpData);
    } else {
      this.otpService.updateOTPById(otp.id, otpData);
    }

    await this.mailerService.sendOTPEmail(user.email, otpCode);
  }

  async submitVerification(user: User, otpCode: string) {
    const otp = await this.otpService.findOTPByUserUuidAndPurpose(user.uuid, 'VERIFICATION');
    if (!otp) {
      throw new UnauthorizedException();
    }

    if (otp.expiresAt < (new Date(Date.now()))) {
      throw new ConflictException();
    }
    if (otp.code !== otpCode) {
      throw new ConflictException();
    }

    await this.userService.updateUser(user.uuid, {
      verified: true
    });
  }

  async googleSignIn(user: CreateUserFull, response: Response) {
    const existingUser = await this.userService.findUser(user.email);
    if (existingUser) {
      return await this.logInAndPassCookies(existingUser, false, response);
    } else {
      const newUser: CreateUserFull = JSON.parse(JSON.stringify(user));

      newUser.username = newUser.username.replace(' ', '');
      let randomNum = 0;
      let nextUsername = newUser.username;
      while (await this.userService.doesUsernameExists(nextUsername)) {
        randomNum = Math.floor(Math.random() * 1000);
        nextUsername = newUser.username + randomNum.toString();
      }
      newUser.username = nextUsername;

      const newUserFound = await this.userService.createUserFull(newUser);
      return await this.logInAndPassCookies(newUserFound, false, response);
    }
  }

  async validateRecaptcha(token: string) {
    const minimumScore = 0.5;

    try {
      const params = new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY!,
        response: token
      });
      const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?${params}`, {
        method: 'POST',
        body: null
      });

      const { success, score, hostname } = await response.json();
      console.log(success, score, hostname)

      if (!success) {
        throw new Error('Invalid captcha');
      }

      if (score < minimumScore) {
        throw new Error('Low captcha score');
      }

      return true;
    } catch (error) {
      console.error('Error verifying Recaptcha', error);
      return false;
    }
  }
}
