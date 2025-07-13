// backend Api 응답 스키마
export interface ApiResponseType<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// 페이지 정보를 포함한 응답 타입
export interface PageResponseType<T> {
  content: T[];
  page: number; // 현재 페이지
  size: number; // 현재 사이즈
  totalElements: number; // 총 갯수
  totalPages: number; // 총 페이지
}

// Next.js 서버 응답 타입
export interface ServerResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
