import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogViewDto } from '../../api/view-dto/blog.view-dto';
import { Blog } from '../../domain/blog.entity';
import { CreateBlogDto } from '../../dto/create-blog.dto';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class CreateBlogCommand {
  constructor(public dto: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    @Inject(BlogsRepository) private readonly blogsRepository: BlogsRepository,
  ) {}
  async execute({ dto }: CreateBlogCommand): Promise<BlogViewDto> {
    const blog = Blog.createBlog(dto);

    await this.blogsRepository.create(blog);
    return BlogViewDto.mapToView(blog);
  }
}
