import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { FieldNames } from '../../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../../core/helpers/error-message.helper';
import { Blog } from '../../domain/blog.entity';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

@Injectable()
export class BlogsService {
  constructor(
    @Inject(BlogsRepository) private readonly blogsRepository: BlogsRepository,
  ) {}
  async findByIdOrNotFoundFail(id: string): Promise<Blog> {
    const blog = await this.blogsRepository.findById(id);
    if (!blog) {
      this.fail(
        errorMessageHelper.notFoundWithEntity(FieldNames.ID, FieldNames.BLOG),
      );
    }
    return blog;
  }

  async findByIdForUpdateOrNotFoundFail(
    id: string,
    manager: EntityManager,
  ): Promise<Blog> {
    const blog: Blog | null = await this.blogsRepository.findByIdForUpdate(
      id,
      manager,
    );
    if (!blog) {
      this.fail(
        errorMessageHelper.notFoundWithEntity(FieldNames.ID, FieldNames.BLOG),
      );
    }
    return blog;
  }

  async updateWithVersionOrFail(
    blog: Blog,
    manager?: EntityManager,
  ): Promise<void> {
    const updated = await this.blogsRepository.updateWithVersion(blog, manager);
    if (!updated) {
      this.fail(
        errorMessageHelper.getModificationConflictMessage(FieldNames.BLOG),
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
