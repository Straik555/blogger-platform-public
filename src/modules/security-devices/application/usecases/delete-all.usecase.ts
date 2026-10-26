import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SessionsExternalService } from '../../../sessions/application/external/sessions.external-service';

export class DeleteAllCommand {
  constructor(
    public userId: string,
    public deviceId: string,
  ) {}
}

@CommandHandler(DeleteAllCommand)
export class DeleteAllUseCase implements ICommandHandler<DeleteAllCommand> {
  constructor(
    private readonly sessionsExternalService: SessionsExternalService,
  ) {}
  async execute({ deviceId, userId }: DeleteAllCommand): Promise<void> {
    await this.sessionsExternalService.deleteAllExceptCurrent(userId, deviceId);
  }
}
