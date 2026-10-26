import { ApiProperty } from '@nestjs/swagger';

import { PostWithLikes } from '../../domain/post-with-likes';
import { ExtendedLikesInfoDto } from './dto/extended-likes-info.dto';
import { NewestLikesViewDto } from './newest-likes.view-dto';

export class PostViewDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  shortDescription: string;

  @ApiProperty({ type: String })
  content: string;

  @ApiProperty({ type: String })
  blogId: string;

  @ApiProperty({ type: String })
  blogName: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({ type: ExtendedLikesInfoDto })
  extendedLikesInfo: ExtendedLikesInfoDto;

  static mapToView(
    { post, blogName, myStatus, likesCount, dislikesCount }: PostWithLikes,
    newestLikes: NewestLikesViewDto[],
  ): PostViewDto {
    const dto = new PostViewDto();

    dto.id = post.id;
    dto.title = post.title;
    dto.content = post.content;
    dto.blogId = post.blogId;
    dto.createdAt = post.createdAt;
    dto.shortDescription = post.shortDescription;
    dto.blogName = blogName;

    const extendedLikesInfo = new ExtendedLikesInfoDto();
    extendedLikesInfo.likesCount = likesCount;
    extendedLikesInfo.dislikesCount = dislikesCount;
    extendedLikesInfo.myStatus = myStatus;
    extendedLikesInfo.newestLikes = newestLikes;
    dto.extendedLikesInfo = extendedLikesInfo;

    return dto;
  }
}
