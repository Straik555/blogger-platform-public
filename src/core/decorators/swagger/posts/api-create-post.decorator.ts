import { PostViewDto } from '../../../../modules/content/posts/api/view-dto/post.view-dto';
import { CreatePostDto } from '../../../../modules/content/posts/dto/create-post.dto';
import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiCreatePost() {
  return ApiMutateEntity({
    summary: 'Create new post',
    bodyDescription: 'Data for constructing new post entity',
    bodyType: CreatePostDto,
    created: true,
    responseDescription: 'Returns the newly created post',
    responseType: PostViewDto,
    unauthorized: true,
    badRequest: true,
  });
}
