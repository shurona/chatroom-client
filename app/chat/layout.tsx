'use client'

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SideNav from '@/app/ui/chat/sidenav';


// Define the main App component that acts as the Layout
// This component wraps around other page content passed as 'children'
export default function App ({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  
  // 인증 상태 확인
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
  // 로딩 중인 경우 로딩 표시
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-gray-100 font-inter">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12 bg-white rounded-l-xl shadow-lg m-4">        
        {children}
      </div>
    </div>
  );
}