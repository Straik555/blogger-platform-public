import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { BlogsQueryParams } from '../../api/input-dto/blogs-query-params.input-dto';
import { BlogViewDto } from '../../api/view-dto/blog.view-dto';
import { Blog } from '../../domain/blog.entity';
import { BlogsQueryRepository } from '../../infrastructure/query/blogs-query.repository';

export class GetAllBlogsQuery {
  constructor(public query: BlogsQueryParams) {}
}

@QueryHandler(GetAllBlogsQuery)
export class GetAllBlogsQueryHandler implements IQueryHandler<GetAllBlogsQuery> {
  constructor(
    @Inject(BlogsQueryRepository)
    private readonly blogQueryRepository: BlogsQueryRepository,
  ) {}
  async execute({
    query,
  }: GetAllBlogsQuery): Promise<PaginatedViewDto<BlogViewDto[]>> {
    const { totalCount, page, size, data } =
      await this.blogQueryRepository.findAll(query);
    const items = data.map((blog: Blog) => BlogViewDto.mapToView(blog));
    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page,
      size,
    });
  }
}
