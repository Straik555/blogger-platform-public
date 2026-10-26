import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { FieldNames } from '../../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../../core/helpers/error-message.helper';
import { BlogExternalViewDto } from '../../api/view-dto/blog-external.view-dto';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

@Injectable()
export class BlogsExternalService {
  constructor(
    @Inject(BlogsRepository)
    private readonly blogsRepository: BlogsRepository,
  ) {}
  async findByBlogId(id: string): Promise<BlogExternalViewDto> {
    const blog = await this.blogsRepository.findById(id);

    if (!blog) {
      this.fail(
        errorMessageHelper.notFoundWithEntity(FieldNames.ID, FieldNames.BLOG),
      );
    }
    return BlogExternalViewDto.mapToExternal(blog);
  }

  async findByIdForShare(
    id: string,
    manager: EntityManager,
  ): Promise<BlogExternalViewDto> {
    const blog = await this.blogsRepository.findByIdForShare(id, manager);
    if (!blog) {
      this.fail(
        errorMessageHelper.notFoundWithEntity(FieldNames.ID, FieldNames.BLOG),
      );
    }
    return BlogExternalViewDto.mapToExternal(blog);
  }

  private fail(message: string): never {
    throw new DomainException({
      code: DomainExceptionCode.NotFound,
      message,
    });
  }
}
