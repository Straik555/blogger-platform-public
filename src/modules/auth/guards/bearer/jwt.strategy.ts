import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthConfig } from '../../config/auth.config';
import { JwtAuthViewDto } from './jwt-auth.view-dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(authConfig: AuthConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.acSecret,
    });
  }

  validate(payload: { userId: string }): JwtAuthViewDto {
    return { id: payload.userId };
  }
}
