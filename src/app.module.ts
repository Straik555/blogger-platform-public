import { Module } from '@nestjs/common';
import { ConditionalModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configModule } from './config.module';
import { CoreConfig } from './core/config/core.config';
import { CoreConfigConstant } from './core/config/core-config.constant';
import { Environments } from './core/config/environments.config';
import { CoreModule } from './core/core.module';
import { AllExceptionsFilter } from './core/exception/all-exceptions.filter';
import { DomainExceptionsFilter } from './core/exception/domain/domain-exception.filter';
import { CustomValidationPipe } from './core/pipes/custom-validation.pipe';
import { AuthModule } from './modules/auth/auth.module';
import { ContentModule } from './modules/content/content.module';
import { SecurityDeviceModule } from './modules/security-devices/security-device.module';
import { TestingModule } from './modules/testing/testing.module';
import { UsersModule } from './modules/users/user.module';

@Module({
  imports: [
    configModule,
    CoreModule,
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 10000,
        limit: 5,
      },
    ]),
    TypeOrmModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => ({
        type: 'postgres',
        host: coreConfig.postgresHost,
        port: coreConfig.postgresPort,
        username: coreConfig.postgresUsername,
        password: coreConfig.postgresPassword,
        database: coreConfig.postgresDB,
        autoLoadEntities: true,
        uuidExtension: 'pgcrypto',
        synchronize: false,
        ssl: coreConfig.postgresSsl ? { rejectUnauthorized: false } : false,
        logging:
          (coreConfig.env as Environments) === Environments.DEVELOPMENT
            ? true
            : ['error'],
      }),
      inject: [CoreConfig],
    }),
    ConditionalModule.registerWhen(
      TestingModule,
      (env: NodeJS.ProcessEnv) =>
        env[CoreConfigConstant.includeTestingModule] === 'true',
    ),
    AuthModule,
    UsersModule,
    ContentModule,
    SecurityDeviceModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DomainExceptionsFilter,
    },
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe,
    },
    AppService,
  ],
})
export class AppModule {}
