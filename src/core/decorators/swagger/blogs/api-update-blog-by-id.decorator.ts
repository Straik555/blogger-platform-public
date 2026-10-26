import { CreateBlogDto } from '../../../../modules/content/blogs/dto/create-blog.dto';
import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiUpdateBlogById() {
  return ApiMutateEntity({
    summary: 'Update existing blog by id with inputModel',
    notFound: true,
    descriptionParam: 'Blog id',
    unauthorized: true,
    badRequest: true,
    isApiParams: true,
    bodyDescription: 'Data for updating',
    bodyType: CreateBlogDto,
  });
}
