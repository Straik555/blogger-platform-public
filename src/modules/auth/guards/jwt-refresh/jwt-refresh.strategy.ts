import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

import { AuthConfig } from '../../config/auth.config';
import { extractJwtFromCookie } from './extract-jwt-from-cookie';
import { RefreshTokenContextDto } from './refresh-token-context.dto';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(authConfig: AuthConfig) {
    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: authConfig.rtSecret,
    });
  }

  validate(payload: RefreshTokenContextDto): RefreshTokenContextDto {
    return {
      userId: payload.userId,
      deviceId: payload.deviceId,
      iat: payload.iat,
    };
  }
}
