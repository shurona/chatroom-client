'use client';

import React from 'react';
import { Friend } from '@/app/types/friend.type';
import { FriendItem } from '@/app/ui/friend/friendItem';

interface FriendsListProps {
  friends: Friend[];
  onFriendClick?: (friend: Friend) => void;
  loading?: boolean;
  error?: string | null;
}

export function FriendsList({ friends, onFriendClick, loading, error }: FriendsListProps) {
  // 로딩 상태
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm border animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">⚠️ 친구 목록을 불러오는데 실패했습니다</div>
        <p className="text-sm text-gray-600">{error}</p>
      </div>
    );
  }

  // 빈 목록
  if (friends.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-lg mb-2">👥</div>
        <p className="text-gray-600">아직 친구가 없습니다</p>
        <p className="text-sm text-gray-500 mt-1">새로운 친구를 추가해보세요!</p>
      </div>
    );
  }

  // 온라인/오프라인으로 정렬
  const sortedFriends = friends.sort((a, b) => {
    if (a.isOnline === b.isOnline) {
      return a.nickName.localeCompare(b.nickName);
    }
    return a.isOnline ? -1 : 1;
  });

  // 친구 그룹핑
  const onlineFriends = sortedFriends.filter(friend => friend.isOnline);
  const offlineFriends = sortedFriends.filter(friend => !friend.isOnline);

  return (
    <div className="space-y-4">
      {/* 온라인 친구들 */}
      {onlineFriends.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            온라인 ({onlineFriends.length})
          </h3>
          <div className="space-y-2">
            {onlineFriends.map((friend) => (
              <FriendItem 
                key={String(friend.id)} 
                friend={friend} 
                onClick={onFriendClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* 오프라인 친구들 */}
      {offlineFriends.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
            <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
            오프라인 ({offlineFriends.length})
          </h3>
          <div className="space-y-2">
            {offlineFriends.map((friend) => (
              <FriendItem 
                key={String(friend.id)} 
                friend={friend} 
                onClick={onFriendClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}