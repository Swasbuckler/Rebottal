import { createUserSchema } from "../../validation/validation-definitions";
import { createZodDto } from "nestjs-zod";

export class CreateUserDto extends createZodDto(createUserSchema) {}