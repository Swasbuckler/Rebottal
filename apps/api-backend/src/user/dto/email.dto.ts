import { emailFormSchema } from "@rebottal/app-definitions";
import { createZodDto } from "nestjs-zod";

export class EmailDto extends createZodDto(emailFormSchema) {}