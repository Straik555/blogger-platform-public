import { ApiProperty } from '@nestjs/swagger';

import { CommentWithLikes } from '../../domain/comment-with-likes';
import { CommentatorInfoDto } from './dto/commentator-info.dto';
import { LikesInfoDto } from './dto/likes-info.dto';

export class CommentViewDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  content: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: string;

  @ApiProperty({ type: CommentatorInfoDto })
  commentatorInfo: CommentatorInfoDto;

  @ApiProperty({ type: LikesInfoDto })
  likesInfo: LikesInfoDto;

  static mapToView({
    comment,
    myStatus,
    likesCount,
    dislikesCount,
    userLogin,
  }: CommentWithLikes): CommentViewDto {
    const dto = new CommentViewDto();
    dto.id = comment.id;
    dto.content = comment.content;
    dto.commentatorInfo = {
      userLogin,
      userId: comment.userId,
    };
    dto.createdAt = comment.createdAt.toISOString();
    dto.likesInfo = {
      likesCount: likesCount,
      dislikesCount: dislikesCount,
      myStatus,
    };

    return dto;
  }
}
