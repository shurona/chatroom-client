export interface ApiResponseType<T> {
  success: boolean;
  data?: T;
  message?: string;
}


export interface ServerResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
