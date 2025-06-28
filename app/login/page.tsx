'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { login } from '../lib/auth.action';

// Login screen component
const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status } = useSession();

  const callbackUrl = searchParams.get('callbackUrl') || '/chat/friends';

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    const checkSession = async () => {
      if (session?.accessToken) {
        router.push(callbackUrl);
      }
    };
    
    checkSession();
  }, [callbackUrl, router]);

  
  // 서버 액션 결과 처리를 위한 클라이언트 래퍼 함수
  async function handleFormAction(formData: FormData) {
    setError(null);
    setIsSubmitting(true);
    
    try {
      const result = await login(formData);
      
      if (!result.success) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }

      const {accessToken, refreshToken} = result.data;

      // 로그인 성공 시 토큰 저장 (예: 로컬 스토리지)
      const signinResult = await signIn('credentials', {
        redirect: false,
        accessToken,
        refreshToken,
        callbackUrl
      });
      
      // 로그인 결과 처리
      if (signinResult?.error) {
        setError(signinResult.error);
        setIsSubmitting(false);
        return;
      }      
      
      // 세션 확인 후 리다이렉트
      router.push(callbackUrl);
    } catch (err) {
      setError('로그인 처리 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  }

  return (
    // Main container for the login screen, centered with a clean background
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-inter">
      {/* Login form container */}
      <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 max-w-md w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
          로그인
        </h1>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        
        <form action={handleFormAction} className="space-y-6">
          {/* Username/ID Input */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              아이디
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm"
              placeholder="사용자 아이디"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm"
              placeholder="비밀번호"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out disabled:bg-indigo-400"
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;