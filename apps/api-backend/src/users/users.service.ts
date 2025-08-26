import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateUserDto) {
    return this.prisma.users.create({data: data});
  }

  findAll() {
    return this.prisma.users.findMany();
  }

  findOne(id: string) {
    return this.prisma.users.findUnique({where: {id}});
  }
}
