import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcrypt';
import { LogInUserDto } from 'src/users/dto/log-in-user.dto';

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
    return {status: HttpStatus.OK};
  }

  async logIn(data: LogInUserDto) {
    const user = await this.users.findUser(data.usernameOrEmail);
    
    if (!user) {
      throw new UnauthorizedException();
    }
    if (!(await bcrypt.compare(data.password, user?.password!))) {
      throw new UnauthorizedException();
    }

    const {password, ...result} = user!;

  }
}
