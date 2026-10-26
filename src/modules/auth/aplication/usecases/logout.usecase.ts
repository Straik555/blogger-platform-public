import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SessionsExternalService } from '../../../sessions/application/external/sessions.external-service';

export class LogoutCommand {
  constructor(
    public userId: string,
    public deviceId: string,
  ) {}
}

@CommandHandler(LogoutCommand)
export class LogoutCommandUseCase implements ICommandHandler<LogoutCommand> {
  constructor(
    private readonly sessionsExternalService: SessionsExternalService,
  ) {}

  async execute({ userId, deviceId }: LogoutCommand): Promise<void> {
    await this.sessionsExternalService.delete(userId, deviceId);
  }
}
