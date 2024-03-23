export interface List<T> {
  items: T[];
  count: number;
}

export interface FilterDto {
  page?: number;
  pageSize?: number;
}
