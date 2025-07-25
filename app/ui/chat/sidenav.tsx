'use client'; // This directive marks the component as a Client Component in Next.js App Router

import React, { useState, useEffect } from 'react';
import {LogoutButton} from '@/app/ui/logoutButton'; // Importing the LogOutButton component
import { useSession } from 'next-auth/react';
import { findUserById } from '@/app/lib/user.action';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/app/lib/hooks/useChatSocket';

// 네비게이션 링크 타입 정의
interface NavLink {
  name: string;
  section: string;
  icon: React.ReactNode;
}

const SideNav = () => {
  const { isConnected } = useSocket();
  const router = useRouter();

  // 링크 배열 정의 (아이콘 포함)
  const links: NavLink[] = [
    {
      name: '친구 목록',
      section: '/chat/friends',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      name: '채팅방 목록',
      section: '/chat/chats',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z" />
        </svg>
      )
    },
    {
      name: '설정',
      section: '/chat/settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.223 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  const [activeSection, setActiveSection] = useState('/chat/friends'); // Default active section

  const { data: session } = useSession();
  const [nickName, setNickName] = useState<string>('게스트');

  // 네비게이션 핸들러
    const handleNavigation = (section: string) => {
      setActiveSection(section);
      router.push(section);
    };

  // 현재 활성 섹션 감지 (URL 기반)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const currentLink = links.find(link => currentPath.startsWith(link.section));
      if (currentLink) {
        setActiveSection(currentLink.section);
      }
    }
  }, []);

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
        {links.map((link) => (
          <li key={link.section}>
            <button
              onClick={() => handleNavigation(link.section)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors duration-200 ${
                activeSection === link.section 
                  ? 'bg-indigo-700 text-white shadow-md' 
                  : 'hover:bg-indigo-700'
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* User Info / Logout Button at the bottom of the sidebar */}
      <div className="mt-auto pt-6 border-t border-indigo-700 text-center">
         {/* 소켓 연결 상태 표시 */}
        <div className="mb-4">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isConnected ? '🟢 온라인' : '🔴 오프라인'}
          </span>
        </div>
        <p className="text-sm text-indigo-200">사용자: {nickName || '게스트'}</p>
          <LogoutButton />
      </div>
    </nav>
  );
};

export default SideNav;
