import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

import { configErrorMessages } from '../../../core/utility/config-error-messages';
import { configValidationUtility } from '../../../core/utility/config-validation.utility';
import {
  AuthConfigConstant,
  AuthConfigConstantVariables,
} from './auth-config.constant';

@Injectable()
export class AuthConfig {
  @IsString()
  @IsNotEmpty({
    message: configErrorMessages.required(AuthConfigConstant.acTime, '15m'),
  })
  @Matches(/^\d+(ms|s|m|h|d|w|y)$/, {
    message: configErrorMessages.matches(
      AuthConfigConstant.acTime,
      ' e.g. 15m, 1h, 30d',
    ),
  })
  acTime: string = String(this.configService.get(AuthConfigConstant.acTime));

  @IsString()
  @IsNotEmpty({
    message: configErrorMessages.required(AuthConfigConstant.rtTime, '30d'),
  })
  @Matches(/^\d+(ms|s|m|h|d|w|y)$/, {
    message: configErrorMessages.matches(
      AuthConfigConstant.rtTime,
      ' e.g. 15m, 1h, 30d',
    ),
  })
  rtTime: string = String(this.configService.get(AuthConfigConstant.rtTime));

  @IsString()
  @IsNotEmpty({
    message: configErrorMessages.required(
      AuthConfigConstant.acSecret,
      'f1f5deg4hy5fr5d5g',
    ),
  })
  acSecret: string = String(
    this.configService.get(AuthConfigConstant.acSecret),
  );

  @IsString()
  @IsNotEmpty({
    message: configErrorMessages.required(
      AuthConfigConstant.rtSecret,
      'rdtfyguhijokpl5loki76',
    ),
  })
  rtSecret: string = String(
    this.configService.get(AuthConfigConstant.rtSecret),
  );

  constructor(
    private readonly configService: ConfigService<
      AuthConfigConstantVariables,
      true
    >,
  ) {
    configValidationUtility.validateConfig(this);
  }
}
