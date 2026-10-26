import { CommentViewDto } from '../../../../modules/content/comments/api/view-dto/comment.view-dto';
import { MutateCommentDto } from '../../../../modules/content/comments/dto/mutate-comment.dto';
import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiCreateCommentByPostIdDecorator() {
  return ApiMutateEntity({
    summary: 'Create new comment',
    nameParam: 'postId',
    descriptionParam: 'description',
    bodyType: MutateCommentDto,
    created: true,
    responseDescription: 'Returns the newly created post',
    responseType: CommentViewDto,
    badRequest: true,
    unauthorized: true,
    notFound: true,
    notFoundMessage: "If post with specified postId doesn't exists",
  });
}
