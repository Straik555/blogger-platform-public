import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { BlogViewDto } from '../../api/view-dto/blog.view-dto';
import { BlogsService } from '../services/blogs.service';

export class GetBlogByIdQuery {
  constructor(public id: string) {}
}

@QueryHandler(GetBlogByIdQuery)
export class GetBlogByIdQueryHandler implements IQueryHandler<GetBlogByIdQuery> {
  constructor(private readonly blogsService: BlogsService) {}
  async execute({ id }: GetBlogByIdQuery): Promise<BlogViewDto> {
    const blog = await this.blogsService.findByIdOrNotFoundFail(id);
    return BlogViewDto.mapToView(blog);
  }
}
