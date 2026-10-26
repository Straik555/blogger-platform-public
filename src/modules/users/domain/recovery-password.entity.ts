import { randomUUID } from 'crypto';
import { addHours } from 'date-fns';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { FieldNames } from '../../../core/constants/field-names.constant';
import { DomainException } from '../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../core/helpers/error-message.helper';
import { User } from './user.entity';

@Entity('recovery_passwords')
@Index('recovery_passwords_code_key', ['recoveryCode'], { unique: true })
export class RecoveryPassword {
  @PrimaryColumn({
    name: 'user_id',
    type: 'uuid',
    primaryKeyConstraintName: 'recovery_passwords_pkey',
  })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'recovery_passwords_user_id_fkey',
  })
  user?: User;

  @Column({
    name: 'recovery_code',
    type: 'varchar',
    nullable: true,
  })
  recoveryCode: string | null;

  @Column({ name: 'is_confirmed', type: 'boolean', default: false })
  isConfirmed: boolean;

  @Column({
    name: 'expiration_date',
    type: 'timestamp with time zone',
    nullable: true,
  })
  expirationDate: Date | null;

  static createEmpty(userId: string): RecoveryPassword {
    const recovery = new RecoveryPassword();
    recovery.userId = userId;
    recovery.recoveryCode = null;
    recovery.isConfirmed = false;
    recovery.expirationDate = null;
    return recovery;
  }

  setNewCode() {
    this.recoveryCode = randomUUID();
    this.isConfirmed = false;
    this.expirationDate = addHours(new Date(), 1);
  }

  setConfirmed() {
    this.isConfirmed = true;
    this.recoveryCode = null;
  }

  checkConfirmed() {
    if (this.isConfirmed) {
      const message = errorMessageHelper.isUpdatedPassword();
      throw new DomainException({
        code: DomainExceptionCode.ConfirmationCodeAlreadyUsed,
        message,
        errorsMessages: [{ message, field: FieldNames.RECOVERY_CODE }],
      });
    }
  }

  checkNotExpiredOrFail(): void {
    if (this.expirationDate !== null && this.expirationDate < new Date()) {
      const message = errorMessageHelper.isExpirationDate(
        FieldNames.RECOVERY_CODE,
      );
      throw new DomainException({
        code: DomainExceptionCode.PasswordRecoveryCodeExpired,
        message,
        errorsMessages: [{ message, field: FieldNames.RECOVERY_CODE }],
      });
    }
  }
}
