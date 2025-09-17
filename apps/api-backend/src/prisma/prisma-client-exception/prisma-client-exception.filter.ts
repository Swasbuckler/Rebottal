import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { ErrorMessage } from '@rebottal/app-definitions';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const errorMessage: ErrorMessage = {
      cause: 'Prisma',
      code: '',
      message: '',
    };

    switch (exception.code) {
      case 'P2002': {
        errorMessage.code = exception.code,
        errorMessage.message = exception.meta!.target!.toString();
        response.status(HttpStatus.CONFLICT).json(errorMessage);
        break;
      }
      default:
        errorMessage.code = exception.code,
        errorMessage.message = exception.message;
        response.status(200).json(errorMessage);
        super.catch(exception, host);
    }
  }
}
