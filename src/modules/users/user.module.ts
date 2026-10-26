import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BcryptService } from '../../core/services/bcrypt.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { SessionModule } from '../sessions/session.module';
import { UsersController } from './api/users.controller';
import { UsersExternalService } from './application/external/users.external-service';
import { UserFactory } from './application/factories/user.factory';
import { GetAllUsersQueryHandler } from './application/queries/get-all-user.query';
import { GetByLoginOrEmailQueryHandler } from './application/queries/get-by-login-or-email.query';
import { GetMeByUserIdQueryHandler } from './application/queries/get-me-by-user-id.query';
import { GetUserByUserIdLeanQueryHandler } from './application/queries/get-user-by-user-id-lean.query';
import { UserFinderService } from './application/services/user-finder.service';
import { ConflictRegistrationUseCase } from './application/usecases/confirm-registration.usecase';
import { CreateAdminUserUseCase } from './application/usecases/create-admin-user.usecase';
import { DeleteUserUseCase } from './application/usecases/delete-user.usecase';
import { RegisterUserUseCase } from './application/usecases/registration-user.usecase';
import { ResetConfirmationCodeUseCase } from './application/usecases/resend-confirmation-code.usecase';
import { UpdatePasswordUseCase } from './application/usecases/update-password.usecase';
import { UpdateRecoveryCodeUseCase } from './application/usecases/update-recovery-code-command.usecase';
import { UsersUniquenessValidator } from './application/validators/users-uniqueness.validator';
import { EmailConfirmation } from './domain/email-confirmation.entity';
import { RecoveryPassword } from './domain/recovery-password.entity';
import { User } from './domain/user.entity';
import { EmailConfirmationRepository } from './infrastructure/email-confirmation.repository';
import { UsersQueryRepository } from './infrastructure/query/users-query.repository';
import { RecoveryPasswordsRepository } from './infrastructure/recovery-passwords.repository';
import { UsersRepository } from './infrastructure/users.repository';

const useCases = [
  CreateAdminUserUseCase,
  DeleteUserUseCase,
  GetAllUsersQueryHandler,

  //   External
  RegisterUserUseCase,
  ConflictRegistrationUseCase,
  ResetConfirmationCodeUseCase,
  UpdatePasswordUseCase,
  UpdateRecoveryCodeUseCase,
  GetUserByUserIdLeanQueryHandler,
  GetMeByUserIdQueryHandler,
  GetByLoginOrEmailQueryHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EmailConfirmation, RecoveryPassword]),
    NotificationsModule,
    SessionModule,
  ],
  controllers: [UsersController],
  providers: [
    ...useCases,
    BcryptService,
    UserFinderService,
    UsersExternalService,
    UsersRepository,
    RecoveryPasswordsRepository,
    EmailConfirmationRepository,
    UsersQueryRepository,
    UsersUniquenessValidator,
    UserFactory,
  ],
  exports: [BcryptService, UsersExternalService],
})
export class UsersModule {}
