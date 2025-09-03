import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LogInUserDto } from 'src/users/dto/log-in-user.dto';
import { type Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { type User } from '@rebottal/validation-definitions';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() inputData: CreateUserDto) {
    return await this.authService.signUp(inputData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('log-in')
  async logIn(@Body() data: LogInUserDto, @CurrentUser() user: User, @Res({passthrough: true}) response: Response) {
    return await this.authService.logInAndPassCookies(user, response);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(@CurrentUser() user: User, @Res({passthrough: true}) response: Response) {
    return await this.authService.logInAndPassCookies(user, response);
  }

  @UseGuards(JwtAuthGuard)
  @Post('log-out')
  async logOut(@CurrentUser() user: User, @Res({passthrough: true}) response: Response) {
    await this.authService.logOut(user);

    response.clearCookie('AccessToken');
    response.clearCookie('RefreshToken');

    response.status(HttpStatus.OK).json({
      message: 'Logged Out'
    });
  }
}
