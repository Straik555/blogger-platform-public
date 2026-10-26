import { CreatePostDto } from '../../../../modules/content/posts/dto/create-post.dto';
import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiUpdatePostById() {
  return ApiMutateEntity({
    summary: 'Update existing post by id with inputModel',
    notFound: true,
    descriptionParam: 'Blog id',
    unauthorized: true,
    badRequest: true,
    isApiParams: true,
    bodyDescription: 'Data for updating',
    bodyType: CreatePostDto,
  });
}
