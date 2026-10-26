import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { configErrorMessages } from '../../../core/utility/config-error-messages';
import { configValidationUtility } from '../../../core/utility/config-validation.utility';
import {
  NotificationsConfigConstant,
  NotificationsConfigConstantVariables,
} from './notifications-config.constant';

@Injectable()
export class NotificationsConfig {
  @IsEmail(
    {},
    {
      message: configErrorMessages.required(
        NotificationsConfigConstant.email,
        'dev@example.com',
      ),
    },
  )
  email: string = String(
    this.configService.get(NotificationsConfigConstant.email),
  );

  @IsString()
  @IsNotEmpty({
    message: configErrorMessages.required(
      NotificationsConfigConstant.emailPass,
      'dev_pass',
    ),
  })
  emailPass: string = String(
    this.configService.get(NotificationsConfigConstant.emailPass),
  );
  constructor(
    private readonly configService: ConfigService<
      NotificationsConfigConstantVariables,
      true
    >,
  ) {
    configValidationUtility.validateConfig(this);
  }
}
