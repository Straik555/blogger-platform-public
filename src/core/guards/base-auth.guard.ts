import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { IS_PUBLIC_KEY } from '../../modules/auth/guards/decorators/public.decorator';
import { CoreConfig } from '../config/core.config';
import { DomainException } from '../exception/domain/domain.exception';
import { DomainExceptionCode } from '../exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../helpers/error-message.helper';

@Injectable()
export class BaseAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly coreConfig: CoreConfig,
  ) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: errorMessageHelper.unAuthorized(),
      });
    }

    const token = authHeader.split(' ')[1];
    const credential = Buffer.from(token, 'base64').toString('utf-8');
    const [userName, password] = credential.split(':');
    if (
      userName !== this.coreConfig.adminUsername ||
      password !== this.coreConfig.adminPassword
    ) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: errorMessageHelper.unAuthorized(),
      });
    }
    return true;
  }
}
