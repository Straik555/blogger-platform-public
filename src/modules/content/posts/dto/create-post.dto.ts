import { ApiProperty } from '@nestjs/swagger';

import { FieldNames } from '../../../../core/constants/field-names.constant';
import { IsUuidField } from '../../../../core/decorators/validation/is-uuid-field.decorator';
import { CreatePostCommonDto } from './create-post-common.dto';

export class CreatePostDto extends CreatePostCommonDto {
  @ApiProperty({
    type: String,
  })
  @IsUuidField(FieldNames.BLOG_ID)
  blogId: string;
}
