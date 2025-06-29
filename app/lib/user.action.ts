'use server';

import { getTokenUser } from "./jwt.utils";
import { UserResponseDto, UserSearchResult } from "@/app/types/user.type";

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
    };
  } catch (error) {
    console.error('로그인 오류:', error);
    return { success: false, error: '서버 오류가 발생했습니다.' };
  }
}

export async function findUserByNickname(accessToken: string, nickname: string, page: number): Promise<{
  success: boolean;
  data?: UserSearchResult[];
  error?: string;
}> {

  if (!accessToken) {
    return {
      success: false,
      error: '액세스 토큰이 제공되지 않았습니다.'
    };
  }

  try {
    // API 요청
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/v1/users/list?query=${nickname}&page=${page}`, {
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
    };
  } catch (error) {
    console.error('사용자 검색 오류:', error);
    return { success: false, error: '서버 오류가 발생했습니다.' };
  }
}