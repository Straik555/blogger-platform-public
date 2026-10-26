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

@Entity('email_confirmations')
@Index('email_confirmations_code_key', ['confirmationCode'], { unique: true })
export class EmailConfirmation {
  @PrimaryColumn({
    name: 'user_id',
    type: 'uuid',
    primaryKeyConstraintName: 'email_confirmations_pkey',
  })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'user_id' })
  user?: User;

  @Column({
    name: 'confirmation_code',
    type: 'varchar',
    nullable: true,
  })
  confirmationCode: string | null;

  @Column({ name: 'is_confirmed', type: 'boolean', default: false })
  isConfirmed: boolean;

  @Column({
    name: 'expiration_date',
    type: 'timestamp with time zone',
    nullable: true,
  })
  expirationDate: Date | null;

  static createUnconfirmed(userId: string): EmailConfirmation {
    const confirmation = new EmailConfirmation();
    confirmation.userId = userId;
    confirmation.expirationDate = addHours(new Date(), 1);
    confirmation.confirmationCode = randomUUID();
    confirmation.isConfirmed = false;
    return confirmation;
  }

  static createConfirmed(userId: string): EmailConfirmation {
    const confirmation = new EmailConfirmation();
    confirmation.userId = userId;
    confirmation.confirmationCode = null;
    confirmation.expirationDate = null;
    confirmation.isConfirmed = true;
    return confirmation;
  }

  confirm() {
    if (this.isConfirmed) {
      const message = errorMessageHelper.isConfirmed(FieldNames.CODE);
      throw new DomainException({
        code: DomainExceptionCode.ConfirmationCodeAlreadyUsed,
        message,
        errorsMessages: [
          {
            message,
            field: FieldNames.CODE,
          },
        ],
      });
    }
    if (this.expirationDate && this.expirationDate < new Date()) {
      const message = errorMessageHelper.isExpirationDate(FieldNames.CODE);
      throw new DomainException({
        code: DomainExceptionCode.ConfirmationCodeExpired,
        message,
        errorsMessages: [
          {
            message,
            field: FieldNames.EMAIL,
          },
        ],
      });
    }
    this.isConfirmed = true;
  }

  updateCode() {
    if (this.isConfirmed) {
      const message = errorMessageHelper.isConfirmed(FieldNames.EMAIL);
      throw new DomainException({
        code: DomainExceptionCode.ConfirmationCodeAlreadyUsed,
        message,
        errorsMessages: [
          {
            message,
            field: FieldNames.EMAIL,
          },
        ],
      });
    }
    this.expirationDate = addHours(new Date(), 1);
    this.confirmationCode = randomUUID();
  }
}
