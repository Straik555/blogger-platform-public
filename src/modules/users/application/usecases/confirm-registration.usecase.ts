import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { FieldNames } from '../../../../core/constants/field-names.constant';
import { EmailConfirmationRepository } from '../../infrastructure/email-confirmation.repository';
import { UsersRepository } from '../../infrastructure/users.repository';
import { throwIfEmailConfirmationNotFound } from '../helpers/throw-if-email-confirmation-not-found.helper';
import { throwIfUserNotFound } from '../helpers/throw-if-user-not-found.helper';

export class ConfirmRegistrationCommand {
  constructor(public code: string) {}
}

@CommandHandler(ConfirmRegistrationCommand)
export class ConflictRegistrationUseCase implements ICommandHandler<ConfirmRegistrationCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly emailConfirmationRepository: EmailConfirmationRepository,
  ) {}
  async execute({ code }: ConfirmRegistrationCommand): Promise<void> {
    const user = await this.usersRepository.findUserByCode(code);
    throwIfUserNotFound(user, FieldNames.CODE);

    const emailConfirmation =
      await this.emailConfirmationRepository.findByUserId(user.id);
    throwIfEmailConfirmationNotFound(emailConfirmation, FieldNames.CODE);

    emailConfirmation.confirm();
    await this.emailConfirmationRepository.update(emailConfirmation);
  }
}
