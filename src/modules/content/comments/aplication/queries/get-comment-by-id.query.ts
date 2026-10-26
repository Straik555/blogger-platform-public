import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { FieldNames } from '../../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../../core/helpers/error-message.helper';
import { CommentViewDto } from '../../api/view-dto/comment.view-dto';
import { CommentsQueryRepository } from '../../infrastructure/query/comments-query.repository';

export class GetCommentByIdQuery {
  constructor(
    public commentId: string,
    public userId: string | null,
  ) {}
}

@QueryHandler(GetCommentByIdQuery)
export class GetCommentByIdQueryHandler implements IQueryHandler<GetCommentByIdQuery> {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}
  async execute({
    userId,
    commentId,
  }: GetCommentByIdQuery): Promise<CommentViewDto> {
    const comment =
      await this.commentsQueryRepository.findCommentWithLikesByCommentIdAndUserId(
        commentId,
        userId,
      );
    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: errorMessageHelper.notFoundWithEntity(
          FieldNames.ID,
          FieldNames.COMMENT,
        ),
      });
    }
    return CommentViewDto.mapToView(comment);
  }
}
