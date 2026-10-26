import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LikeStatusEnum } from '../../../../core/types/like-status.type';
import { NewestLikesViewDtoType } from '../api/view-dto/newest-likes.view-dto';
import { PostLikes } from '../domain/post-likes.entity';
import { PostNewestLikesRow } from './mapper/post-newest-likes.mapper';

@Injectable()
export class PostLikesRepository {
  private static readonly NEWEST_LIKES_LIMIT = 3;

  constructor(
    @InjectRepository(PostLikes)
    private readonly postLikesRepository: Repository<PostLikes>,
  ) {}
  async create(postLikes: PostLikes): Promise<void> {
    await this.postLikesRepository.insert(postLikes);
  }

  async update(postLikes: PostLikes): Promise<boolean> {
    const result = await this.postLikesRepository.update(
      { id: postLikes.id },
      {
        status: postLikes.status,
      },
    );

    return !!result.affected;
  }

  async findNewestLikesByPostId(
    postId: string,
  ): Promise<NewestLikesViewDtoType[]> {
    const likes = await this.findNewestLikesByPostIds([postId]);
    return likes.map(({ userId, login, updatedAt }) => ({
      userId,
      login,
      updatedAt,
    }));
  }

  async findNewestLikesByPostIds(
    postIds: string[],
  ): Promise<(NewestLikesViewDtoType & { postId: string })[]> {
    if (postIds.length === 0) {
      return [];
    }
    const qb = this.postLikesRepository.manager
      .createQueryBuilder()
      .select('n.post_id', 'post_id')
      .addSelect('n.updated_at', 'updated_at')
      .addSelect('n.user_id', 'user_id')
      .addSelect('n.login', 'login')
      .from(
        (sub) =>
          sub
            .select('pl.postId', 'post_id')
            .addSelect('pl.updatedAt', 'updated_at')
            .addSelect('pl.userId', 'user_id')
            .addSelect('u.login', 'login')
            .addSelect(
              'ROW_NUMBER() OVER (PARTITION BY pl.postId ORDER BY pl.updatedAt DESC, pl.id DESC)',
              'rn',
            )
            .from(PostLikes, 'pl')
            .innerJoin('pl.user', 'u')
            .where('u.deletedAt IS NULL')
            .andWhere('pl.postId = ANY(:postIds)', { postIds })
            .andWhere('pl.status = :status', { status: LikeStatusEnum.Like }),
        'n',
      )
      .where('n.rn <= :limit', {
        limit: PostLikesRepository.NEWEST_LIKES_LIMIT,
      })
      .orderBy('n.post_id')
      .addOrderBy('n.rn');

    const rows = await qb.getRawMany<
      PostNewestLikesRow & { post_id: string }
    >();

    return rows.map((r: PostNewestLikesRow & { post_id: string }) => {
      return { ...PostNewestLikesRow.mapToRow(r), postId: r.post_id };
    });
  }

  async findByPostIdAndUserId(
    postId: string,
    userId: string,
  ): Promise<PostLikes | null> {
    return this.postLikesRepository.findOne({
      where: { postId, userId },
    });
  }
}
