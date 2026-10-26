import { CommentViewDto } from '../../../../modules/content/comments/api/view-dto/comment.view-dto';
import { ApiGetById } from '../common/api-get-by-id.decorator';

export function ApiCommentById() {
  return ApiGetById({
    summary: 'Return comment by id',
    notFound: true,
    descriptionParam: 'Id of existing comment',
    responseType: CommentViewDto,
    typeParam: String,
  });
}
