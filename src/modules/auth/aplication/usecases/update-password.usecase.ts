import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UsersExternalService } from '../../../users/application/external/users.external-service';
import { UpdatePasswordDto } from '../../dto/update-password.dto';

export class UpdatePasswordCommand {
  constructor(public dto: UpdatePasswordDto) {}
}

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordUseCase implements ICommandHandler<UpdatePasswordCommand> {
  constructor(private readonly usersExternalService: UsersExternalService) {}
  async execute({ dto }: UpdatePasswordCommand): Promise<void> {
    await this.usersExternalService.updatePassword(dto);
  }
}
