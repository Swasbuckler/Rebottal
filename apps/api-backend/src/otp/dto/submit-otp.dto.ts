import { submitOTPCodeSchema } from "@rebottal/app-definitions";
import { createZodDto } from "nestjs-zod";

export class SubmitOTPDto extends createZodDto(submitOTPCodeSchema) {}
