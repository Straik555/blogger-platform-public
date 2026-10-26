import { FieldNames } from '../../../../core/constants/field-names.constant';
import { IsTrimmedString } from '../../../../core/decorators/validation';
import { CommentContent } from '../domain/value-objects/comment-content';

export class MutateCommentDto {
  @IsTrimmedString({
    field: FieldNames.CONTENT,
    min: CommentContent.MIN_LENGTH,
    max: CommentContent.MAX_LENGTH,
    isMin: true,
  })
  content: string;
}
