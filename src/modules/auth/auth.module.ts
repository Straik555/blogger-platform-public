import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { StringValue } from 'ms';

import { SessionModule } from '../sessions/session.module';
import { UsersModule } from '../users/user.module';
import { AuthController } from './api/auth.controller';
import { MeLoginQueryHandler } from './aplication/queries/me-login.query';
import { ValidationUserService } from './aplication/services/validation-user.service';
import { ConfirmRegistrationUseCase } from './aplication/usecases/confirm-registration.usecase';
import { LoginUseCase } from './aplication/usecases/login.usecase';
import { LogoutCommandUseCase } from './aplication/usecases/logout.usecase';
import { RefreshTokenUseCase } from './aplication/usecases/refresh-token.usecase';
import { RegistrationUseCase } from './aplication/usecases/registration.usecase';
import { ResendingConfirmationCodeUseCase } from './aplication/usecases/resend-confirmation-code.usecase';
import { UpdatePasswordUseCase } from './aplication/usecases/update-password.usecase';
import { UpdateRecoveryCodeUseCase } from './aplication/usecases/update-recovery-code.usecase';
import { AuthConfig } from './config/auth.config';
import {
  ACCESS_TOKEN_STRATEGY,
  REFRESH_TOKEN_STRATEGY,
} from './constants/auth-token.inject-constants';
import { JwtStrategy } from './guards/bearer/jwt.strategy';
import { JwtRefreshStrategy } from './guards/jwt-refresh/jwt-refresh.strategy';
import { LocalStrategy } from './guards/local/local.strategy';

const useCases = [
  LoginUseCase,
  RegistrationUseCase,
  ConfirmRegistrationUseCase,
  ResendingConfirmationCodeUseCase,
  UpdatePasswordUseCase,
  UpdateRecoveryCodeUseCase,
  RefreshTokenUseCase,
  LogoutCommandUseCase,
  MeLoginQueryHandler,
];

@Module({
  imports: [UsersModule, PassportModule, JwtModule, SessionModule],
  controllers: [AuthController],
  providers: [
    ...useCases,
    {
      provide: ACCESS_TOKEN_STRATEGY,
      useFactory: (authConfig: AuthConfig): JwtService => {
        return new JwtService({
          secret: authConfig.acSecret,
          signOptions: { expiresIn: authConfig.acTime as StringValue },
        });
      },
      inject: [AuthConfig],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY,
      useFactory: (authConfig: AuthConfig): JwtService => {
        return new JwtService({
          secret: authConfig.rtSecret,
          signOptions: { expiresIn: authConfig.rtTime as StringValue },
        });
      },
      inject: [AuthConfig],
    },
    ValidationUserService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    AuthConfig,
  ],
})
export class AuthModule {}
