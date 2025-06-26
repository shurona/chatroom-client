'use client';

import { useState } from 'react';
import { getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { logoutFromServer } from '../auth.action';

export function useLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const logout = async () => {
    setIsLoggingOut(true);
    
    try {
      // 1. 백엔드 로그아웃
      const session = await getSession();
      if (!session) {
        console.warn('세션이 존재하지 않습니다. 클라이언트 세션 제거만 수행합니다.');
      }

      // 세션이 존재하는 경우에만 백엔드 로그아웃 시도
      if(session?.accessToken) {
        const serverResult = await logoutFromServer(session.accessToken);

        // 백엔드 실패해도 클라이언트 세션은 제거
        if (!serverResult.success) {
          console.warn('백엔드 로그아웃 실패:', serverResult.error);
        }
      }
      // 2. NextAuth 세션 제거 및 로그인 페이지로 리다이렉트
      await signOut({ 
        callbackUrl: '/login',
        redirect: true 
      });

      return { success: true };
    } catch (error) {
      console.error('로그아웃 오류:', error);
      
      // 에러가 발생해도 강제로 세션 제거
      try {
        await signOut({ 
          callbackUrl: '/login',
          redirect: true 
        });
      } catch (signOutError) {
        console.error('강제 로그아웃 실패:', signOutError);
        // 마지막 수단으로 페이지 리다이렉트
        router.push('/login');
      }
      
      return { success: false, error: '로그아웃 처리 중 오류가 발생했습니다.' };
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { logout, isLoggingOut };
}