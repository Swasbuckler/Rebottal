import { ApiProperty } from "@nestjs/swagger";

export class ModelInputDto {
  @ApiProperty({required: true})
  text: string;
}