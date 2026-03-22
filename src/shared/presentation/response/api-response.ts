export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T | T[];
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
