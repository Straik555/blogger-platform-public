import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { ApiGetBlog } from '../../../../core/decorators/swagger/blogs/api-get-blog.decorator';
import { ApiGetBlogsList } from '../../../../core/decorators/swagger/blogs/api-get-blogs-list.decorator';
import { ApiGetPostsListByBlogId } from '../../../../core/decorators/swagger/blogs/api-get-posts-list-by-blog-id.decorator';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { ROUTER_PATH } from '../../../../core/path/router.path';
import { UuidValidationPipe } from '../../../../core/pipes/uuid-validation.pipe';
import { JwtOptionalAuthGuard } from '../../../auth/guards/bearer/jwt-optional-auth.guard';
import { ExtractUserIfExistsFromRequest } from '../../../auth/guards/decorators/params/extract-user-if-exists-from-request.decorator';
import { Public } from '../../../auth/guards/decorators/public.decorator';
import { UserContextDto } from '../../../auth/guards/dto/user-context.dto';
import { PostsQueryParams } from '../../posts/api/input-dto/posts-query-params.input-dto';
import { PostViewDto } from '../../posts/api/view-dto/post.view-dto';
import { GetAllBlogsQuery } from '../aplication/queries/get-all-blogs.query';
import { GetBlogByIdQuery } from '../aplication/queries/get-blog-by-id.query';
import { GetPostsByBlogIdQuery } from '../aplication/queries/get-posts-by-blog-id.query';
import { BlogsQueryParams } from './input-dto/blogs-query-params.input-dto';
import { BlogViewDto } from './view-dto/blog.view-dto';

@ApiTags('Blogs')
@Controller(ROUTER_PATH.blogs)
export class BlogsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Public()
  @ApiGetBlogsList()
  @Get()
  async getBlogsLIst(
    @Query() query: BlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return await this.queryBus.execute(new GetAllBlogsQuery(query));
  }

  @Public()
  @ApiGetBlog()
  @Get(':id')
  async getById(
    @Param('id', UuidValidationPipe) id: string,
  ): Promise<BlogViewDto> {
    return this.queryBus.execute<GetBlogByIdQuery, BlogViewDto>(
      new GetBlogByIdQuery(id),
    );
  }

  // Posts
  @UseGuards(JwtOptionalAuthGuard)
  @Public()
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
}
