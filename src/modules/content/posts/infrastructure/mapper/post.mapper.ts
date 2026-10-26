import { Post } from '../../domain/post.entity';

export class PostRow {
  public id: string;
  public title: string;
  public content: string;
  public short_description: string;
  public blog_id: string;
  public created_at: Date;
  public updated_at: Date;
  public deleted_at: Date | null;
  public version: number;

  static mapToRowPost(post: PostRow): Post {
    const newPost = new Post();
    newPost.id = post.id;
    newPost.title = post.title;
    newPost.shortDescription = post.short_description;
    newPost.content = post.content;
    newPost.blogId = post.blog_id;
    newPost.createdAt = new Date(post.created_at);
    newPost.updatedAt = new Date(post.updated_at);
    newPost.deletedAt = post.deleted_at ? new Date(post.deleted_at) : null;
    newPost.version = post.version;
    return newPost;
  }
}
