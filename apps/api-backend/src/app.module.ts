import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_PIPE } from '@nestjs/core';
import { BadRequestException } from "@nestjs/common";
import { createZodValidationPipe } from "nestjs-zod";
import { ZodError } from "zod";

const MyZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) => new BadRequestException('Data is not valid'),
})

@Module({
  imports: [PrismaModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: MyZodValidationPipe
    }
  ],
})
export class AppModule {}
