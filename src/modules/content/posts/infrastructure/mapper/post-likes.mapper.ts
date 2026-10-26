import { LikeStatusEnum } from '../../../../../core/types/like-status.type';
import { PostLikes } from '../../domain/post-likes.entity';

export class PostLikesMapper {
  public id: string;
  public user_id: string;
  public post_id: string;
  public status: LikeStatusEnum;
  public created_at: Date;
  public updated_at: Date;

  static mapToRowPostLikes(postLikes: PostLikesMapper): PostLikes {
    const newPostLikes = new PostLikes();
    newPostLikes.id = postLikes.id;
    newPostLikes.userId = postLikes.user_id;
    newPostLikes.postId = postLikes.post_id;
    newPostLikes.status = postLikes.status;
    newPostLikes.updatedAt = postLikes.updated_at;
    newPostLikes.createdAt = postLikes.created_at;

    return newPostLikes;
  }
}
