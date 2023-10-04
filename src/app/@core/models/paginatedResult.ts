export interface PaginatedResult<T> {
  totalResults: number;
  remainingCount: number;
  lastDataCursor: string | null;
  results: Array<T>;
}
