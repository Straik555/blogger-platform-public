import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Repository } from 'typeorm';

import { Post } from '../domain/post.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async create(
    post: Post,
    manager: EntityManager = this.postRepository.manager,
  ): Promise<Post> {
    await manager.insert(Post, post);
    return post;
  }

  async updateWithVersion(post: Post): Promise<boolean> {
    const result = await this.postRepository.update(
      { id: post.id, version: post.version },
      {
        title: post.title,
        content: post.content,
        blogId: post.blogId,
        shortDescription: post.shortDescription,
        deletedAt: post.deletedAt,
      },
    );

    if (!result.affected) return false;
    post.version += 1;
    return true;
  }

  async findById(id: string): Promise<Post | null> {
    return await this.postRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async existsByBlogId(
    blogId: string,
    manager: EntityManager = this.postRepository.manager,
  ): Promise<boolean> {
    return manager.getRepository(Post).exists({
      where: { blogId, deletedAt: IsNull() },
    });
  }
}
