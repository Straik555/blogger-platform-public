import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { UsersQueryParams } from '../../api/input-dto/users-query-params.input-dto';
import { UserViewDto } from '../../api/view-dto/user.view-dto';
import { UsersQueryRepository } from '../../infrastructure/query/users-query.repository';

export class GetAllUserQuery {
  constructor(public query: UsersQueryParams) {}
}

@QueryHandler(GetAllUserQuery)
export class GetAllUsersQueryHandler implements IQueryHandler<GetAllUserQuery> {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async execute({
    query,
  }: GetAllUserQuery): Promise<PaginatedViewDto<UserViewDto[]>> {
    const { totalCount, page, size, data } =
      await this.usersQueryRepository.findAll(query);
    const items = data.map((user) => UserViewDto.mapToView(user));
    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page,
      size,
    });
  }
}
