import { ApiProperty } from '@nestjs/swagger';

import { PostLikes } from '../../domain/post-likes.entity';

export type NewestLikesViewDtoType = Pick<PostLikes, 'userId' | 'updatedAt'> & {
  login: string;
};

export class NewestLikesViewDto {
  @ApiProperty()
  addedAt: Date;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  login: string;

  static mapToNewestLikes(
    likes: NewestLikesViewDtoType[],
  ): NewestLikesViewDto[] {
    return likes.map((like) => ({
      addedAt: like.updatedAt,
      userId: like.userId,
      login: like.login,
    }));
  }
}
