import { Injectable } from '@nestjs/common';

import { FieldNames } from '../../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../../core/helpers/error-message.helper';
import { PostWithLikes } from '../../domain/post-with-likes';
import { PostsQueryRepository } from '../../infrastructure/query/posts-query.repository';

@Injectable()
export class PostWithLikesFinderService {
  constructor(private readonly postsQueryRepository: PostsQueryRepository) {}

  async findByIdOrNotFoundFail(
    postId: string,
    userId: string | null,
  ): Promise<PostWithLikes> {
    const postWithLikes =
      await this.postsQueryRepository.findPostWithLikesByPostIdAndUserId(
        postId,
        userId,
      );
    if (!postWithLikes) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: errorMessageHelper.notFoundWithEntity(
          FieldNames.ID,
          FieldNames.POST,
        ),
      });
    }
    return postWithLikes;
  }
}
