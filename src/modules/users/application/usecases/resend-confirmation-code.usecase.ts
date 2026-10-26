import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { FieldNames } from '../../../../core/constants/field-names.constant';
import { EmailConfirmationSenderService } from '../../../notifications/application/service/email-confirmation-sender.service';
import { TemplateType } from '../../../notifications/application/service/template.type';
import { Email } from '../../domain/value-objects/email';
import { EmailConfirmationRepository } from '../../infrastructure/email-confirmation.repository';
import { UsersRepository } from '../../infrastructure/users.repository';
import { throwIfEmailConfirmationNotFound } from '../helpers/throw-if-email-confirmation-not-found.helper';
import { throwIfUserNotFound } from '../helpers/throw-if-user-not-found.helper';

export class ResendConfirmationCodeCommand {
  constructor(public email: Email) {}
}

@CommandHandler(ResendConfirmationCodeCommand)
export class ResetConfirmationCodeUseCase implements ICommandHandler<ResendConfirmationCodeCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly emailConfirmationRepository: EmailConfirmationRepository,
    private readonly emailConfirmationSenderService: EmailConfirmationSenderService,
  ) {}

  async execute({ email }: ResendConfirmationCodeCommand): Promise<void> {
    const user = await this.usersRepository.findUserByEmail(email.value);
    throwIfUserNotFound(user, FieldNames.EMAIL);

    const emailConfirmation =
      await this.emailConfirmationRepository.findByUserId(user.id);
    throwIfEmailConfirmationNotFound(emailConfirmation, FieldNames.EMAIL);

    emailConfirmation.updateCode();
    await this.emailConfirmationRepository.update(emailConfirmation);

    await this.emailConfirmationSenderService.send(
      user.email,
      emailConfirmation.confirmationCode!,
      TemplateType.Registration,
    );
  }
}
