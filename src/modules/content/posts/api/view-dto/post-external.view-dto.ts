import { Post } from '../../domain/post.entity';

export class PostExternalViewDto {
  id: string;

  static mapToView(post: Post): PostExternalViewDto {
    const dto = new PostExternalViewDto();

    dto.id = post.id;

    return dto;
  }
}
