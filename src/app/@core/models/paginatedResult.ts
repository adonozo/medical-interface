export interface PaginatedResult<T> {
  totalResults: number;
  remainingCount: number;
  lastDataCursor: string;
  results: Array<T>;
}
