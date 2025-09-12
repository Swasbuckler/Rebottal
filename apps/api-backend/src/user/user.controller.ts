import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@rebottal/app-definitions';
import { CheckDataDto } from './dto/check-data.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Post('search')
  async findUser(@Body() usernameOrEmail: string): Promise<User | null> {
    return await this.userService.findUser(usernameOrEmail);
  }

  @Post(':uuid/update')
  async updateUser(@Param('uuid') uuid: string, @Body() inputData: UpdateUserDto): Promise<User> {
    return await this.userService.updateUser(uuid, inputData);
  }

  @Post(':uuid/delete')
  async deleteUser(@Param('uuid') uuid: string): Promise<User> {
    return await this.userService.deleteUser(uuid);
  }

  @Post('check/username')
  async checkUsernameAvailability(@Body() inputData: CheckDataDto): Promise<boolean> {
    return await this.userService.doesUsernameExists(inputData.value);
  }

  @Post('check/email')
  async checkEmailAvailability(@Body() inputData: CheckDataDto): Promise<boolean> {
    return await this.userService.doesEmailExists(inputData.value);
  }
}
