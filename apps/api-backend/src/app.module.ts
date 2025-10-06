import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { BadRequestException } from "@nestjs/common";
import { createZodValidationPipe } from "nestjs-zod";
import { ZodError } from "zod";
import { ModelModule } from './model/model.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from './mailer/mailer.module';
import { OtpModule } from './otp/otp.module';
import { ScheduleModule } from '@nestjs/schedule';

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
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
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
          ttl: 60000,
          limit: 100
        }
      ]
    }),
    ScheduleModule.forRoot()
  ],
})
export class AppModule {}
