import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { ApiCommentById } from '../../../../core/decorators/swagger/comments/api-comment-by-id.decorator';
import { ApiDeleteCommentByIdDecorator } from '../../../../core/decorators/swagger/comments/api-delete-comment-by-id.decorator';
import { ApiUpdateCommentByIdDecorator } from '../../../../core/decorators/swagger/comments/api-update-comment-by-id.decorator';
import { ApiUpdateLikeStatusByCommentsIdDecorator } from '../../../../core/decorators/swagger/comments/api-update-like-status-by-comments-id.decorator';
import { UpdateLikeStatusDto } from '../../../../core/dto/update-like-status.dto';
import { ROUTER_PATH } from '../../../../core/path/router.path';
import { UuidValidationPipe } from '../../../../core/pipes/uuid-validation.pipe';
import { JwtAuthGuard } from '../../../auth/guards/bearer/jwt-auth.guard';
import { JwtOptionalAuthGuard } from '../../../auth/guards/bearer/jwt-optional-auth.guard';
import { ExtractUserFromRequest } from '../../../auth/guards/decorators/params/extract-user-from-request.decorator';
import { ExtractUserIfExistsFromRequest } from '../../../auth/guards/decorators/params/extract-user-if-exists-from-request.decorator';
import { Public } from '../../../auth/guards/decorators/public.decorator';
import { UserContextDto } from '../../../auth/guards/dto/user-context.dto';
import { GetCommentByIdQuery } from '../aplication/queries/get-comment-by-id.query';
import { DeleteCommentByIdCommand } from '../aplication/usecases/delete-comment-by-id.usecase';
import { UpdateCommentByIdCommand } from '../aplication/usecases/update-comment-by-id.usecase';
import { UpdateCommentLikeStatusCommand } from '../aplication/usecases/update-comment-like-status.usecase';
import { MutateCommentDto } from '../dto/mutate-comment.dto';
import { CommentViewDto } from './view-dto/comment.view-dto';

@UseGuards(JwtAuthGuard)
@Controller(ROUTER_PATH.comments)
export class CommentsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}
  @ApiCommentById()
  @Public()
  @UseGuards(JwtOptionalAuthGuard)
  @Get(':commentId')
  async getCommentById(
    @Param('commentId', UuidValidationPipe) commentId: string,
    @ExtractUserIfExistsFromRequest() user: UserContextDto,
  ): Promise<CommentViewDto> {
    return await this.queryBus.execute(
      new GetCommentByIdQuery(commentId, user?.id ?? user),
    );
  }

  @ApiUpdateCommentByIdDecorator()
  @Put(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCommentById(
    @Param('commentId', UuidValidationPipe) commentId: string,
    @Body() updateCommentDto: MutateCommentDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<void> {
    return await this.commandBus.execute(
      new UpdateCommentByIdCommand({
        userId: user.id,
        content: updateCommentDto.content,
        id: commentId,
      }),
    );
  }

  @ApiDeleteCommentByIdDecorator()
  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCommentById(
    @Param('commentId', UuidValidationPipe) commentId: string,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<void> {
    return await this.commandBus.execute(
      new DeleteCommentByIdCommand(commentId, user.id),
    );
  }

  @ApiUpdateLikeStatusByCommentsIdDecorator()
  @Put(`:commentId${ROUTER_PATH.likeStatus}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateLikeStatusByCommentId(
    @Param('commentId', UuidValidationPipe) commentId: string,
    @Body() dto: UpdateLikeStatusDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<void> {
    return await this.commandBus.execute(
      new UpdateCommentLikeStatusCommand({
        status: dto.likeStatus,
        userId: user.id,
        id: commentId,
      }),
    );
  }
}
