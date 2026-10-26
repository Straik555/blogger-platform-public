import { ApiProperty } from '@nestjs/swagger';

import { BlogViewDto } from '../../../../modules/content/blogs/api/view-dto/blog.view-dto';
import { PaginatedViewDto } from '../../../dto/base.paginated.view-dto';

export class PaginatedBlogs extends PaginatedViewDto<BlogViewDto[]> {
  @ApiProperty({ type: [BlogViewDto] })
  items: BlogViewDto[];
}
