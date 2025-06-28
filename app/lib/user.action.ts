'use server';

import { getTokenUser } from "./jwt.utils";
import { UserResponseDto } from "@/app/types/user.type";

/**
 * 사용자 ID로 사용자 정보를 찾습니다.
 */
export async function findUserById(accessToken : string | undefined): Promise<{
  success: boolean;
  data?: UserResponseDto;
  error?: string;
}> {

  if( !accessToken) {
    return {
      success: false,
      error: '액세스 토큰이 제공되지 않았습니다.'
    };
  }

  const userId = getTokenUser(accessToken);

  try {
    // API 요청
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/v1/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        error: errorData.message || '사용자 정보를 가져오는 데 실패했습니다.',
      };
    }

    const data = await response.json();

    return { 
      success: true, 
      data: data.data,
      // data,
      requiresClient: true // 클라이언트에서 추가 처리 필요함을 표시
    };
  } catch (error) {
    console.error('로그인 오류:', error);
    return { success: false, error: '서버 오류가 발생했습니다.' };
  }
}