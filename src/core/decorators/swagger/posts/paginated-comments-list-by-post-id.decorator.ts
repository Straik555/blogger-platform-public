import { ApiProperty } from '@nestjs/swagger';

import { CommentViewDto } from '../../../../modules/content/comments/api/view-dto/comment.view-dto';
import { PaginatedViewDto } from '../../../dto/base.paginated.view-dto';

export class PaginatedCommentsListByPostId extends PaginatedViewDto<
  CommentViewDto[]
> {
  @ApiProperty({ type: [CommentViewDto] })
  items: CommentViewDto[];
}
