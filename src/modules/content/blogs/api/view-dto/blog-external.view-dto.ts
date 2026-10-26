import { Blog } from '../../domain/blog.entity';

export class BlogExternalViewDto {
  id: string;
  name: string;
  isMembership: boolean;

  static mapToExternal(blog: Blog): BlogExternalViewDto {
    const dto = new BlogExternalViewDto();
    dto.id = blog.id;
    dto.name = blog.name;
    dto.isMembership = blog.isMembership;
    return dto;
  }
}
