'use client';

import React, { useState } from 'react';
import { signUp } from '@/app/lib/auth.action';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

// Sign-up screen component
const SignUpPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 서버 액션 결과 처리를 위한 클라이언트 래퍼 함수
  async function handleFormAction(formData: FormData) {
    setError(null);
    setIsSubmitting(true);
    
    try {
      const result = await signUp(formData);
      
      if (!result.success) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }

      await signOut({ redirect: false }); // 로그아웃 처리
      
      // 성공 시 로그인 페이지로 이동
      router.push('/login?registered=true');
    } catch (err) {
      setError('회원가입 처리 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  }

  return (
    // Main container for the sign-up screen, centered with a clean background
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-inter">
      {/* Sign-up form container */}
      <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 max-w-md w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
          회원가입
        </h1>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        
        <form action={handleFormAction} className="space-y-6">
          {/* Phone Number Input */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              휴대전화
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              className="w-full px-4 py-3 border text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="010-1234-5678"
              required
            />
          </div>

          {/* Username/ID Input */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              아이디
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-3 border text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="사용할 아이디"
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
              className="w-full px-4 py-3 border text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="비밀번호"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호 확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full px-4 py-3 border text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="비밀번호 다시 입력"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              자기 소개
            </label>
            <input
              type="text"
              id="description"
              name="description"
              className="w-full px-4 py-3 border text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="자기 소개를 입력하세요"
              required
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out disabled:bg-indigo-400"
          >
            {isSubmitting ? '처리 중...' : '회원가입'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;