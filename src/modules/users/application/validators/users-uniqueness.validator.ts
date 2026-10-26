import { Injectable } from '@nestjs/common';

import { FieldNames } from '../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../core/helpers/error-message.helper';
import { Login } from '../../../../core/value-objects';
import { Email } from '../../domain/value-objects/email';
import { UserByUniqueType } from '../../infrastructure/user-by-unique.type';
import { UsersRepository } from '../../infrastructure/users.repository';

@Injectable()
export class UsersUniquenessValidator {
  constructor(private usersRepository: UsersRepository) {}

  async checkOrFail(login: Login, email: Email): Promise<void> {
    const [isLoginTaken, isEmailTaken] = await Promise.all([
      this.usersRepository.findByUnique(login.value, UserByUniqueType.LOGIN),
      this.usersRepository.findByUnique(email.value, UserByUniqueType.EMAIL),
    ]);
    if (isLoginTaken.length > 0) {
      const message = errorMessageHelper.isUnique(FieldNames.LOGIN);
      throw new DomainException({
        message,
        code: DomainExceptionCode.BadRequest,
        errorsMessages: [
          {
            message,
            field: FieldNames.LOGIN,
          },
        ],
      });
    }
    if (isEmailTaken.length > 0) {
      const message = errorMessageHelper.isUnique(FieldNames.EMAIL);
      throw new DomainException({
        message,
        code: DomainExceptionCode.BadRequest,
        errorsMessages: [
          {
            message,
            field: FieldNames.EMAIL,
          },
        ],
      });
    }
  }
}
