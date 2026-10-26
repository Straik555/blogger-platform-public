import { ApiProperty } from '@nestjs/swagger';

import { PostViewDto } from '../../../../modules/content/posts/api/view-dto/post.view-dto';
import { PaginatedViewDto } from '../../../dto/base.paginated.view-dto';

export class PaginatedPosts extends PaginatedViewDto<PostViewDto[]> {
  @ApiProperty({
    type: [PostViewDto],
  })
  items: PostViewDto[];
}
