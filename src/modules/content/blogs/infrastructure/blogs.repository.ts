import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Repository } from 'typeorm';

import { Blog } from '../domain/blog.entity';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
  ) {}
  async create(blog: Blog): Promise<Blog> {
    await this.blogRepository.insert(blog);
    return blog;
  }

  async updateWithVersion(
    blog: Blog,
    manager: EntityManager = this.blogRepository.manager,
  ): Promise<boolean> {
    const result = await manager.getRepository(Blog).update(
      { id: blog.id, version: blog.version },
      {
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        isMembership: blog.isMembership,
        deletedAt: blog.deletedAt,
      },
    );
    if (result.affected) {
      blog.version += 1;
      return true;
    }
    return false;
  }

  async findById(blogId: string): Promise<Blog | null> {
    return this.blogRepository.findOne({
      where: { id: blogId, deletedAt: IsNull() },
    });
  }

  async findByIdForShare(
    blogId: string,
    manager: EntityManager,
  ): Promise<Blog | null> {
    return manager.getRepository(Blog).findOne({
      where: { id: blogId, deletedAt: IsNull() },
      lock: { mode: 'pessimistic_read' },
    });
  }

  async findByIdForUpdate(
    blogId: string,
    manager: EntityManager,
  ): Promise<Blog | null> {
    return manager.getRepository(Blog).findOne({
      where: { id: blogId, deletedAt: IsNull() },
      lock: { mode: 'pessimistic_write' },
    });
  }
}
