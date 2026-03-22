export interface ApiResponse<T> {
  success: true;
  data: T | T[];
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
