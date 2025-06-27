'use client';

import React from 'react';
import { Friend } from '@/app/types/friend';

interface FriendItemProps {
  friend: Friend;
  onClick?: (friend: Friend) => void;
}

export function FriendItem({ friend, onClick }: FriendItemProps) {
  // 이름에서 이니셜 생성
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  // 온라인 상태에 따른 색상 결정
  const getAvatarColor = (isOnline: boolean) => {
    return isOnline 
      ? 'bg-green-200 text-green-800' 
      : 'bg-gray-300 text-gray-600';
  };

  // 상태 텍스트 및 색상
  const getStatusInfo = (isOnline: boolean) => {
    return isOnline 
      ? { text: '온라인', color: 'text-green-600' }
      : { text: '오프라인', color: 'text-gray-500' };
  };

  const statusInfo = getStatusInfo(friend.isOnline);

  return (
    <div 
      className={`flex items-center p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 ${
        onClick ? 'cursor-pointer hover:bg-gray-50' : ''
      }`}
      onClick={() => onClick?.(friend)}
    >
      {/* 아바타 */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold mr-4 ${getAvatarColor(friend.isOnline)}`}>
        {getInitials(friend.loginId)}
      </div>

      {/* 친구 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-lg font-semibold text-gray-800 truncate">
            {friend.loginId}
          </p>
          {/* 온라인 상태 인디케이터 */}
          <div className={`w-2 h-2 rounded-full ${friend.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
        </div>
        
        <p className="text-sm text-gray-600 truncate mb-1">
          {friend.description}
        </p>
        
        <p className={`text-xs font-medium ${statusInfo.color}`}>
          {statusInfo.text}
        </p>
      </div>

      {/* 선택적으로 우측 액션 버튼 영역 */}
      {onClick && (
        <div className="ml-2">
          <svg 
            className="w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </div>
      )}
    </div>
  );
}