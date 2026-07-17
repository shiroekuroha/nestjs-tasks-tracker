import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const logAndThrow = (status: number, msg: string, details: any) => {
      console.log(
        `-----------------------------------------------------------------------------------------------------------`,
      );
      console.log(
        `----------------------------------------- Exception Logging Begin -----------------------------------------`,
      );
      console.log(
        `-----------------------------------------------------------------------------------------------------------`,
      );

      console.log(exception);

      console.log(
        `-----------------------------------------------------------------------------------------------------------`,
      );
      console.log(
        `------------------------------------------ Exception Logging End ------------------------------------------`,
      );
      console.log(
        `-----------------------------------------------------------------------------------------------------------`,
      );

      res.status(status).json({
        method: req.method,
        route: req.originalUrl,
        status: status,
        success: false,
        error: { message: msg, details: details },
      });
    };

    if (exception instanceof Prisma.PrismaClientValidationError) {
      throw new BadRequestException({ message: 'Prisma Validation failed!' });
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const details = {
        version: exception.clientVersion,
        code: exception.code,
        message: exception.message,
        meta: exception.meta ?? {},
      };

      switch (exception.code) {
        case 'P2002':
          logAndThrow(
            HttpStatus.BAD_REQUEST,
            'Unique constraint failed',
            details,
          );
          break;

        case 'P2003':
          logAndThrow(
            HttpStatus.BAD_REQUEST,
            'Foreign key constraint failed',
            details,
          );
          break;

        case 'P2004':
          logAndThrow(
            HttpStatus.BAD_REQUEST,
            'Database constraint failed',
            details,
          );
          break;

        case 'P2014':
          logAndThrow(
            HttpStatus.BAD_REQUEST,
            'Required relation violation',
            details,
          );
          break;

        case 'P2015':
          logAndThrow(
            HttpStatus.NOT_FOUND,
            'Related record not found',
            details,
          );
          break;

        case 'P2018':
          logAndThrow(
            HttpStatus.NOT_FOUND,
            'Required connected records not found',
            details,
          );
          break;

        case 'P2025':
          logAndThrow(HttpStatus.NOT_FOUND, 'Record not found', details);
          break;

        default:
          logAndThrow(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Undocumented Prisma Error',
            details,
          );
          break;
      }
    } else {
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      const response =
        exception instanceof HttpException
          ? exception.getResponse()
          : { message: 'Internal server error' };

      console.log(
        `-----------------------------------------------------------------------------------------------------------`,
      );
      console.log(
        `----------------------------------------- Exception Logging Begin -----------------------------------------`,
      );
      console.log(
        `-----------------------------------------------------------------------------------------------------------`,
      );

      console.log(exception);

      console.log(
        `-----------------------------------------------------------------------------------------------------------`,
      );
      console.log(
        `------------------------------------------ Exception Logging End ------------------------------------------`,
      );
      console.log(
        `-----------------------------------------------------------------------------------------------------------`,
      );

      res.status(HttpStatus.BAD_REQUEST).json({
        method: req.method,
        route: req.originalUrl,
        status: HttpStatus.BAD_REQUEST,
        success: false,
        error: { message: response },
      });
    }
  }
}
