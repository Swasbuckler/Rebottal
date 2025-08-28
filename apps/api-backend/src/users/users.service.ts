import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@rebottal/interfaces';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    return await this.prisma.users.create({data: data});
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.users.findMany();
  }

  async findOne(id: string): Promise<User | null> {
    return await this.prisma.users.findUnique({where: {id}});
  }

  async findUser(usernameOrEmail: string): Promise<User | null> {
    return await this.prisma.users.findFirst({
      where: {
        OR: [
          {username: usernameOrEmail},
          {email: usernameOrEmail}
        ]
      },
    });
  }


  async doesUsernameExists(username: string): Promise<boolean> {
    return Boolean(await this.prisma.users.count({
      where: {
        username: username,
      }
    }));
  }

  async doesEmailExists(email: string): Promise<boolean> {
    return Boolean(await this.prisma.users.count({
      where: {
        email: email,
      }
    }));
  }
}
