import { BlogViewDto } from '../../../../modules/content/blogs/api/view-dto/blog.view-dto';
import { CreateBlogDto } from '../../../../modules/content/blogs/dto/create-blog.dto';
import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiCreateBlog() {
  return ApiMutateEntity({
    summary: 'Create blog',
    bodyType: CreateBlogDto,
    bodyDescription: 'Data for constructing new Blog entity',
    responseDescription: 'Returns the newly created blog',
    responseType: BlogViewDto,
    badRequest: true,
    created: true,
    unauthorized: true,
  });
}
