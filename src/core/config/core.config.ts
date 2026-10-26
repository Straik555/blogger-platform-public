import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { configErrorMessages } from '../utility/config-error-messages';
import { configValidationUtility } from '../utility/config-validation.utility';
import {
  CoreConfigConstant,
  CoreConfigConstantVariables,
} from './core-config.constant';
import { Environments } from './environments.config';

@Injectable()
export class CoreConfig {
  @IsInt({
    message: configErrorMessages.number(CoreConfigConstant.port, 3000),
  })
  @Min(1)
  @Max(65535)
  port: number = Number(this.configService.get(CoreConfigConstant.port));

  @IsString()
  @IsNotEmpty({
    message: configErrorMessages.required(
      CoreConfigConstant.mongoUrl,
      'mongodb://localhost:27017/my-app-local-db',
    ),
  })
  mongoURI: string = String(
    this.configService.get(CoreConfigConstant.mongoUrl),
  );

  @IsString()
  @IsNotEmpty({
    message: configErrorMessages.required(
      CoreConfigConstant.redisUrl,
      'redis://default:password@host:port',
    ),
  })
  redisUrl: string = String(
    this.configService.get(CoreConfigConstant.redisUrl),
  );

  @IsString()
  @IsNotEmpty({
    message: configErrorMessages.required(
      CoreConfigConstant.postgresHost,
      'localhost',
    ),
  })
  postgresHost: string = String(
    this.configService.get(CoreConfigConstant.postgresHost),
  );

  @IsInt({
    message: configErrorMessages.number(CoreConfigConstant.postgresPort, 5432),
  })
  @Min(1)
  @Max(65535)
  postgresPort: number = Number(
    this.configService.get(CoreConfigConstant.postgresPort),
  );

  @IsString()
  @IsNotEmpty({
    message: configErrorMessages.required(
      CoreConfigConstant.postgresUsername,
      'postgres',
    ),
  })
  postgresUsername: string = String(
    this.configService.get(CoreConfigConstant.postgresUsername),
  );

  @IsString()
  @IsNotEmpty({
    message: configErrorMessages.required(
      CoreConfigConstant.postgresPassword,
      'postgres',
    ),
  })
  postgresPassword: string = String(
    this.configService.get(CoreConfigConstant.postgresPassword),
  );

  @IsString()
  @IsNotEmpty({
    message: configErrorMessages.required(
      CoreConfigConstant.postgresDB,
      'postgres',
    ),
  })
  postgresDB: string = String(
    this.configService.get(CoreConfigConstant.postgresDB),
  );

  @IsBoolean({
    message: configErrorMessages.boolean(
      CoreConfigConstant.postgresSsl,
      'enable/disable SSL for the Postgres connection',
    ),
  })
  postgresSsl: boolean = configValidationUtility.convertToBoolean(
    this.configService.get(CoreConfigConstant.postgresSsl),
  ) as boolean;

  @IsEnum(Environments, {
    message: configErrorMessages.enum(
      CoreConfigConstant.nodeEnv,
      configValidationUtility.getEnumValues(Environments),
    ),
  })
  env: string = String(this.configService.get(CoreConfigConstant.nodeEnv));

  @IsString()
  @IsNotEmpty({
    message: configErrorMessages.required(CoreConfigConstant.dbName, 'dev_db'),
  })
  dbName: string = String(this.configService.get(CoreConfigConstant.dbName));

  @IsBoolean({
    message: configErrorMessages.boolean(CoreConfigConstant.isSwaggerEnabled),
  })
  isSwaggerEnabled: boolean = configValidationUtility.convertToBoolean(
    this.configService.get(CoreConfigConstant.isSwaggerEnabled),
  ) as boolean;

  @IsString()
  @IsNotEmpty({
    message: configErrorMessages.required(
      CoreConfigConstant.adminUsername,
      'adminUsername',
    ),
  })
  adminUsername: string = String(
    this.configService.get(CoreConfigConstant.adminUsername),
  );

  @IsString()
  @IsNotEmpty({
    message: configErrorMessages.required(
      CoreConfigConstant.adminPassword,
      'adminPassword',
    ),
  })
  adminPassword: string = String(
    this.configService.get(CoreConfigConstant.adminPassword),
  );

  constructor(
    private readonly configService: ConfigService<
      CoreConfigConstantVariables,
      true
    >,
  ) {
    configValidationUtility.validateConfig(this);
  }
}
