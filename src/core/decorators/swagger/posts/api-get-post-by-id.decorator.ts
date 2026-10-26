import { PostViewDto } from '../../../../modules/content/posts/api/view-dto/post.view-dto';
import { ApiGetById } from '../common/api-get-by-id.decorator';

export function ApiGetPostById() {
  return ApiGetById({
    summary: 'Return post by id',
    notFound: true,
    descriptionParam: 'Id of existing post',
    responseType: PostViewDto,
  });
}
