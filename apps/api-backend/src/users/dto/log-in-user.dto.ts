import { logInFormSchema } from "../../validation/validation-definitions";
import { createZodDto } from "nestjs-zod";

export class LogInUserDto extends createZodDto(logInFormSchema) {}