import { ApiProperty } from "@nestjs/swagger";
import { CheckValue } from "@rebottal/interfaces";

export class CheckValueDto implements CheckValue {
  @ApiProperty({required: true})
  value: any;
}