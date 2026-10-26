import { UpdateLikeStatusDto } from '../../../dto/update-like-status.dto';
import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiUpdateLikeStatusByPostIdDecorator() {
  return ApiMutateEntity({
    summary: 'Make like/unlike/dislike/undislike operation',
    nameParam: 'postId',
    bodyDescription: 'Like model for make like/dislike/reset operation',
    bodyType: UpdateLikeStatusDto,
    noContent: true,
    badRequest: true,
    unauthorized: true,
    notFound: true,
    noContentDescription: "If post with specified postId doesn't exists",
  });
}
