import { Inject, Injectable } from '@nestjs/common';

import { FieldNames } from '../../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../../core/helpers/error-message.helper';
import { PostExternalViewDto } from '../../api/view-dto/post-external.view-dto';
import { PostsRepository } from '../../infrastructure/posts.repository';

@Injectable()
export class PostsExternalService {
  constructor(
    @Inject(PostsRepository)
    private readonly postsRepository: PostsRepository,
  ) {}
  async findByPostId(id: string): Promise<PostExternalViewDto> {
    const post = await this.postsRepository.findById(id);
    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: errorMessageHelper.notFoundWithEntity(
          FieldNames.ID,
          FieldNames.POST,
        ),
      });
    }
    return PostExternalViewDto.mapToView(post);
  }
}
