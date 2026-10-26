import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';
import { Request } from 'express';

import { DomainException } from '../exception/domain/domain.exception';
import { DomainExceptionCode } from '../exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../helpers/error-message.helper';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Request): Promise<string> {
    const ip = req.ip as string;
    return Promise.resolve(`${ip}:${req.originalUrl}`);
  }

  protected throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    throw new DomainException({
      code: DomainExceptionCode.ToManyRequest,
      message: errorMessageHelper.moreAttempts(),
    });
  }
}
