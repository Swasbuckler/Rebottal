import { ApiProperty } from "@nestjs/swagger";
import { CreateUser } from "@rebottal/interfaces";

export class CreateUserDto implements CreateUser {
  @ApiProperty({required: true})
  username: string;

  @ApiProperty({required: true})
  email: string;

  @ApiProperty({required: true})
  password: string;
}