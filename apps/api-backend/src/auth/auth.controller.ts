import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LogInUserDto } from 'src/users/dto/log-in-user.dto';
import { type Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { type User } from '@rebottal/validation-definitions';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() inputData: CreateUserDto) {
    return await this.authService.signUp(inputData);
  }

  @Post('log-in')
  @UseGuards(LocalAuthGuard)
  async logIn(@CurrentUser() user: User, @Res({passthrough: true}) response: Response) {
    const {userData, accessToken, accessTokenExpiration, refreshToken, refreshTokenExpiration} = await this.authService.logIn(user);

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
      data: userData,
      message: 'Logged In'
    });
  }

  @Post('log-out')
  @UseGuards(JwtAuthGuard)
  async logOut(@CurrentUser() user: User, @Res({passthrough: true}) response: Response) {
    await this.authService.logOut(user);

    response.clearCookie('AccessToken');
    response.clearCookie('RefreshToken');

    return response.status(HttpStatus.OK).json({
      message: 'Logged Out'
    });
  }
}
