import { FormatInteger } from '../decorators/swagger/common/format-integer.decorator';

export abstract class PaginatedViewDto<T> {
  abstract items: T;
  @FormatInteger()
  totalCount: number;

  @FormatInteger()
  pagesCount: number;

  @FormatInteger()
  page: number;

  @FormatInteger()
  pageSize: number;

  public static mapToView<T>(data: {
    items: T;
    page: number;
    size: number;
    totalCount: number;
  }): PaginatedViewDto<T> {
    return {
      totalCount: data.totalCount,
      pagesCount: Math.ceil(data.totalCount / data.size),
      page: data.page,
      pageSize: data.size,
      items: data.items,
    };
  }
}
