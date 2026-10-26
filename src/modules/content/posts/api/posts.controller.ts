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

import { ApiCreateCommentByPostIdDecorator } from '../../../../core/decorators/swagger/posts/api-create-comment-by-post-id.decorator';
import { ApiCreatePost } from '../../../../core/decorators/swagger/posts/api-create-post.decorator';
import { ApiDeletePostById } from '../../../../core/decorators/swagger/posts/api-delete-post-by-id.decorator';
import { ApiGetCommentsListByPostId } from '../../../../core/decorators/swagger/posts/api-get-comments-list-by-post-id.decorator';
import { ApiGetPostById } from '../../../../core/decorators/swagger/posts/api-get-post-by-id.decorator';
import { ApiGetPostsList } from '../../../../core/decorators/swagger/posts/api-get-posts-list.decorator';
import { ApiUpdateLikeStatusByPostIdDecorator } from '../../../../core/decorators/swagger/posts/api-update-like-status-by-post-id.decorator';
import { ApiUpdatePostById } from '../../../../core/decorators/swagger/posts/api-update-post-by-id.decorator';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { UpdateLikeStatusDto } from '../../../../core/dto/update-like-status.dto';
import { BaseAuthGuard } from '../../../../core/guards/base-auth.guard';
import { ROUTER_PATH } from '../../../../core/path/router.path';
import { UuidValidationPipe } from '../../../../core/pipes/uuid-validation.pipe';
import { JwtAuthGuard } from '../../../auth/guards/bearer/jwt-auth.guard';
import { JwtOptionalAuthGuard } from '../../../auth/guards/bearer/jwt-optional-auth.guard';
import { ExtractUserFromRequest } from '../../../auth/guards/decorators/params/extract-user-from-request.decorator';
import { ExtractUserIfExistsFromRequest } from '../../../auth/guards/decorators/params/extract-user-if-exists-from-request.decorator';
import { UserContextDto } from '../../../auth/guards/dto/user-context.dto';
import { CommentsQueryPrams } from '../../comments/api/input-dto/comments-query-prams.input-dto';
import { CommentViewDto } from '../../comments/api/view-dto/comment.view-dto';
import { GetAllCommentsByPostIdQuery } from '../../comments/aplication/queries/get-all-comments-by-post-id.query';
import { CreateCommentCommand } from '../../comments/aplication/usecases/create-comment.usecase';
import { MutateCommentDto } from '../../comments/dto/mutate-comment.dto';
import { GetAllPostsQuery } from '../aplication/queries/get-all-posts.query';
import { GetPostByIdQuery } from '../aplication/queries/get-post-by-id.query';
import { CreatePostCommand } from '../aplication/usecases/create-post.usecase';
import { DeletePostByIdCommand } from '../aplication/usecases/delete.post-by-id.usecase';
import { UpdatePostByIdCommand } from '../aplication/usecases/update-post-by-id.usecase';
import { UpdatePostLikeStatusCommand } from '../aplication/usecases/update-post-like-status.usecase';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostsQueryParams } from './input-dto/posts-query-params.input-dto';
import { PostViewDto } from './view-dto/post.view-dto';

@Controller(ROUTER_PATH.posts)
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiGetPostsList()
  @UseGuards(JwtOptionalAuthGuard)
  @Get()
  async getPostsLIst(
    @Query() query: PostsQueryParams,
    @ExtractUserIfExistsFromRequest() user: UserContextDto,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return await this.queryBus.execute(
      new GetAllPostsQuery(query, user?.id ?? user),
    );
  }

  @UseGuards(JwtOptionalAuthGuard)
  @ApiGetPostById()
  @Get(':id')
  async getPostById(
    @Param('id', UuidValidationPipe) id: string,
    @ExtractUserIfExistsFromRequest() user: UserContextDto,
  ): Promise<PostViewDto> {
    return await this.queryBus.execute(
      new GetPostByIdQuery(id, user?.id ?? user),
    );
  }

  @UseGuards(BaseAuthGuard)
  @ApiCreatePost()
  @Post()
  async createPost(@Body() body: CreatePostDto): Promise<PostViewDto> {
    return await this.commandBus.execute(new CreatePostCommand(body));
  }

  @UseGuards(BaseAuthGuard)
  @ApiUpdatePostById()
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostById(
    @Param('id', UuidValidationPipe) id: string,
    @Body() body: CreatePostDto,
  ): Promise<void> {
    return await this.commandBus.execute(new UpdatePostByIdCommand(body, id));
  }

  @UseGuards(BaseAuthGuard)
  @ApiDeletePostById()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id', UuidValidationPipe) id: string): Promise<void> {
    return await this.commandBus.execute(new DeletePostByIdCommand(id));
  }

  @UseGuards(JwtAuthGuard)
  @ApiUpdateLikeStatusByPostIdDecorator()
  @Put(`:postId${ROUTER_PATH.likeStatus}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateLikeStatus(
    @Param('postId', UuidValidationPipe) postId: string,
    @Body() body: UpdateLikeStatusDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdatePostLikeStatusCommand({
        status: body.likeStatus,
        userId: user.id,
        postId,
      }),
    );
  }

  //   Comments
  @ApiCreateCommentByPostIdDecorator()
  @UseGuards(JwtAuthGuard)
  @Post(`:postId${ROUTER_PATH.comments}`)
  async createComment(
    @Body() comment: MutateCommentDto,
    @Param('postId', UuidValidationPipe) postId: string,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<CommentViewDto> {
    return await this.commandBus.execute(
      new CreateCommentCommand({ postId, dto: comment, userId: user.id }),
    );
  }

  @UseGuards(JwtOptionalAuthGuard)
  @ApiGetCommentsListByPostId()
  @Get(`:postId${ROUTER_PATH.comments}`)
  async getCommentsListByPostId(
    @Param('postId', UuidValidationPipe) postId: string,
    @Query() query: CommentsQueryPrams,
    @ExtractUserIfExistsFromRequest() user: UserContextDto,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    return await this.queryBus.execute(
      new GetAllCommentsByPostIdQuery({
        postId,
        query,
        userId: user?.id ?? user,
      }),
    );
  }
}
