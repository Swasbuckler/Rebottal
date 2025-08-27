import { ApiProperty } from "@nestjs/swagger";
import { CheckString } from "@rebottal/interfaces";

export class CheckStringDto implements CheckString {
  @ApiProperty({required: true})
  stringValue: string;
}