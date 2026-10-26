import { LikeStatusEnum } from '../../../../../core/types/like-status.type';
import { Post } from '../../domain/post.entity';
import { PostWithLikes } from '../../domain/post-with-likes';
import { PostRow } from './post.mapper';

export class PostRowWithLikes extends PostRow {
  dislikes_count: string;
  likes_count: string;
  blog_name: string;
  my_status: LikeStatusEnum;
}

export class PostWithLikesMapper {
  static mapRowToPostWithLikes(row: PostRowWithLikes): PostWithLikes {
    const post = new Post();
    post.id = row.id;
    post.title = row.title;
    post.shortDescription = row.short_description;
    post.content = row.content;
    post.blogId = row.blog_id;
    post.createdAt = row.created_at;
    post.updatedAt = row.updated_at;
    post.deletedAt = row.deleted_at;
    post.version = row.version;

    return {
      post,
      blogName: row.blog_name,
      likesCount: parseInt(row.likes_count, 10),
      dislikesCount: parseInt(row.dislikes_count, 10),
      myStatus: row.my_status ?? LikeStatusEnum.None,
    };
  }
}
