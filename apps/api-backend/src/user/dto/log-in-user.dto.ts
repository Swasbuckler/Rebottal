import { logInFormSchema } from "@rebottal/app-definitions";
import { createZodDto } from "nestjs-zod";

export class LogInUserDto extends createZodDto(logInFormSchema) {}