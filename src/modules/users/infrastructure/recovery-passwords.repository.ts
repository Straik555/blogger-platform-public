import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { RecoveryPassword } from '../domain/recovery-password.entity';

@Injectable()
export class RecoveryPasswordsRepository {
  constructor(
    @InjectRepository(RecoveryPassword)
    private readonly recoveryPasswordRepository: Repository<RecoveryPassword>,
  ) {}

  async upsert(
    recoveryPassword: RecoveryPassword,
    manager: EntityManager = this.recoveryPasswordRepository.manager,
  ): Promise<void> {
    await manager.getRepository(RecoveryPassword).upsert(
      {
        userId: recoveryPassword.userId,
        recoveryCode: recoveryPassword.recoveryCode,
        expirationDate: recoveryPassword.expirationDate,
        isConfirmed: recoveryPassword.isConfirmed,
      },
      { conflictPaths: ['userId'] },
    );
  }

  async findByCodeForUpdate(
    code: string,
    manager: EntityManager,
  ): Promise<RecoveryPassword | null> {
    return manager.getRepository(RecoveryPassword).findOne({
      where: { recoveryCode: code },
      lock: { mode: 'pessimistic_write' },
    });
  }
}
