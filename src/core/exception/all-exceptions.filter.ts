import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { CoreConfig } from '../config/core.config';
import { Environments } from '../config/environments.config';
import { errorMessageHelper } from '../helpers/error-message.helper';
import { DomainExceptionCode } from './domain/domain-exception-codes';
import { ErrorResponseBodyAdminType } from './error-response-body-admin.type';
import { ErrorResponseFormatValidation } from './error-response-format.validation';

@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  constructor(private readonly coreConfig: CoreConfig) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      return response
        .status(exception.getStatus())
        .send({ message: exception.message });
    }

    const message =
      exception instanceof Error
        ? exception?.message
        : errorMessageHelper.unknownException();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.error(
      `${request.method} ${request.url} - ${
        exception instanceof Error ? exception.message : String(exception)
      }`,
      exception instanceof Error ? exception.stack : undefined,
    );

    const responseBody = this.createResponse(request.url, message);

    response.status(status).send(responseBody);
  }

  private createResponse(
    requestUrl: string,
    message: string,
  ): ErrorResponseFormatValidation | ErrorResponseBodyAdminType {
    const isDev = this.coreConfig.env === (Environments.DEVELOPMENT as string);
    if (isDev) {
      return {
        timestamp: new Date().toISOString(),
        path: requestUrl,
        message,
        extensions: [],
        code: DomainExceptionCode.InternalServerError,
      };
    }
    return ErrorResponseFormatValidation.build([
      {
        message: errorMessageHelper.somethingWrong(),
        field: '',
      },
    ]);
  }
}
