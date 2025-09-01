import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@rebottal/validation-definitions';
import { CheckValueDto } from './dto/check-value.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() inputData: CreateUserDto): Promise<User> {
    return await this.usersService.createUser(inputData);
  }

  @Get()
  async findAllUsers(): Promise<User[]> {
    return await this.usersService.findAllUsers();
  }

  @Get(':uuid')
  @UseGuards(JwtAuthGuard)
  async findUserByUuid(@Param('uuid') uuid: string): Promise<User | null> {
    return await this.usersService.findUserByUuid(uuid);
  }

  @Post('search')
  async findUser(@Body() usernameOrEmail: string): Promise<User | null> {
    return await this.usersService.findUser(usernameOrEmail);
  }

  @Post(':uuid/update')
  async updateUser(@Param('uuid') uuid: string, @Body() inputData: UpdateUserDto): Promise<User> {
    return await this.usersService.updateUser(uuid, inputData);
  }

  @Post(':uuid/delete')
  async deleteUser(@Param('uuid') uuid: string): Promise<User> {
    return await this.usersService.deleteUser(uuid);
  }

  @Post('check/username')
  async checkUsernameAvailability(@Body() inputData: CheckValueDto): Promise<boolean> {
    return await this.usersService.doesUsernameExists(inputData.value);
  }

  @Post('check/email')
  async checkEmailAvailability(@Body() inputData: CheckValueDto): Promise<boolean> {
    return await this.usersService.doesEmailExists(inputData.value);
  }
}
