export interface SuccessResponse<T> {
  statusCode: number;
  result: T;
}

export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}
