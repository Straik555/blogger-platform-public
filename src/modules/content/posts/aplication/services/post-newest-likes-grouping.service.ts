import { Injectable } from '@nestjs/common';

import { NewestLikesViewDtoType } from '../../api/view-dto/newest-likes.view-dto';
import { PostLikesRepository } from '../../infrastructure/post-likes.repository';

@Injectable()
export class PostNewestLikesGroupingService {
  constructor(private readonly postLikesRepository: PostLikesRepository) {}

  async groupByPostIds(
    postIds: string[],
  ): Promise<Map<string, NewestLikesViewDtoType[]>> {
    const rows =
      await this.postLikesRepository.findNewestLikesByPostIds(postIds);

    const map = new Map<string, NewestLikesViewDtoType[]>();

    for (const { postId, ...like } of rows) {
      const list = map.get(postId);
      if (list) {
        list.push(like);
      } else {
        map.set(postId, [like]);
      }
    }

    return map;
  }
}
