import { Inject, Injectable } from '@nestjs/common';

import { FieldNames } from '../../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../../core/helpers/error-message.helper';
import { Post } from '../../domain/post.entity';
import { PostsRepository } from '../../infrastructure/posts.repository';

@Injectable()
export class PostsService {
  constructor(
    @Inject(PostsRepository) private readonly postsRepository: PostsRepository,
  ) {}
  async findByIdOrNotFoundFail(id: string): Promise<Post> {
    const post = await this.postsRepository.findById(id);
    if (!post) {
      this.fail(
        errorMessageHelper.notFoundWithEntity(FieldNames.ID, FieldNames.POST),
      );
    }
    return post;
  }
  async findByBlogIdAndPostIdOrNotFoundFail(
    postId: string,
    blogId: string,
  ): Promise<Post> {
    const post = await this.findByIdOrNotFoundFail(postId);
    if (post.blogId !== blogId) {
      this.fail(
        errorMessageHelper.notFoundWithEntity(
          FieldNames.POST_ID,
          FieldNames.BLOG,
        ),
      );
    }
    return post;
  }

  async updateWithVersionOrFail(post: Post): Promise<void> {
    const result = await this.postsRepository.updateWithVersion(post);
    if (!result) {
      this.fail(
        errorMessageHelper.getModificationConflictMessage(FieldNames.POST),
        DomainExceptionCode.Conflict,
      );
    }
  }

  private fail(
    message: string,
    code: DomainExceptionCode = DomainExceptionCode.NotFound,
  ): never {
    throw new DomainException({
      code,
      message,
    });
  }
}
