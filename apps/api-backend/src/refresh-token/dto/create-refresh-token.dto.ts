import { createRefreshTokenSchema } from "@rebottal/app-definitions";
import { createZodDto } from "nestjs-zod";

export class CreateRefreshTokenDto extends createZodDto(createRefreshTokenSchema) {}