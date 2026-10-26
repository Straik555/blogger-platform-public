import { FieldNames } from '../../../../core/constants/field-names.constant';
import { IsTrimmedString } from '../../../../core/decorators/validation';
import { BlogDescription, BlogName, WebsiteUrl } from '../domain/value-objects';

export class CreateBlogDto {
  @IsTrimmedString({
    max: BlogName.MAX_LENGTH,
    min: BlogName.MIN_LENGTH,
    field: FieldNames.NAME,
  })
  name: string;

  @IsTrimmedString({
    min: BlogDescription.MIN_LENGTH,
    max: BlogDescription.MAX_LENGTH,
    field: FieldNames.DESCRIPTION,
  })
  description: string;

  @IsTrimmedString({
    min: WebsiteUrl.MIN_LENGTH,
    max: WebsiteUrl.MAX_LENGTH,
    field: FieldNames.WEBSITE_URL,
    example: 'https://myblog.com',
    pattern: WebsiteUrl.PATTERN_REGEX.source,
  })
  websiteUrl: string;
}
