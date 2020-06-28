export interface SearchResult<T> {
  itemTotal: number;
  results: T[];
  lastPage: boolean;
}
