import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';

import { UserViewDto } from '../../api/view-dto/user.view-dto';
import { EmailConfirmation } from '../../domain/email-confirmation.entity';
import { CreateUserDto } from '../../dto/create-user.dto';
import { EmailConfirmationRepository } from '../../infrastructure/email-confirmation.repository';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UserFactory } from '../factories/user.factory';

export class CreateAdminUserCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateAdminUserCommand)
export class CreateAdminUserUseCase implements ICommandHandler<CreateAdminUserCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly usersRepository: UsersRepository,
    private readonly emailConfirmationRepository: EmailConfirmationRepository,
    private readonly userFactory: UserFactory,
  ) {}

  async execute({ dto }: CreateAdminUserCommand): Promise<UserViewDto> {
    const user = await this.userFactory.create(dto);
    await this.dataSource.transaction(async (manager) => {
      await this.usersRepository.create(user, manager);
      const emailConfirmation = EmailConfirmation.createConfirmed(user.id);
      await this.emailConfirmationRepository.create(emailConfirmation, manager);
    });

    return UserViewDto.mapToView(user);
  }
}
