'use client'; // This directive marks the component as a Client Component in Next.js App Router

import React, { useState, useEffect } from 'react';
import {LogoutButton} from '@/app/ui/logoutButton'; // Importing the LogOutButton component
import { useSession } from 'next-auth/react';
import { findUserById } from '@/app/lib/user.action';

// SideNav Component - Now defined within the same file for self-containment
// In a real Next.js app, this would typically be in its own file (e.g., app/ui/SideNav.tsx)
const SideNav = () => {
  // State to manage the active navigation section within the sidebar
  // In a real Next.js app, this might be driven by the current URL path
  const [activeSection, setActiveSection] = useState('chats'); // Default active section

  const { data: session } = useSession();
  const [nickName, setNickName] = useState<string>('게스트');

  // For demonstration, using alert. In a real app, you'd use router.push()
  const handleNavigation = (section: any) => {
    setActiveSection(section);
    // Example: router.push(`/${section}`);
    alert(`'${section}' 섹션으로 이동합니다.`);
  };

  // 페이지 접근 시 세션에서 findUserById 함수를 호출하여 사용자 정보를 가져옵니다.
  useEffect(() => {
    findUserById(session?.accessToken).then((user) => {
      if (user.success) {
        setNickName(user.data?.nickName || '게스트');
      }
    });
  }, []);

  return (
    // Sidebar container: full height, dark indigo background, padding, shadow, rounded right corners
    <nav className="h-full bg-indigo-800 text-white flex flex-col p-4 shadow-lg rounded-r-xl">
      {/* App Title/Logo */}
      <div className="text-2xl font-bold mb-8 text-center pt-4">ChatApp</div>

      {/* Navigation Links */}
      <ul className="space-y-4 flex-1">
        <li>
          <button
            onClick={() => handleNavigation('friends')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors duration-200 ${
              activeSection === 'friends' ? 'bg-indigo-700 text-white shadow-md' : 'hover:bg-indigo-700'
            }`}
          >
            {/* Friends Icon (Lucide React or inline SVG is good for Next.js) */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h-5v-5a2 2 0 012-2h2a2 2 0 012 2v5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9a2 2 0 012-2h2a2 2 0 012 2v5h-5V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 15a2 2 0 012-2h2a2 2 0 012 2v5H7v-5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 17a2 2 0 012-2h2a2 2 0 012 2v5H4v-5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4a3 3 0 100 6 3 3 0 000-6z" />
            </svg>
            <span>친구 목록</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => handleNavigation('chats')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors duration-200 ${
              activeSection === 'chats' ? 'bg-indigo-700 text-white shadow-md' : 'hover:bg-indigo-700'
            }`}
          >
            {/* Chats Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z" />
            </svg>
            <span>채팅방 목록</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => handleNavigation('settings')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors duration-200 ${
              activeSection === 'settings' ? 'bg-indigo-700 text-white shadow-md' : 'hover:bg-indigo-700'
            }`}
          >
            {/* Settings Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.223 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>설정</span>
          </button>
        </li>
      </ul>

      {/* User Info / Logout Button at the bottom of the sidebar */}
      <div className="mt-auto pt-6 border-t border-indigo-700 text-center">
        <p className="text-sm text-indigo-200">사용자: {nickName || '게스트'}</p>
          <LogoutButton />
      </div>
    </nav>
  );
};

export default SideNav;
