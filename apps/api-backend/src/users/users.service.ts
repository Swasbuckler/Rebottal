import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@rebottal/validation-definitions';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private readonly saltRounds = 10;

  async createUser(data: CreateUserDto): Promise<User> {
    const newUserData: CreateUserDto = JSON.parse(JSON.stringify(data));

    const hash = await bcrypt.hash(data.password, this.saltRounds)
    newUserData.password = hash;

    return await this.prisma.users.create({data: newUserData});
  }

  async findAllUsers(): Promise<User[]> {
    return await this.prisma.users.findMany();
  }

  async findUserByUuid(uuid: string): Promise<User | null> {
    return await this.prisma.users.findUnique({
      where: {
        uuid
      }
    });
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

  async updateUser(uuid: string, data: UpdateUserDto): Promise<User> {
    const newUserData: UpdateUserDto = JSON.parse(JSON.stringify(data));

    if (newUserData.password) {
      const hash = await bcrypt.hash(newUserData.password, this.saltRounds)
      newUserData.password = hash;
    }

    if (newUserData.refreshToken) {
      const hash = await bcrypt.hash(newUserData.refreshToken, this.saltRounds)
      newUserData.refreshToken = hash;
    }

    return await this.prisma.users.update({
      data: newUserData,
      where: {
        uuid
      },
    });
  }

  async deleteUser(uuid: string): Promise<User> {
    return await this.prisma.users.delete({
      where: {
        uuid
      }
    })
  }

  async doesUsernameExists(username: string): Promise<boolean> {
    return Boolean(await this.prisma.users.count({
      where: {
        username
      }
    }));
  }

  async doesEmailExists(email: string): Promise<boolean> {
    return Boolean(await this.prisma.users.count({
      where: {
        email
      }
    }));
  }
}
