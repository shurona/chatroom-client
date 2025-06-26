'use client';

import Link from 'next/link';
import React from 'react';

// Main App component for the Next.js homepage
export default function App() {
  return (
    // Main container for the homepage, centered with a clean background
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-inter">
      {/* Container for the main content */}
      <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 max-w-md w-full text-center">
        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
          환영합니다!
        </h1>
        {/* Description Text */}
        <p className="text-lg text-gray-600 mb-8">
          다른 사람과 채팅을 시작해보세요.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Login Button */}
          <Link
            href="/login"
            className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out block"
          >
            로그인
          </Link>

          {/* Sign Up Button */}
          <Link
            href="/signup"
            className="w-full px-6 py-3 bg-white text-indigo-600 font-semibold border border-indigo-600 rounded-lg shadow-md hover:bg-indigo-50 hover:border-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out block"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

