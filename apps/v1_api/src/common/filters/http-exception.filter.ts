import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    if (!(exception instanceof HttpException)) {
      this.logger.error(
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const messageObj =
      typeof message === 'object' && message !== null
        ? (message as Record<string, unknown>)
        : null;
    const code =
      messageObj && typeof messageObj.code === 'string'
        ? (messageObj.code as string)
        : undefined;

    response.status(status).json({
      status: 'error',
      statusCode: status,
      code: code ?? 'INTERNAL_ERROR',
      message:
        typeof message === 'string'
          ? message
          : messageObj && typeof messageObj.message === 'string'
            ? (messageObj.message as string)
            : message,
      details: messageObj?.details ?? null,
      timestamp: new Date().toISOString(),
    });
  }
}
