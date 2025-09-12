import { createUserSchema } from "@rebottal/app-definitions";
import { createZodDto } from "nestjs-zod";

export class CreateUserDto extends createZodDto(createUserSchema) {}