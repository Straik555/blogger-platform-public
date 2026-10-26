import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { LikeStatusEnum } from '../../../../../core/types/like-status.type';
import { PaginatedOutputType } from '../../../../../core/types/paginated-output.type';
import { CommentsQueryPrams } from '../../api/input-dto/comments-query-prams.input-dto';
import { CommentsSortField } from '../../api/input-dto/comments-sort-field.type';
import { Comment } from '../../domain/comment.entity';
import { CommentLikes } from '../../domain/comment-likes.entity';
import { CommentWithLikes } from '../../domain/comment-with-likes';
import {
  CommentRowWithLikes,
  CommentRowWithLikesMapper,
} from '../mapper/comment-with-likes.mapper';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}
  async findAll(
    query: CommentsQueryPrams,
    postId: string,
    userId: string | null,
  ): Promise<PaginatedOutputType<CommentWithLikes[]>> {
    const qb = this.createBaseQuery().andWhere('c.postId = :postId', {
      postId,
    });

    const totalCount = await qb.clone().getCount();

    const sortFields: Record<CommentsSortField, string> = {
      [CommentsSortField.CreatedAt]: 'c.created_at',
    };
    const orderByClause: string =
      sortFields[query.sortBy as CommentsSortField] ?? 'c.created_at';
    const direction =
      query.sortDirection?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    this.buildCommentWithLikesQuery(qb, userId)
      .orderBy(orderByClause, direction)
      .addOrderBy('c.id', direction)
      .offset(query.calculateSkip())
      .limit(query.pageSize);

    const rows = await qb.getRawMany<CommentRowWithLikes>();

    const comments = rows.map((r: CommentRowWithLikes) =>
      CommentRowWithLikesMapper.mapRowToCommentWithLikes(r),
    );

    return {
      data: comments,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    };
  }

  async findCommentWithLikesByCommentIdAndUserId(
    commentId: string,
    userId: string | null,
  ): Promise<CommentWithLikes | null> {
    const qb = this.createBaseQuery().andWhere('c.id = :commentId', {
      commentId,
    });

    const row = await this.buildCommentWithLikesQuery(
      qb,
      userId,
    ).getRawOne<CommentRowWithLikes>();
    return row ? CommentRowWithLikesMapper.mapRowToCommentWithLikes(row) : null;
  }

  private buildCommentWithLikesQuery(
    qb: SelectQueryBuilder<Comment>,
    userId: string | null,
  ): SelectQueryBuilder<Comment> {
    qb.select('c.id', 'id')
      .addSelect('c.userId', 'user_id')
      .addSelect('c.postId', 'post_id')
      .addSelect('c.content', 'content')
      .addSelect('c.createdAt', 'created_at')
      .addSelect('c.updatedAt', 'updated_at')
      .addSelect('c.version', 'version')
      .addSelect('u.login', 'user_login')
      .leftJoin(CommentLikes, 'cl', 'cl.commentId = c.id')
      .leftJoin('cl.user', 'clu')
      .addSelect(
        `COUNT(*) FILTER (WHERE cl.status = :likeStatus AND clu.deletedAt IS NULL)`,
        'likes_count',
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE cl.status = :dislikeStatus AND clu.deletedAt IS NULL)`,
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
            .from(CommentLikes, 'my')
            .where('my.commentId = c.id')
            .andWhere('my.userId = :userId'),
        'my_status',
      ).setParameter('userId', userId);
    } else {
      qb.addSelect('NULL', 'my_status');
    }

    return qb.groupBy('c.id').addGroupBy('u.login');
  }

  private createBaseQuery(): SelectQueryBuilder<Comment> {
    return this.commentRepository
      .createQueryBuilder('c')
      .innerJoin('c.post', 'p')
      .innerJoin('c.user', 'u')
      .where('p.deletedAt IS NULL')
      .andWhere('u.deletedAt IS NULL');
  }
}
