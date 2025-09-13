import { createOTPSchema } from "@rebottal/app-definitions";
import { createZodDto } from "nestjs-zod";

export class CreateOtpDto extends createZodDto(createOTPSchema) {}
