export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

// Common data structures for keyed responses
export interface PaginatedData<T> {
  restaurants?: T[];
  products?: T[];
  orders?: T[];
  user?: T;
  cart?: T;
  totalResults: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  count: number;
}
