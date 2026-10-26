import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { EmailConfirmationSenderService } from '../../../notifications/application/service/email-confirmation-sender.service';
import { TemplateType } from '../../../notifications/application/service/template.type';
import { RecoveryPassword } from '../../domain/recovery-password.entity';
import { Email } from '../../domain/value-objects/email';
import { RecoveryPasswordsRepository } from '../../infrastructure/recovery-passwords.repository';
import { UsersRepository } from '../../infrastructure/users.repository';

export class UpdateRecoveryCodeCommand {
  constructor(public email: Email) {}
}

@CommandHandler(UpdateRecoveryCodeCommand)
export class UpdateRecoveryCodeUseCase implements ICommandHandler<UpdateRecoveryCodeCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly recoveryPasswordsRepository: RecoveryPasswordsRepository,
    private readonly emailConfirmationSenderService: EmailConfirmationSenderService,
  ) {}

  async execute({ email }: UpdateRecoveryCodeCommand): Promise<void> {
    const user = await this.usersRepository.findUserByEmail(email.value);
    if (!user) {
      return;
    }
    const recoveryPassword = RecoveryPassword.createEmpty(user.id);
    recoveryPassword.setNewCode();
    await this.recoveryPasswordsRepository.upsert(recoveryPassword);

    await this.emailConfirmationSenderService.send(
      user.email,
      recoveryPassword.recoveryCode!,
      TemplateType.Recovery,
    );
  }
}
