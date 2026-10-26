import { PostViewDto } from '../../../../modules/content/posts/api/view-dto/post.view-dto';
import { CreatePostCommonDto } from '../../../../modules/content/posts/dto/create-post-common.dto';
import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiCreatePostByBlogId() {
  return ApiMutateEntity({
    summary: 'Create new posts for specific blog',
    bodyDescription: 'Data for constructing new post entity',
    bodyType: CreatePostCommonDto,
    responseDescription: 'Returns the newly created post',
    responseType: PostViewDto,
    notFound: true,
    notFoundMessage: "If specified blog doesn't exists",
    isApiParams: true,
    nameParam: 'blogId',
    unauthorized: true,
  });
}
