'use server';

import { SignUpResponse } from '@/app/types/auth.type';
import { getTokenUser } from './jwt.utils';

export async function signUp(formData: FormData) {
  // 1. 데이터 추출
  const phoneNumber = formData.get('phoneNumber') as string;
  const loginId = formData.get('username') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const description = formData.get('description') as string;

  // 2. 데이터 검증
  if (!phoneNumber || !loginId || !password || !confirmPassword) {
    return { success: false, error: '모든 필드를 입력해주세요.' };
  }

  if (password !== confirmPassword) {
    return { success: false, error: '비밀번호가 일치하지 않습니다.' };
  }

  console.log("회원가입 요청" + JSON.stringify({
    phoneNumber,
    loginId,
    password,
    confirmPassword,
    description
  }));

  try {
    // 3. API 요청
    console.log(`API URL: ${process.env.NEXT_PUBLIC_API_URL || ''}/v1/users/sign-up`)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/v1/users/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        loginId,
        password,
        description
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        error: errorData.message || '회원가입에 실패했습니다.' 
      };
    }

    const data: SignUpResponse = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('회원가입 오류:', error);
    return { success: false, error: '서버 오류가 발생했습니다.' };
  }
}

// 기존 코드에 추가
export async function login(formData: FormData) {
  // 데이터 추출
  const loginId = formData.get('username') as string;
  const password = formData.get('password') as string;

  // 데이터 검증
  if (!loginId || !password) {
    return { success: false, error: '아이디와 비밀번호를 입력해주세요.' };
  }

  try {
    // API 요청
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        loginId,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        error: errorData.message || '로그인에 실패했습니다.' 
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

// 로그아웃 처리
export async function logoutFromServer(token: string) {

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/v1/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':  `${token}`, // 토큰을 Authorization 헤더에 포함
      },
      body: JSON.stringify({ 
        userId: getTokenUser(token)
       }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        error: errorData.message || '로그아웃에 실패했습니다.' 
      };
    }

    return { success: true };
  } catch (error) {
    console.error('로그아웃 오류:', error);
    return { success: false, error: '서버 오류가 발생했습니다.' };
  }
}