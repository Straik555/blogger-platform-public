import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UsersExternalService } from '../../../users/application/external/users.external-service';

export class UpdateRecoveryCodeCommand {
  constructor(public email: string) {}
}

@CommandHandler(UpdateRecoveryCodeCommand)
export class UpdateRecoveryCodeUseCase implements ICommandHandler<UpdateRecoveryCodeCommand> {
  constructor(private readonly usersExternalService: UsersExternalService) {}
  async execute({ email }: UpdateRecoveryCodeCommand): Promise<void> {
    await this.usersExternalService.updateRecoveryCode(email);
  }
}
