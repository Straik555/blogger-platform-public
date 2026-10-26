import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UsersExternalService } from '../../../users/application/external/users.external-service';

export class ResendConfirmationCodeCommand {
  constructor(public email: string) {}
}

@CommandHandler(ResendConfirmationCodeCommand)
export class ResendingConfirmationCodeUseCase implements ICommandHandler<ResendConfirmationCodeCommand> {
  constructor(private readonly usersExternalService: UsersExternalService) {}

  async execute({ email }: ResendConfirmationCodeCommand): Promise<void> {
    await this.usersExternalService.resendConfirmationCode(email);
  }
}
