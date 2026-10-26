import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { ApiCreateBlog } from '../../../../core/decorators/swagger/blogs/api-create-blog.decorator';
import { ApiCreatePostByBlogId } from '../../../../core/decorators/swagger/blogs/api-create-post-by-blog-id.decorator';
import { ApiDeleteBlogById } from '../../../../core/decorators/swagger/blogs/api-delete-blog-by-id.decorator';
import { ApiGetBlog } from '../../../../core/decorators/swagger/blogs/api-get-blog.decorator';
import { ApiGetBlogsList } from '../../../../core/decorators/swagger/blogs/api-get-blogs-list.decorator';
import { ApiGetPostsListByBlogId } from '../../../../core/decorators/swagger/blogs/api-get-posts-list-by-blog-id.decorator';
import { ApiUpdateBlogById } from '../../../../core/decorators/swagger/blogs/api-update-blog-by-id.decorator';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { BaseAuthGuard } from '../../../../core/guards/base-auth.guard';
import { ROUTER_PATH } from '../../../../core/path/router.path';
import { UuidValidationPipe } from '../../../../core/pipes/uuid-validation.pipe';
import { JwtOptionalAuthGuard } from '../../../auth/guards/bearer/jwt-optional-auth.guard';
import { ExtractUserIfExistsFromRequest } from '../../../auth/guards/decorators/params/extract-user-if-exists-from-request.decorator';
import { UserContextDto } from '../../../auth/guards/dto/user-context.dto';
import { PostsQueryParams } from '../../posts/api/input-dto/posts-query-params.input-dto';
import { PostViewDto } from '../../posts/api/view-dto/post.view-dto';
import { CreatePostCommand } from '../../posts/aplication/usecases/create-post.usecase';
import { DeletePostByBlogIdAndPostIdCommand } from '../../posts/aplication/usecases/delete-post-by-blog-id-and-post-id.usecase';
import { UpdatePostByBlogIdAndPostIdCommand } from '../../posts/aplication/usecases/update-post-by-blog-id-and-post-id.usecase';
import { CreatePostCommonDto } from '../../posts/dto/create-post-common.dto';
import { GetAllBlogsQuery } from '../aplication/queries/get-all-blogs.query';
import { GetBlogByIdQuery } from '../aplication/queries/get-blog-by-id.query';
import { GetPostsByBlogIdQuery } from '../aplication/queries/get-posts-by-blog-id.query';
import { CreateBlogCommand } from '../aplication/usecases/create-blog.usecase';
import { DeleteBlogByIdCommand } from '../aplication/usecases/delete-blog-by-id.usecase';
import { UpdateBlogCommand } from '../aplication/usecases/update-blog-by-id.usecase';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { BlogsQueryParams } from './input-dto/blogs-query-params.input-dto';
import { BlogViewDto } from './view-dto/blog.view-dto';

@UseGuards(BaseAuthGuard)
@ApiTags('BlogsSa')
@Controller(ROUTER_PATH.sa + ROUTER_PATH.blogs)
export class BlogsSaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @ApiGetBlogsList()
  @Get()
  async getBlogsLIst(
    @Query() query: BlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return await this.queryBus.execute(new GetAllBlogsQuery(query));
  }

  @ApiGetBlog()
  @Get(':id')
  async getById(
    @Param('id', UuidValidationPipe) id: string,
  ): Promise<BlogViewDto> {
    return this.queryBus.execute<GetBlogByIdQuery, BlogViewDto>(
      new GetBlogByIdQuery(id),
    );
  }

  @ApiCreateBlog()
  @Post()
  async createBlog(@Body() body: CreateBlogDto): Promise<BlogViewDto> {
    return this.commandBus.execute(new CreateBlogCommand(body));
  }

  @ApiUpdateBlogById()
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatedBlog(
    @Param('id', UuidValidationPipe) id: string,
    @Body() body: CreateBlogDto,
  ): Promise<void> {
    return this.commandBus.execute(new UpdateBlogCommand(id, body));
  }

  @ApiDeleteBlogById()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletedBlog(
    @Param('id', UuidValidationPipe) id: string,
  ): Promise<void> {
    return this.commandBus.execute(new DeleteBlogByIdCommand(id));
  }

  // Posts
  @UseGuards(JwtOptionalAuthGuard)
  @ApiGetPostsListByBlogId()
  @Get(`:blogId${ROUTER_PATH.posts}`)
  async getPostsByBlogId(
    @Param('blogId', UuidValidationPipe) blogId: string,
    @Query() query: PostsQueryParams,
    @ExtractUserIfExistsFromRequest() user: UserContextDto,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return await this.queryBus.execute(
      new GetPostsByBlogIdQuery({
        blogId,
        query,
        userId: user?.id ?? user,
      }),
    );
  }

  @ApiCreatePostByBlogId()
  @Post(`:blogId${ROUTER_PATH.posts}`)
  async createPostByBlogId(
    @Param('blogId', UuidValidationPipe) blogId: string,
    @Body() body: CreatePostCommonDto,
  ): Promise<PostViewDto> {
    return await this.commandBus.execute(
      new CreatePostCommand({ ...body, blogId }),
    );
  }

  @Put(`:blogId${ROUTER_PATH.posts}/:postId`)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostByBlogIdAndPostId(
    @Param('blogId', UuidValidationPipe) blogId: string,
    @Param('postId', UuidValidationPipe) postId: string,
    @Body() body: CreatePostCommonDto,
  ): Promise<void> {
    return await this.commandBus.execute(
      new UpdatePostByBlogIdAndPostIdCommand(body, blogId, postId),
    );
  }

  @Delete(`:blogId${ROUTER_PATH.posts}/:postId`)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostByBlogIdAndPostId(
    @Param('blogId', UuidValidationPipe) blogId: string,
    @Param('postId', UuidValidationPipe) postId: string,
  ): Promise<void> {
    return await this.commandBus.execute(
      new DeletePostByBlogIdAndPostIdCommand(blogId, postId),
    );
  }
}
