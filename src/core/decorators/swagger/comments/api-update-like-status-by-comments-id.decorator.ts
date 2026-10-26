import { UpdateLikeStatusDto } from '../../../dto/update-like-status.dto';
import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiUpdateLikeStatusByCommentsIdDecorator() {
  return ApiMutateEntity({
    summary: 'Make like/unlike/dislike/undislike operation',
    nameParam: 'commentId',
    descriptionParam: 'description',
    bodyType: UpdateLikeStatusDto,
    bodyDescription: 'Like model for make like/dislike/reset operation',
    noContent: true,
    badRequest: true,
    unauthorized: true,
    notFound: true,
    notFoundMessage: "If comment with specified id doesn't exists",
  });
}
