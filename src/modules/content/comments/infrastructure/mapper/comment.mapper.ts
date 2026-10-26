import { Comment } from '../../domain/comment.entity';

export class CommentRow {
  public id: string;
  public user_id: string;
  public post_id: string;
  public content: string;
  public created_at: Date;
  public updated_at: Date;
  public version: number;

  static mapToRowComment(dto: CommentRow): Comment {
    const comment = new Comment();
    comment.id = dto.id;
    comment.userId = dto.user_id;
    comment.postId = dto.post_id;
    comment.content = dto.content;
    comment.version = dto.version;
    comment.createdAt = dto.created_at;
    comment.updatedAt = dto.updated_at;
    return comment;
  }
}
