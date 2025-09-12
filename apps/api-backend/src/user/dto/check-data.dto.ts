import { ApiProperty } from "@nestjs/swagger";
import { CheckData } from "@rebottal/app-definitions";

export class CheckDataDto implements CheckData {
  @ApiProperty({required: true})
  value: string;
}