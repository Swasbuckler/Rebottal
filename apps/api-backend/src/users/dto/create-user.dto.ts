import { ApiProperty } from "@nestjs/swagger";
import { CreateUser } from "@rebottal/interfaces";

export class CreateUserDto implements CreateUser {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}