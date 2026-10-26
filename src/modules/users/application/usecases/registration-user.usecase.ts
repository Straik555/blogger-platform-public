import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';

import { EmailConfirmationSenderService } from '../../../notifications/application/service/email-confirmation-sender.service';
import { TemplateType } from '../../../notifications/application/service/template.type';
import { EmailConfirmation } from '../../domain/email-confirmation.entity';
import { CreateUserDto } from '../../dto/create-user.dto';
import { EmailConfirmationRepository } from '../../infrastructure/email-confirmation.repository';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UserFactory } from '../factories/user.factory';

export class RegistrationUserCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegisterUserUseCase implements ICommandHandler<RegistrationUserCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly usersRepository: UsersRepository,
    private readonly userFactory: UserFactory,
    private readonly emailConfirmationRepository: EmailConfirmationRepository,
    private readonly emailConfirmationSenderService: EmailConfirmationSenderService,
  ) {}
  async execute({ dto }: RegistrationUserCommand): Promise<void> {
    const user = await this.userFactory.create(dto);

    const confirmation = await this.dataSource.transaction(async (manager) => {
      await this.usersRepository.create(user, manager);
      const confirm = EmailConfirmation.createUnconfirmed(user.id);
      await this.emailConfirmationRepository.create(confirm, manager);
      return confirm;
    });

    void this.emailConfirmationSenderService.send(
      user.email,
      confirmation.confirmationCode!,
      TemplateType.Registration,
    );
  }
}
