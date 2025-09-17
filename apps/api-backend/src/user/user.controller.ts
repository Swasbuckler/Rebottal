import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@rebottal/app-definitions';
import { CheckDataDto } from './dto/check-data.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Throttle({default: {limit: 3, ttl: 1000}})
  @Post()
  async createUser(@Body() inputData: CreateUserDto): Promise<User> {
    return await this.userService.createUser(inputData);
  }

  @Get()
  async findAllUsers(): Promise<User[]> {
    return await this.userService.findAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':uuid')
  async findUserByUuid(@Param('uuid') uuid: string): Promise<User | null> {
    return await this.userService.findUserByUuid(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Post('search')
  async findUser(@Body() usernameOrEmail: string): Promise<User | null> {
    return await this.userService.findUser(usernameOrEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':uuid/update')
  async updateUser(@Param('uuid') uuid: string, @Body() inputData: UpdateUserDto): Promise<User> {
    return await this.userService.updateUser(uuid, inputData);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':uuid/delete')
  async deleteUser(@Param('uuid') uuid: string): Promise<User> {
    return await this.userService.deleteUser(uuid);
  }

  @Throttle({default: {limit: 10, ttl: 1000}})
  @Post('check/username')
  async checkUsernameAvailability(@Body() inputData: CheckDataDto): Promise<boolean> {
    return await this.userService.doesUsernameExists(inputData.value);
  }

  @Throttle({default: {limit: 10, ttl: 1000}})
  @Post('check/email')
  async checkEmailAvailability(@Body() inputData: CheckDataDto): Promise<boolean> {
    return await this.userService.doesEmailExists(inputData.value);
  }
}
