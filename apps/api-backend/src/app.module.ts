import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_PIPE } from '@nestjs/core';
import { BadRequestException } from "@nestjs/common";
import { createZodValidationPipe } from "nestjs-zod";
import { ZodError } from "zod";
import { ModelModule } from './model/model.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from './mailer/mailer.module';
import { OtpModule } from './otp/otp.module';

const MyZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) => new BadRequestException('Data is not valid'),
})

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: MyZodValidationPipe
    },
  ],
  imports: [
    PrismaModule, 
    UserModule, 
    AuthModule, 
    ModelModule, 
    RefreshTokenModule,
    MailerModule,
    OtpModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 1000,
          limit: 3,
        },
        {
          name: 'medium',
          ttl: 10000,
          limit: 20
        },
        {
          name: 'long',
          ttl: 60000,
          limit: 100
        }
      ]
    }),
  ],
})
export class AppModule {}
