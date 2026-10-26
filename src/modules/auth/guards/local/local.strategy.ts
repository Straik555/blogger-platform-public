import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { FieldNames } from '../../../../core/constants/field-names.constant';
import { ValidationUserService } from '../../aplication/services/validation-user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private validationUserService: ValidationUserService) {
    super({ usernameField: FieldNames.LOGIN_OR_EMAIL });
  }

  async validate(loginOrEmail: string, password: string) {
    return this.validationUserService.execute(loginOrEmail, password);
  }
}
