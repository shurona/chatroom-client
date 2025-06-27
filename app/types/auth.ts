// Sign Up response Type
export interface SignUpResponse {
  success: boolean;
  data?: {
    userId: number;
    loginId: string;
  };
  message?: string;
}