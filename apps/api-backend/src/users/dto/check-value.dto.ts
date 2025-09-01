import { ApiProperty } from "@nestjs/swagger";
import { CheckValue } from "@rebottal/validation-definitions";

export class CheckValueDto implements CheckValue {
  @ApiProperty({required: true})
  value: any;
}