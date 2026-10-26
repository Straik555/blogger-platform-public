import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { LikeStatusEnum } from '../../../../../core/types/like-status.type';
import { PaginatedOutputType } from '../../../../../core/types/paginated-output.type';
import { PostSortField } from '../../api/input-dto/post-sort-field.type';
import { PostsQueryParams } from '../../api/input-dto/posts-query-params.input-dto';
import { Post } from '../../domain/post.entity';
import { PostLikes } from '../../domain/post-likes.entity';
import { PostWithLikes } from '../../domain/post-with-likes';
import {
  PostRowWithLikes,
  PostWithLikesMapper,
} from '../mapper/post-with-likes.mapper';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}
  async findAll(
    query: PostsQueryParams,
    userId: string | null,
    blogId?: string,
  ): Promise<PaginatedOutputType<PostWithLikes[]>> {
    const qb = this.createBaseQuery();

    if (blogId) {
      qb.andWhere('p.blogId = :blogId', { blogId });
    }

    const totalCount = await qb.clone().getCount();

    const textFields = [PostSortField.Title, PostSortField.BlogName];
    const orderByClause = textFields.includes(query.sortBy)
      ? `${query.sortBy == PostSortField.BlogName ? 'b.name' : 'p.title'} COLLATE "C"`
      : 'p.createdAt';
    const direction = query.sortDirection.toUpperCase() as 'ASC' | 'DESC';

    this.buildPostWithLikesQuery(qb, userId)
      .orderBy(orderByClause, direction)
      .addOrderBy('p.id', direction)
      .offset(query.calculateSkip())
      .limit(query.pageSize);

    const rows = await qb.getRawMany<PostRowWithLikes>();
    const items = rows.map((r) => PostWithLikesMapper.mapRowToPostWithLikes(r));

    return {
      data: items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    };
  }

  async findPostWithLikesByPostIdAndUserId(
    postId: string,
    userId: string | null,
  ): Promise<PostWithLikes | null> {
    const qb = this.createBaseQuery().andWhere('p.id = :postId', { postId });
    const row = await this.buildPostWithLikesQuery(
      qb,
      userId,
    ).getRawOne<PostRowWithLikes>();

    return row ? PostWithLikesMapper.mapRowToPostWithLikes(row) : null;
  }

  private createBaseQuery(): SelectQueryBuilder<Post> {
    return this.postRepository
      .createQueryBuilder('p')
      .innerJoin('p.blog', 'b')
      .where('p.deletedAt IS NULL')
      .andWhere('b.deletedAt IS NULL');
  }

  private buildPostWithLikesQuery(
    qb: SelectQueryBuilder<Post>,
    userId: string | null,
  ): SelectQueryBuilder<Post> {
    qb.select('p.id', 'id')
      .addSelect('p.title', 'title')
      .addSelect('p.shortDescription', 'short_description')
      .addSelect('p.content', 'content')
      .addSelect('p.blogId', 'blog_id')
      .addSelect('p.createdAt', 'created_at')
      .addSelect('p.updatedAt', 'updated_at')
      .addSelect('p.version', 'version')
      .addSelect('p.deletedAt', 'deleted_at')
      .addSelect('b.name', 'blog_name')
      .leftJoin(PostLikes, 'pl', 'pl.postId = p.id')
      .leftJoin('pl.user', 'plu')
      .addSelect(
        `COUNT(*) FILTER (WHERE pl.status = :likeStatus AND plu.deletedAt IS NULL)`,
        'likes_count',
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE pl.status = :dislikeStatus AND plu.deletedAt IS NULL)`,
        'dislikes_count',
      )
      .setParameters({
        likeStatus: LikeStatusEnum.Like,
        dislikeStatus: LikeStatusEnum.Dislike,
      });

    if (userId) {
      qb.addSelect(
        (sub) =>
          sub
            .select('my.status')
            .from(PostLikes, 'my')
            .where('my.postId = p.id')
            .andWhere('my.userId = :userId'),
        'my_status',
      ).setParameter('userId', userId);
    } else {
      qb.addSelect('NULL', 'my_status');
    }

    return qb.groupBy('p.id').addGroupBy('b.name');
  }
}
