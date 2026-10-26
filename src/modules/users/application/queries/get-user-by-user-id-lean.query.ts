import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { FieldNames } from '../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../core/helpers/error-message.helper';
import { UserExternalViewDto } from '../../api/view-dto/user-external.view-dto';
import { UsersRepository } from '../../infrastructure/users.repository';

export class GetUserByUserIdLeanQuery {
  constructor(public id: string) {}
}

@QueryHandler(GetUserByUserIdLeanQuery)
export class GetUserByUserIdLeanQueryHandler implements IQueryHandler<GetUserByUserIdLeanQuery> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    id,
  }: GetUserByUserIdLeanQuery): Promise<UserExternalViewDto> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: errorMessageHelper.notFound(FieldNames.USER),
      });
    }
    return UserExternalViewDto.mapToExternal(user);
  }
}
