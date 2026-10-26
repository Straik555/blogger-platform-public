import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JwtAuthViewDto } from './jwt-auth.view-dto';

@Injectable()
export class JwtOptionalAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = JwtAuthViewDto>(
    err: any,
    user: JwtAuthViewDto | false,
  ): TUser {
    if (err || !user) {
      return null as TUser;
    }
    return user as TUser;
  }
}
