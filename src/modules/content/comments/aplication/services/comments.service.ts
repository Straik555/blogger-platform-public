import { Injectable } from '@nestjs/common';

import { FieldNames } from '../../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../../core/helpers/error-message.helper';
import { Comment } from '../../domain/comment.entity';
import { CommentsRepository } from '../../infrastructure/comments.repository';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}
  async findByIdOrNotFoundFail(id: string): Promise<Comment> {
    const comment = await this.commentsRepository.findById(id);
    if (!comment) {
      this.fail(
        errorMessageHelper.notFoundWithEntity(
          FieldNames.ID,
          FieldNames.COMMENT,
        ),
      );
    }
    return comment;
  }

  async findByIdAndCheckOwnershipOrFail(
    id: string,
    userId: string,
  ): Promise<Comment> {
    const comment: Comment = await this.findByIdOrNotFoundFail(id);

    if (comment.userId !== userId) {
      this.fail(
        errorMessageHelper.forbidden(FieldNames.COMMENT),
        DomainExceptionCode.Forbidden,
      );
    }

    return comment;
  }

  async updateWithVersionOrFail(comment: Comment): Promise<void> {
    const result = await this.commentsRepository.updateWithVersion(comment);
    if (!result) {
      this.fail(
        errorMessageHelper.getModificationConflictMessage(FieldNames.COMMENT),
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
