import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserFullDto } from './create-user-full.dto';

export class UpdateUserDto extends PartialType(CreateUserFullDto) {}