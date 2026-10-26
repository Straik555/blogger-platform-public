import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { UserMeViewDto } from '../../../auth/api/view-dto/user-me.view-dto';
import { UpdatePasswordDto } from '../../../auth/dto/update-password.dto';
import { UserExternalViewDto } from '../../api/view-dto/user-external.view-dto';
import { User } from '../../domain/user.entity';
import { Email } from '../../domain/value-objects/email';
import { CreateUserDto } from '../../dto/create-user.dto';
import { GetByLoginOrEmailQuery } from '../queries/get-by-login-or-email.query';
import { GetMeByUserIdQuery } from '../queries/get-me-by-user-id.query';
import { GetUserByUserIdLeanQuery } from '../queries/get-user-by-user-id-lean.query';
import { ConfirmRegistrationCommand } from '../usecases/confirm-registration.usecase';
import { RegistrationUserCommand } from '../usecases/registration-user.usecase';
import { ResendConfirmationCodeCommand } from '../usecases/resend-confirmation-code.usecase';
import { UpdatePasswordCommand } from '../usecases/update-password.usecase';
import { UpdateRecoveryCodeCommand } from '../usecases/update-recovery-code-command.usecase';

@Injectable()
export class UsersExternalService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  async findByUserId(userId: string): Promise<UserExternalViewDto> {
    return await this.queryBus.execute(new GetUserByUserIdLeanQuery(userId));
  }

  async findMeByUserId(userId: string): Promise<UserMeViewDto> {
    return await this.queryBus.execute(new GetMeByUserIdQuery(userId));
  }

  async registerUser(dto: CreateUserDto): Promise<void> {
    return await this.commandBus.execute(new RegistrationUserCommand(dto));
  }

  async confirmRegistration(code: string): Promise<void> {
    return await this.commandBus.execute(new ConfirmRegistrationCommand(code));
  }

  async resendConfirmationCode(email: string): Promise<void> {
    const normalizeEmail = Email.create(email);
    return await this.commandBus.execute(
      new ResendConfirmationCodeCommand(normalizeEmail),
    );
  }

  async updatePassword(dto: UpdatePasswordDto): Promise<void> {
    return await this.commandBus.execute(new UpdatePasswordCommand(dto));
  }

  async updateRecoveryCode(email: string): Promise<void> {
    const normalizeEmail = Email.create(email);
    return await this.commandBus.execute(
      new UpdateRecoveryCodeCommand(normalizeEmail),
    );
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<User> {
    return await this.queryBus.execute(
      new GetByLoginOrEmailQuery(loginOrEmail),
    );
  }
}
