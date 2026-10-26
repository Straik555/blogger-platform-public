export type PaginatedOutputType<T> = {
  data: T;
  totalCount: number;
  page: number;
  size: number;
};
