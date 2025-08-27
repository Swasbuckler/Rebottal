import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private users: UsersService) {}

  private readonly saltRounds = 10;

  async signUp(data: CreateUserDto) {
    const newUserData: CreateUserDto = JSON.parse(JSON.stringify(data));

    await bcrypt.hash(data.password, this.saltRounds)
      .then((hash) => {
        newUserData.password = hash;
      });

    await this.users.create(newUserData);
  }
}
