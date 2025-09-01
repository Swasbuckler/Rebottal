import { logInFormSchema } from "@rebottal/validation-definitions";
import { createZodDto } from "nestjs-zod";

export class LogInUserDto extends createZodDto(logInFormSchema) {}