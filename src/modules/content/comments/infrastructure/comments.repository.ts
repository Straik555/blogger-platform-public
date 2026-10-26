import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Comment } from '../domain/comment.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}
  async create(
    comment: Comment,
    manager: EntityManager = this.commentRepository.manager,
  ): Promise<Comment> {
    await manager.insert(Comment, comment);
    return comment;
  }

  async updateWithVersion(comment: Comment): Promise<boolean> {
    const result = await this.commentRepository.update(
      {
        id: comment.id,
        version: comment.version,
      },
      {
        content: comment.content,
      },
    );
    if (!result.affected) return false;
    comment.version += 1;
    return true;
  }

  async findById(id: string): Promise<Comment | null> {
    const qb = this.commentRepository
      .createQueryBuilder('c')
      .innerJoin('c.post', 'p')
      .innerJoin('c.user', 'u')
      .where('c.id = :id', { id })
      .andWhere('u.deletedAt IS NULL')
      .andWhere('p.deletedAt IS NULL');
    return await qb.getOne();
  }

  async deleteById(id: string): Promise<void> {
    await this.commentRepository.delete(id);
  }
}
