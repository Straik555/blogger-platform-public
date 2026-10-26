import { ApiProperty } from '@nestjs/swagger';

import { Blog } from '../../domain/blog.entity';

export class BlogViewDto {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty({ type: String })
  name: string;
  @ApiProperty({ type: String })
  description: string;
  @ApiProperty({ type: String, example: 'https://example.com' })
  websiteUrl: string;
  @ApiProperty({ type: String, example: '2023-08-25T14:30:00.000Z' })
  createdAt: Date;
  @ApiProperty({
    description: 'True if user has not expired membership subscription to blog',
  })
  isMembership: boolean;

  static mapToView(blog: Blog): BlogViewDto {
    const dto = new BlogViewDto();

    dto.id = blog.id;
    dto.createdAt = blog.createdAt;
    dto.description = blog.description;
    dto.isMembership = blog.isMembership;
    dto.websiteUrl = blog.websiteUrl;
    dto.name = blog.name;

    return dto;
  }
}
