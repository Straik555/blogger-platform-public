import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/user.module';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsSaController } from './blogs/api/blogs.sa.controller';
import { BlogsExternalService } from './blogs/aplication/external/blogs.external-service';
import { GetAllBlogsQueryHandler } from './blogs/aplication/queries/get-all-blogs.query';
import { GetBlogByIdQueryHandler } from './blogs/aplication/queries/get-blog-by-id.query';
import { GetPostsByBlogIdQueryHandler } from './blogs/aplication/queries/get-posts-by-blog-id.query';
import { BlogsService } from './blogs/aplication/services/blogs.service';
import { CreateBlogUseCase } from './blogs/aplication/usecases/create-blog.usecase';
import { DeleteBlogByIdUseCase } from './blogs/aplication/usecases/delete-blog-by-id.usecase';
import { UpdateBlogByIdUseCase } from './blogs/aplication/usecases/update-blog-by-id.usecase';
import { Blog } from './blogs/domain/blog.entity';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './blogs/infrastructure/query/blogs-query.repository';
import { CommentsController } from './comments/api/comments.controller';
import { GetAllCommentsByPostByIdQueryHandler } from './comments/aplication/queries/get-all-comments-by-post-id.query';
import { GetCommentByIdQueryHandler } from './comments/aplication/queries/get-comment-by-id.query';
import { CommentsService } from './comments/aplication/services/comments.service';
import { CreateCommentUseCase } from './comments/aplication/usecases/create-comment.usecase';
import { DeleteCommentByIdUseCase } from './comments/aplication/usecases/delete-comment-by-id.usecase';
import { UpdateCommentByIdUseCase } from './comments/aplication/usecases/update-comment-by-id.usecase';
import { UpdateCommentLikeStatusUseCase } from './comments/aplication/usecases/update-comment-like-status.usecase';
import { Comment } from './comments/domain/comment.entity';
import { CommentLikes } from './comments/domain/comment-likes.entity';
import { CommentLikesRepository } from './comments/infrastructure/comment-likes.repository';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import { CommentsQueryRepository } from './comments/infrastructure/query/comments-query.repository';
import { PostsController } from './posts/api/posts.controller';
import { PostsExternalService } from './posts/aplication/external/posts.external-service';
import { GetAllPostsQueryHandler } from './posts/aplication/queries/get-all-posts.query';
import { GetPostByIdQueryHandler } from './posts/aplication/queries/get-post-by-id.query';
import { PostLikesInfoBuilderService } from './posts/aplication/services/post-likes-info-builder.service';
import { PostNewestLikesGroupingService } from './posts/aplication/services/post-newest-likes-grouping.service';
import { PostWithLikesFinderService } from './posts/aplication/services/post-with-likes-finder.service';
import { PostsService } from './posts/aplication/services/posts.service';
import { CreatePostUseCase } from './posts/aplication/usecases/create-post.usecase';
import { DeletePostByIdUseCase } from './posts/aplication/usecases/delete.post-by-id.usecase';
import { DeletePostByBlogIdAndPostIdUseCase } from './posts/aplication/usecases/delete-post-by-blog-id-and-post-id.usecase';
import { UpdatePostByBlogIdAndPostIdUseCase } from './posts/aplication/usecases/update-post-by-blog-id-and-post-id.usecase';
import { UpdatePostByIdUseCase } from './posts/aplication/usecases/update-post-by-id.usecase';
import { UpdatePostLikeStatusUseCase } from './posts/aplication/usecases/update-post-like-status.usecase';
import { Post } from './posts/domain/post.entity';
import { PostLikes } from './posts/domain/post-likes.entity';
import { PostLikesRepository } from './posts/infrastructure/post-likes.repository';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { PostsQueryRepository } from './posts/infrastructure/query/posts-query.repository';

const useCases = [
  // Blogs
  CreateBlogUseCase,
  UpdateBlogByIdUseCase,
  DeleteBlogByIdUseCase,
  GetPostsByBlogIdQueryHandler,
  GetBlogByIdQueryHandler,
  GetAllBlogsQueryHandler,

  //   Posts
  CreatePostUseCase,
  UpdatePostByIdUseCase,
  DeletePostByIdUseCase,
  UpdatePostLikeStatusUseCase,
  UpdatePostByBlogIdAndPostIdUseCase,
  DeletePostByBlogIdAndPostIdUseCase,
  GetAllPostsQueryHandler,
  GetPostByIdQueryHandler,

  //   Comment
  CreateCommentUseCase,
  UpdateCommentByIdUseCase,
  DeleteCommentByIdUseCase,
  UpdateCommentLikeStatusUseCase,
  GetAllCommentsByPostByIdQueryHandler,
  GetCommentByIdQueryHandler,
];

@Module({
  imports: [
    // Users
    UsersModule,
    // Blogs
    TypeOrmModule.forFeature([Blog, Post, PostLikes, Comment, CommentLikes]),

    // Posts

    // Comments
  ],
  controllers: [
    // Blogs
    BlogsController,
    BlogsSaController,

    // Posts
    PostsController,

    // Comments
    CommentsController,
  ],
  providers: [
    ...useCases,
    // Blogs
    BlogsRepository,
    BlogsService,
    BlogsExternalService,
    BlogsQueryRepository,

    // Posts
    PostsExternalService,
    PostsService,
    PostNewestLikesGroupingService,
    PostLikesInfoBuilderService,
    PostWithLikesFinderService,
    PostsRepository,
    PostLikesRepository,
    PostsQueryRepository,

    // Comments
    CommentsService,
    CommentsRepository,
    CommentLikesRepository,
    CommentsQueryRepository,
  ],
  exports: [],
})
export class ContentModule {}
