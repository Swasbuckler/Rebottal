import { ApiProperty } from "@nestjs/swagger";
import { LogInUser } from "@rebottal/interfaces";

export class LogInUserDto implements LogInUser {
  @ApiProperty({required: true})
  usernameOrEmail: string;

  @ApiProperty({required: true})
  password: string;
}