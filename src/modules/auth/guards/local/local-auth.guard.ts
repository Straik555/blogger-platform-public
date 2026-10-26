import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { DomainException } from '../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../core/helpers/error-message.helper';
import { User } from '../../../users/domain/user.entity';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest<TUser = User>(err: unknown, user: User | false): TUser {
    if (err instanceof Error) {
      throw err;
    }
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: errorMessageHelper.unAuthorized(),
      });
    }
    return user as TUser;
  }
}
