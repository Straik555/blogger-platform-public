import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UsersExternalService } from '../../../users/application/external/users.external-service';
import { CreateUserDto } from '../../../users/dto/create-user.dto';

export class RegistrationCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(RegistrationCommand)
export class RegistrationUseCase implements ICommandHandler<RegistrationCommand> {
  constructor(private readonly usersExternalService: UsersExternalService) {}
  async execute({ dto }: RegistrationCommand): Promise<void> {
    await this.usersExternalService.registerUser(dto);
  }
}
