import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';

import { FieldNames } from '../../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../../core/helpers/error-message.helper';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { BlogsService } from '../services/blogs.service';

export class DeleteBlogByIdCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteBlogByIdCommand)
export class DeleteBlogByIdUseCase implements ICommandHandler<DeleteBlogByIdCommand> {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(BlogsService)
    private readonly blogsService: BlogsService,
    @Inject(PostsRepository) private readonly postsRepository: PostsRepository,
  ) {}
  async execute({ id }: DeleteBlogByIdCommand): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const blog = await this.blogsService.findByIdForUpdateOrNotFoundFail(
        id,
        manager,
      );
      const hasPosts = await this.postsRepository.existsByBlogId(id, manager);
      if (hasPosts) {
        const message = errorMessageHelper.notEmpty(
          FieldNames.BLOG,
          FieldNames.POSTS,
        );
        throw new DomainException({
          code: DomainExceptionCode.BadRequest,
          message,
          errorsMessages: [{ message, field: FieldNames.BLOG }],
        });
      }
      blog.deleted();
      await this.blogsService.updateWithVersionOrFail(blog, manager);
    });
  }
}
