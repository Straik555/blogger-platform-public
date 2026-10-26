import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { ErrorResponseFormatValidation } from '../error-response-format.validation';
import { DomainException } from './domain.exception';
import { DomainExceptionCode } from './domain-exception-codes';

@Catch(DomainException)
export class DomainExceptionsFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = this.mapToHttpStatus(exception.code);

    const responseBody = this.buildResponseBody(status, exception);
    response.status(status).send(responseBody);
  }

  private buildResponseBody(status: number, exception: DomainException) {
    const simpleStatuses = [
      HttpStatus.UNAUTHORIZED,
      HttpStatus.FORBIDDEN,
      HttpStatus.NOT_FOUND,
    ];

    if (simpleStatuses.includes(status)) {
      return { message: exception.message };
    }

    return ErrorResponseFormatValidation.build(exception.errorsMessages);
  }

  private mapToHttpStatus(code: DomainExceptionCode): number {
    switch (code) {
      case DomainExceptionCode.BadRequest:
      case DomainExceptionCode.ValidationError:
      case DomainExceptionCode.ConfirmationCodeExpired:
      case DomainExceptionCode.EmailNotConfirmed:
      case DomainExceptionCode.PasswordRecoveryCodeExpired:
      case DomainExceptionCode.ConfirmationCodeAlreadyUsed:
        return HttpStatus.BAD_REQUEST;
      case DomainExceptionCode.Forbidden:
        return HttpStatus.FORBIDDEN;
      case DomainExceptionCode.NotFound:
        return HttpStatus.NOT_FOUND;
      case DomainExceptionCode.Unauthorized:
        return HttpStatus.UNAUTHORIZED;
      case DomainExceptionCode.Conflict:
        return HttpStatus.CONFLICT;
      case DomainExceptionCode.ToManyRequest:
        return HttpStatus.TOO_MANY_REQUESTS;
      case DomainExceptionCode.InternalServerError:
        return HttpStatus.INTERNAL_SERVER_ERROR;
      default:
        return HttpStatus.I_AM_A_TEAPOT;
    }
  }
}
