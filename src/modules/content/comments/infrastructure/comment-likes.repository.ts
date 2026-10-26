import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentLikes } from '../domain/comment-likes.entity';

@Injectable()
export class CommentLikesRepository {
  constructor(
    @InjectRepository(CommentLikes)
    private readonly commentLikesRepository: Repository<CommentLikes>,
  ) {}

  async upsert(commentLikes: CommentLikes): Promise<void> {
    await this.commentLikesRepository.upsert(
      {
        commentId: commentLikes.commentId,
        userId: commentLikes.userId,
        status: commentLikes.status,
      },
      {
        conflictPaths: ['commentId', 'userId'],
      },
    );
  }
}
