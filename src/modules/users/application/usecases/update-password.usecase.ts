import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';

import { FieldNames } from '../../../../core/constants/field-names.constant';
import { BcryptService } from '../../../../core/services/bcrypt.service';
import { UpdatePasswordDto } from '../../../auth/dto/update-password.dto';
import { RecoveryPasswordsRepository } from '../../infrastructure/recovery-passwords.repository';
import { UsersRepository } from '../../infrastructure/users.repository';
import { throwIfRecoveryPasswordNotFoundHelper } from '../helpers/throw-if-recovery-password-not-found.helper';
import { throwIfUserNotFound } from '../helpers/throw-if-user-not-found.helper';

export class UpdatePasswordCommand {
  constructor(public dto: UpdatePasswordDto) {}
}

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordUseCase implements ICommandHandler<UpdatePasswordCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly usersRepository: UsersRepository,
    private readonly recoveryPasswordsRepository: RecoveryPasswordsRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async execute({ dto }: UpdatePasswordCommand): Promise<void> {
    const passwordHash = await this.bcryptService.generateHash(dto.newPassword);
    await this.dataSource.transaction(async (manager) => {
      const recoveryPassword =
        await this.recoveryPasswordsRepository.findByCodeForUpdate(
          dto.recoveryCode,
          manager,
        );
      throwIfRecoveryPasswordNotFoundHelper(
        recoveryPassword,
        FieldNames.RECOVERY_CODE,
      );

      recoveryPassword.checkNotExpiredOrFail();
      recoveryPassword.checkConfirmed();

      const user = await this.usersRepository.findById(
        recoveryPassword.userId,
        manager,
      );
      throwIfUserNotFound(user, FieldNames.RECOVERY_CODE);

      user.updatePassword(passwordHash);
      recoveryPassword.setConfirmed();

      await this.usersRepository.update(user, manager);
      await this.recoveryPasswordsRepository.upsert(recoveryPassword, manager);
    });
  }
}
