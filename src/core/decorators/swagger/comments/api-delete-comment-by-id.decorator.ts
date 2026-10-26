import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiDeleteCommentByIdDecorator() {
  return ApiMutateEntity({
    summary: 'Delete comment specified by id',
    nameParam: 'commentId',
    descriptionParam: 'Comment id',
    notFound: true,
    unauthorized: true,
    noContent: true,
    forbidden: true,
    forbiddenDescription: 'If try delete the comment that is not your own',
  });
}
