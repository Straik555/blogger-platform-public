import { FieldNames } from '../../../../core/constants/field-names.constant';
import { IsTrimmedString } from '../../../../core/decorators/validation';
import {
  PostContent,
  PostShortDescription,
  PostTitle,
} from '../domain/value-objects';

export class CreatePostCommonDto {
  @IsTrimmedString({
    field: FieldNames.TITLE,
    min: PostTitle.MIN_LENGTH,
    max: PostTitle.MAX_LENGTH,
  })
  title: string;

  @IsTrimmedString({
    field: FieldNames.SHORT_DESCRIPTION,
    min: PostShortDescription.MIN_LENGTH,
    max: PostShortDescription.MAX_LENGTH,
  })
  shortDescription: string;

  @IsTrimmedString({
    field: FieldNames.CONTENT,
    min: PostContent.MIN_LENGTH,
    max: PostContent.MAX_LENGTH,
  })
  content: string;
}
