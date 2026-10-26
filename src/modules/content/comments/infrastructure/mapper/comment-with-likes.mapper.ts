import { LikeStatusEnum } from '../../../../../core/types/like-status.type';
import { CommentWithLikes } from '../../domain/comment-with-likes';
import { CommentRow } from './comment.mapper';

export class CommentRowWithLikes extends CommentRow {
  dislikes_count: string;
  likes_count: string;
  user_login: string;
  my_status: LikeStatusEnum;
}

export class CommentRowWithLikesMapper {
  static mapRowToCommentWithLikes(dto: CommentRowWithLikes): CommentWithLikes {
    const comment = CommentRow.mapToRowComment(dto);
    return {
      comment,
      userLogin: dto.user_login,
      likesCount: parseInt(dto.likes_count, 10),
      dislikesCount: parseInt(dto.dislikes_count, 10),
      myStatus: dto.my_status ?? LikeStatusEnum.None,
    };
  }
}
