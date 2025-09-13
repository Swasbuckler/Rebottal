import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LogInUserDto } from 'src/user/dto/log-in-user.dto';
import { type Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { type RefreshToken, type User } from '@rebottal/app-definitions';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { CurrentSub } from './current-sub.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({default: {limit: 3, ttl: 1000}})
  @Post('sign-up')
  async signUp(@Body() inputData: CreateUserDto) {
    return await this.authService.signUp(inputData);
  }

  @Throttle({default: {limit: 10, ttl: 1000}})
  @UseGuards(LocalAuthGuard)
  @Post('log-in')
  async logIn(@Body() data: LogInUserDto, @CurrentUser() user: User, @Res({passthrough: true}) response: Response) {
    await this.authService.logInAndPassCookies(user, Boolean(data.rememberMe), response);
  }

  @Throttle({default: {limit: 10, ttl: 1000}})
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(@CurrentUser() user: User, @CurrentSub() sub: string, @Res({passthrough: true}) response: Response) {
    await this.authService.refreshAndPassCookies(user, sub, response);
  }

  @UseGuards(JwtAuthGuard)
  @Post('log-out')
  async logOut(@CurrentSub() sub: string, @Res({passthrough: true}) response: Response) {
    await this.authService.logOut(sub);
    
    response.clearCookie('AccessToken');
    response.clearCookie('RefreshToken');

    response.status(HttpStatus.OK).json({
      message: 'Logged Out'
    });
  }
}
