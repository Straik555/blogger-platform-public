import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { PaginatedOutputType } from '../../../../core/types/paginated-output.type';
import { UsersSortField } from '../../api/input-dto/user-sort-field.type';
import { UsersQueryParams } from '../../api/input-dto/users-query-params.input-dto';
import { User } from '../../domain/user.entity';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}
  async findAll(query: UsersQueryParams): Promise<PaginatedOutputType<User[]>> {
    const qb = this.usersRepository
      .createQueryBuilder('u')
      .where('u.deletedAt IS NULL');
    if (query.searchLoginTerm || query.searchEmailTerm) {
      qb.andWhere(
        new Brackets((sub) => {
          if (query.searchLoginTerm) {
            sub.orWhere('u.login ILIKE :login', {
              login: `%${query.searchLoginTerm}%`,
            });
          }
          if (query.searchEmailTerm) {
            sub.orWhere('u.email ILIKE :email', {
              email: `%${query.searchEmailTerm}%`,
            });
          }
        }),
      );
    }
    const textFields = [UsersSortField.Login, UsersSortField.Email];
    const sortColumn = textFields.includes(query.sortBy)
      ? `u.${query.sortBy} COLLATE "C"`
      : `u.${query.sortBy}`;

    qb.orderBy(sortColumn, query.sortDirection.toUpperCase() as 'ASC' | 'DESC')
      .skip(query.calculateSkip())
      .take(query.pageSize);

    const [users, totalCount] = await qb.getManyAndCount();

    return {
      data: users,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    };
  }
}
