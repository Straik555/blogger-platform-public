import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UsersExternalService } from '../../../users/application/external/users.external-service';
import { ConfirmRegistrationDto } from '../../dto/confirm-registration.dto';

export class ConfirmRegistrationCommand {
  constructor(public dto: ConfirmRegistrationDto) {}
}

@CommandHandler(ConfirmRegistrationCommand)
export class ConfirmRegistrationUseCase implements ICommandHandler<ConfirmRegistrationCommand> {
  constructor(private readonly usersExternalService: UsersExternalService) {}

  async execute({ dto }: ConfirmRegistrationCommand): Promise<void> {
    await this.usersExternalService.confirmRegistration(dto.code);
  }
}
