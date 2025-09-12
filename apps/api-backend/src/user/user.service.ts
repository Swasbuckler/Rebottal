import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@rebottal/app-definitions';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  private readonly saltRounds = 10;

  async createUser(data: CreateUserDto): Promise<User> {
    const newUserData: CreateUserDto = JSON.parse(JSON.stringify(data));

    const hash = await bcrypt.hash(data.password, this.saltRounds)
    newUserData.password = hash;

    return await this.prismaService.user.create({data: newUserData});
  }

  async findAllUsers(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  async findUserByUuid(uuid: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: {
        uuid
      }
    });
  }

  async findUser(usernameOrEmail: string): Promise<User | null> {
    return await this.prismaService.user.findFirst({
      where: {
        OR: [
          {username: usernameOrEmail},
          {email: usernameOrEmail}
        ]
      },
    });
  }

  async updateUser(uuid: string, data: UpdateUserDto): Promise<User> {
    const newUserData: UpdateUserDto = JSON.parse(JSON.stringify(data));

    if (newUserData.password) {
      const hash = await bcrypt.hash(newUserData.password, this.saltRounds)
      newUserData.password = hash;
    }
    
    return await this.prismaService.user.update({
      data: newUserData,
      where: {
        uuid
      },
    });
  }

  async deleteUser(uuid: string): Promise<User> {
    return await this.prismaService.user.delete({
      where: {
        uuid
      }
    })
  }

  async doesUsernameExists(username: string): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: {
        username
      }
    });

    if (user) return true;
    else return false;
  }

  async doesEmailExists(email: string): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email
      }
    });

    if (user) return true;
    else return false;
  }
}
