import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { DomainException } from '../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../core/helpers/error-message.helper';
import { CreateBlogDomainDto } from './dto/create-blog.domain.dto';
import {
  BlogDescription,
  BlogName,
  MembershipStatus,
  WebsiteUrl,
} from './value-objects';

@Entity('blogs')
@Check('name', 'length(name::text) >= 1')
@Check('website_url', 'length(website_url::text) >= 9')
export class Blog {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'blogs_pkey' })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 1000 })
  description: string;

  @Column({ name: 'website_url', type: 'varchar', length: 255 })
  websiteUrl: string;

  @Column({ name: 'is_membership', type: 'boolean', default: false })
  isMembership: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({
    name: 'deleted_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt: Date | null;

  @VersionColumn()
  version: number;

  deleted() {
    if (this.deletedAt !== null) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: errorMessageHelper.isDeleted('blog'),
      });
    }
    this.deletedAt = new Date();
  }

  static createBlog(dto: CreateBlogDomainDto): Blog {
    const blog = new Blog();
    blog.name = BlogName.create(dto.name).value;
    blog.description = BlogDescription.create(dto.description).value;
    blog.websiteUrl = WebsiteUrl.create(dto.websiteUrl).value;
    blog.isMembership = MembershipStatus.default().value;
    return blog;
  }

  updatedBlog(dto: CreateBlogDomainDto) {
    this.name = BlogName.create(dto.name).value;
    this.description = BlogDescription.create(dto.description).value;
    this.websiteUrl = WebsiteUrl.create(dto.websiteUrl).value;
  }
}
