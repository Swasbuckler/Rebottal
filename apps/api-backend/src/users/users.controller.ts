import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@rebottal/interfaces';
import { CheckValueDto } from './dto/check-value.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() inputData: CreateUserDto) {
    return await this.usersService.create(inputData);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User | null> {
    return await this.usersService.findOne(id);
  }

  @Post('check-username')
  async checkUsernameAvailability(@Body() inputData: CheckValueDto): Promise<boolean> {
    return await this.usersService.doesUsernameExists(inputData.value);
  }

  @Post('check-email')
  async checkEmailAvailability(@Body() inputData: CheckValueDto): Promise<boolean> {
    return await this.usersService.doesEmailExists(inputData.value);
  }
}
