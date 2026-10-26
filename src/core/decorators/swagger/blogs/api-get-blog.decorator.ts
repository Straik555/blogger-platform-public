import { BlogViewDto } from '../../../../modules/content/blogs/api/view-dto/blog.view-dto';
import { ApiGetById } from '../common/api-get-by-id.decorator';

export function ApiGetBlog() {
  return ApiGetById({
    summary: 'Return blog by id',
    responseType: BlogViewDto,
    notFound: true,
    descriptionParam: 'Existing blog id',
  });
}
