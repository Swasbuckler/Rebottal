import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LogInUserDto } from 'src/users/dto/log-in-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() inputData: CreateUserDto) {
    return await this.authService.signUp(inputData);
  }

  @Post('log-in')
  async logIn(@Body() inputData: LogInUserDto) {
    return await this.authService.logIn(inputData);
  }
}
