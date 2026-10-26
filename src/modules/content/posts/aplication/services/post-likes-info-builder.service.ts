import { Injectable } from '@nestjs/common';

import { NewestLikesViewDto } from '../../api/view-dto/newest-likes.view-dto';
import { PostLikesRepository } from '../../infrastructure/post-likes.repository';

@Injectable()
export class PostLikesInfoBuilderService {
  constructor(private readonly postLikesRepository: PostLikesRepository) {}
  async build(postId: string): Promise<NewestLikesViewDto[]> {
    const newestLikes =
      await this.postLikesRepository.findNewestLikesByPostId(postId);
    return NewestLikesViewDto.mapToNewestLikes(newestLikes);
  }
}
