import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginatedOutputType } from '../../../../../core/types/paginated-output.type';
import { BlogSortFieldType } from '../../api/input-dto/blog-sort-field.type';
import { BlogsQueryParams } from '../../api/input-dto/blogs-query-params.input-dto';
import { Blog } from '../../domain/blog.entity';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
  ) {}
  async findAll(query: BlogsQueryParams): Promise<PaginatedOutputType<Blog[]>> {
    const queryBuilder = this.blogRepository
      .createQueryBuilder('b')
      .where('b.deletedAt IS NULL');

    if (query.searchNameTerm) {
      queryBuilder.andWhere('b.name ILIKE :searchTerm', {
        searchTerm: `%${query.searchNameTerm}%`,
      });
    }

    const textFields = [BlogSortFieldType.Name];
    const orderByColumn = textFields.includes(query.sortBy)
      ? `b.${query.sortBy} COLLATE "C"`
      : `b.${query.sortBy}`;

    queryBuilder
      .orderBy(
        orderByColumn,
        query.sortDirection.toUpperCase() as 'ASC' | 'DESC',
      )
      .skip(query.calculateSkip())
      .take(query.pageSize);

    const [blogs, totalCount] = await queryBuilder.getManyAndCount();

    return {
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
      data: blogs,
    };
  }
}
