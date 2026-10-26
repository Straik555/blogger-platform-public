import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { DomainException } from '../../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../../core/helpers/error-message.helper';
import { UserContextDto } from '../../dto/user-context.dto';

export const ExtractUserFromRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserContextDto => {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: errorMessageHelper.unAuthorized(),
      });
    }

    return user;
  },
);
