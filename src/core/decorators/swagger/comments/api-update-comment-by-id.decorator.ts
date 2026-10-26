import { MutateCommentDto } from '../../../../modules/content/comments/dto/mutate-comment.dto';
import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiUpdateCommentByIdDecorator() {
  return ApiMutateEntity({
    summary: 'Update existing comment by id with InputModel',
    nameParam: 'commentId',
    bodyType: MutateCommentDto,
    bodyDescription: 'Data for updating',
    noContent: true,
    badRequest: true,
    forbidden: true,
    forbiddenDescription: 'If try edit the comment that is not your own',
    notFound: true,
  });
}
