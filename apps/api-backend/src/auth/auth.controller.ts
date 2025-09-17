import { Body, ConflictException, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LogInUserDto } from 'src/user/dto/log-in-user.dto';
import { type Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { GoogleSignInParty, type CreateUserFull, type RefreshToken, type User } from '@rebottal/app-definitions';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { CurrentSub } from './current-sub.decorator';
import { Throttle } from '@nestjs/throttler';
import { SubmitOTPDto } from 'src/otp/dto/submit-otp.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { RecaptchaAuthGuard } from './guards/recaptcha-auth.guard';

@Throttle({default: {limit: 3, ttl: 5000}})
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(RecaptchaAuthGuard)
  @Post('sign-up')
  async signUp(@Body() inputData: CreateUserDto, @Res({passthrough: true}) response: Response) {
    await this.authService.signUp(inputData);
    response.status(HttpStatus.OK);
  }

  @UseGuards(RecaptchaAuthGuard)
  @UseGuards(LocalAuthGuard)
  @Post('log-in')
  async logIn(@Body() data: LogInUserDto, @CurrentUser() user: User, @Res({passthrough: true}) response: Response) {
    const userData = await this.authService.logInAndPassCookies(user, Boolean(data.rememberMe), response);
    response.status(HttpStatus.OK).json({
      data: userData,
      message: 'Logged In'
    });
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  async refresh(@CurrentUser() user: User, @CurrentSub() sub: string, @Res({passthrough: true}) response: Response) {
    await this.authService.refreshAndPassCookies(user, sub, response);
    response.status(HttpStatus.OK).json({
      message: 'Refresh'
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('log-out')
  async logOut(@CurrentSub() sub: string, @Res({passthrough: true}) response: Response) {
    await this.authService.logOut(sub);
    
    response.clearCookie('AccessToken');
    response.clearCookie('RefreshToken');

    response.status(HttpStatus.OK).json({
      message: 'Logged Out'
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('verification/request')
  async requestVerification(@CurrentUser() user: User, @Res({passthrough: true}) response: Response) {
    if (user.verified) {
      throw new ConflictException();
    }

    await this.authService.requestVerification(user);
    response.status(HttpStatus.OK);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verification/submit')
  async submitVerification(@CurrentUser() user: User, @Body() data: SubmitOTPDto, @Res({passthrough: true}) response: Response) {
    if (user.verified) {
      throw new ConflictException();
    }

    await this.authService.submitVerification(user, data.otpCode);
    response.status(HttpStatus.OK);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleSignIn(@CurrentUser() user: CreateUserFull, @Res() response: Response) {
    await this.authService.googleSignIn(user, response);
    response.status(HttpStatus.FOUND).redirect(`${process.env.FRONTEND_URL!}/sign-in/pop-up?auth-party=${GoogleSignInParty}`);
  }
}
