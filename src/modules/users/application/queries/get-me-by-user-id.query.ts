import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { FieldNames } from '../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../core/helpers/error-message.helper';
import { UserMeViewDto } from '../../../auth/api/view-dto/user-me.view-dto';
import { UsersRepository } from '../../infrastructure/users.repository';

export class GetMeByUserIdQuery {
  constructor(public id: string) {}
}

@QueryHandler(GetMeByUserIdQuery)
export class GetMeByUserIdQueryHandler implements IQueryHandler<GetMeByUserIdQuery> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({ id }: GetMeByUserIdQuery): Promise<UserMeViewDto> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: errorMessageHelper.notFound(FieldNames.USER),
      });
    }
    return UserMeViewDto.mapToView(user);
  }
}
