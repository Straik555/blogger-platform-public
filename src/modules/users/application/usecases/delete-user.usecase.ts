import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SessionsExternalService } from '../../../sessions/application/external/sessions.external-service';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UserFinderService } from '../services/user-finder.service';

export class DeleteUserCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @Inject(UsersRepository) private readonly usersRepository: UsersRepository,
    @Inject(SessionsExternalService)
    private readonly sessionsExternalService: SessionsExternalService,
    @Inject(UserFinderService)
    private readonly finderService: UserFinderService,
  ) {}
  async execute({ id }: DeleteUserCommand): Promise<void> {
    const user = await this.finderService.findByIdOrNotFoundFail(id);

    user.deleted();
    await this.usersRepository.update(user);
    await this.sessionsExternalService.deleteAllByUserId(user.id);
  }
}
