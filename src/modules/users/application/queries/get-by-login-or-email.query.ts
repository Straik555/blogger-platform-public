import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { DomainException } from '../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../core/helpers/error-message.helper';
import { User } from '../../domain/user.entity';
import { UsersRepository } from '../../infrastructure/users.repository';

export class GetByLoginOrEmailQuery {
  constructor(public loginOrEmail: string) {}
}

@QueryHandler(GetByLoginOrEmailQuery)
export class GetByLoginOrEmailQueryHandler implements IQueryHandler<GetByLoginOrEmailQuery> {
  constructor(private readonly usersRepository: UsersRepository) {}
  async execute({ loginOrEmail }: GetByLoginOrEmailQuery): Promise<User> {
    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: errorMessageHelper.unAuthorized(),
      });
    }
    return user;
  }
}
