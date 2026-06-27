export interface ApiResponse<T> {
  success: boolean;
  requestId: string;
  timestamp: string;
  executionTime: number;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  requestId: string;
  timestamp: string;

  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
