import { Injectable } from '@nestjs/common';

import { FieldNames } from '../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../core/helpers/error-message.helper';
import { BcryptService } from '../../../../core/services/bcrypt.service';
import { UsersExternalService } from '../../../users/application/external/users.external-service';
import { User } from '../../../users/domain/user.entity';

@Injectable()
export class ValidationUserService {
  constructor(
    private readonly usersExternalService: UsersExternalService,
    private readonly bcryptService: BcryptService,
  ) {}
  async execute(loginOrEmail: string, password: string): Promise<User> {
    const input = loginOrEmail.trim();
    const lookup = input.includes('@') ? input.toLowerCase() : input;
    const user = await this.usersExternalService.findByLoginOrEmail(lookup);

    const isPassCorrect = await this.bcryptService.checkPassword(
      password,
      user.passwordHash,
    );
    if (!isPassCorrect) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: errorMessageHelper.isWrong(FieldNames.PASSWORD),
      });
    }

    return user;
  }
}
