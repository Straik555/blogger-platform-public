import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateBlogDto } from '../../dto/create-blog.dto';
import { BlogsService } from '../services/blogs.service';

export class UpdateBlogCommand {
  constructor(
    public id: string,
    public dto: CreateBlogDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogByIdUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(
    @Inject(BlogsService)
    private readonly blogsService: BlogsService,
  ) {}
  async execute({ id, dto }: UpdateBlogCommand): Promise<void> {
    const blog = await this.blogsService.findByIdOrNotFoundFail(id);

    blog.updatedBlog(dto);
    await this.blogsService.updateWithVersionOrFail(blog);
  }
}
