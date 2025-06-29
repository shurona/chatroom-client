'use client';

import React from 'react';
import { UserSearchResult } from '@/app/types/user.type';

interface SearchResultProps {
  searchResult: UserSearchResult;
  onSendFriendRequest: (userId: string) => void;
  requestLoading?: boolean;
  index?: number;
}

export function SearchResult({ 
  searchResult, 
  onSendFriendRequest, 
  requestLoading = false,
  index = 0
}: SearchResultProps) {
  console.log('SearchResult Component Rendered:', searchResult.requested);
  const renderActionButton = () => {
    if (searchResult.requested === 'ACCEPTED') {
      return (
        <div className="text-center py-2 px-4 bg-green-50 text-green-600 font-medium rounded-lg border border-green-200 flex items-center justify-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          이미 친구입니다
        </div>
      );
    }

    if (searchResult.requested === 'REQUESTED') {
      return (
        <div className="text-center py-2 px-4 bg-orange-50 text-orange-600 font-medium rounded-lg border border-orange-200 flex items-center justify-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          이미 친구 요청을 보냈습니다
        </div>
      );
    }

    return (
      <button
        onClick={() => onSendFriendRequest(searchResult.userId)}
        disabled={requestLoading}
        className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-[1.02]"
      >
        {requestLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            전송 중...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            친구 요청 보내기
          </div>
        )}
      </button>
    );
  };

  return (
    <div 
      className="p-4 bg-white rounded-lg border hover:shadow-md transition-all duration-200 transform hover:scale-[1.01]"
      style={{ 
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.3s ease-out forwards'
      }}
    >
      {/* 사용자 정보 */}
      <div className="flex items-center space-x-3 mb-3">
        <UserAvatar 
          nickName={searchResult.nickName} 
        />
        <UserInfo 
          nickName={searchResult.nickName}
          description={searchResult.description}
          isOnline={searchResult.isOnline}
        />
      </div>
      
      {/* 액션 버튼 */}
      {renderActionButton()}
    </div>
  );
}

// 사용자 아바타 컴포넌트
interface UserAvatarProps {
  nickName: string;
  size?: 'sm' | 'md' | 'lg';
}

function UserAvatar({ nickName, size = 'md' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg'
  };

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-lg`}>
        {nickName.charAt(0).toUpperCase()}
      </div>
    </div>
  );
}

// 사용자 정보 컴포넌트
interface UserInfoProps {
  nickName: string;
  description: string;
  isOnline: boolean;
}

function UserInfo({ nickName, description, isOnline }: UserInfoProps) {
  return (
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-gray-800 truncate text-lg">{nickName}</p>
      <p className="text-sm text-gray-600 truncate mb-1">{description}</p>
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        <span className={`text-xs font-medium ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
          {isOnline ? '온라인' : '오프라인'}
        </span>
      </div>
    </div>
  );
}