import { Inject, Injectable } from '@nestjs/common';

import { FieldNames } from '../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../core/helpers/error-message.helper';
import { User } from '../../domain/user.entity';
import { UsersRepository } from '../../infrastructure/users.repository';

@Injectable()
export class UserFinderService {
  constructor(
    @Inject(UsersRepository) private readonly usersRepository: UsersRepository,
  ) {}
  async findByIdOrNotFoundFail(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: errorMessageHelper.notFound(FieldNames.USER),
      });
    }
    return user;
  }
}
