export interface SearchResult<T> {
  total?: number;
  results: T[];
  last?: boolean;
}
