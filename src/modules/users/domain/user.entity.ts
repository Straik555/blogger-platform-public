import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { FieldNames } from '../../../core/constants/field-names.constant';
import { DomainException } from '../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../core/helpers/error-message.helper';
import { Login } from '../../../core/value-objects';
import { CreateUserDomainDto } from './dto/create-user.domain.dto';
import { Email } from './value-objects/email';

@Entity('users')
@Check('login', 'length(login::text) >= 1')
@Check('email', 'length(email::text) >= 5')
@Index('idx_users_login_active', ['login'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
@Index('idx_users_email_active', ['email'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
export class User {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'users_pkey' })
  id: string;

  @Column({ name: 'login', type: 'varchar', length: 100 })
  login: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: Email.MAX_LENGTH,
  })
  email: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
  })
  passwordHash: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
  })
  updatedAt: Date;

  @Column({
    name: 'deleted_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt: Date | null;

  deleted() {
    if (this.deletedAt !== null) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: errorMessageHelper.isDeleted(FieldNames.USER),
      });
    }
    this.deletedAt = new Date();
  }

  static createUser(dto: CreateUserDomainDto): User {
    const user = new User();
    user.email = Email.create(dto.email).value;
    user.login = Login.create(dto.login).value;
    user.passwordHash = dto.passwordHash;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.deletedAt = null;
    return user;
  }

  updatePassword(passwordHash: string) {
    this.passwordHash = passwordHash;
    this.updatedAt = new Date();
  }
}
