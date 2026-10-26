import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { FieldNames } from '../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../core/helpers/error-message.helper';
import { SessionsExternalService } from '../../../sessions/application/external/sessions.external-service';
import { RefreshTokenContextDto } from './refresh-token-context.dto';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  constructor(
    private readonly sessionsExternalService: SessionsExternalService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    const request: { user: RefreshTokenContextDto } = context
      .switchToHttp()
      .getRequest();
    const { iat, userId, deviceId } = request.user;
    const session = await this.sessionsExternalService.findSessionOrThrow(
      userId,
      deviceId,
    );
    const sessionIatSeconds = Math.floor(session.updatedAt.getTime() / 1000);
    if (sessionIatSeconds !== iat) {
      const message = errorMessageHelper.unAuthorized();
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message,
        errorsMessages: [
          {
            message,
            field: FieldNames.REFRESH_TOKEN,
          },
        ],
      });
    }
    return true;
  }
  handleRequest<TUser = RefreshTokenContextDto>(
    err: unknown,
    user: RefreshTokenContextDto | false,
  ): TUser {
    if (err || !user) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: errorMessageHelper.unAuthorized(),
      });
    }
    return user as TUser;
  }
}
