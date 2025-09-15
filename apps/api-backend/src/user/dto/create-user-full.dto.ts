import { createUserFullSchema } from "@rebottal/app-definitions";
import { createZodDto } from "nestjs-zod";

export class CreateUserFullDto extends createZodDto(createUserFullSchema) {}