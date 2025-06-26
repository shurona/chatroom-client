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
    // Main container for the layout, spanning full screen height.
    // Uses flexbox to arrange items. On medium screens and up, it becomes a row
    // and hides overflow to manage scrolling within content areas.
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-gray-100 font-inter">
      {/* Left Sidebar / Navigation Area */}
      {/* Takes full width on small screens, fixed width (w-64) on medium screens and up */}
      {/* flex-none prevents it from shrinking */}
      <div className="w-full flex-none md:w-64">
        {/* The SideNav component will be rendered here, containing navigation links */}
        <SideNav />
      </div>

      {/* Main Content Area */}
      {/* flex-grow allows it to take up available space.
          p-6 adds padding.
          md:overflow-y-auto enables vertical scrolling for content on medium screens and up.
          md:p-12 increases padding on medium screens and up.
          bg-white and rounded-l-xl for visual styling. */}
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12 bg-white rounded-l-xl shadow-lg m-4">
        {/* The children prop will render the actual page content (e.g., chat list, friends list) */}
        {children}
      </div>
    </div>
  );
}