'use client';

import React from 'react';
import { FriendRequestDto } from '@/app/types/friend.type';

interface FriendRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  friendRequests: FriendRequestDto[];
  onAcceptRequest: (id: number) => void;
  onDeclineRequest: (id: number) => void;
  loading?: boolean;
}

export function FriendRequestModal({
  isOpen,
  onClose,
  friendRequests,
  onAcceptRequest,
  onDeclineRequest,
  loading = false
}: FriendRequestModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 방지
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <h3 className="text-2xl font-bold text-gray-800">친구 요청</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-light leading-none transition-colors"
            aria-label="모달 닫기"
          >
            &times;
          </button>
        </div>

        {/* 컨텐츠 (스크롤 가능) */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">로딩 중...</p>
              </div>
            </div>
          ) : friendRequests.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="text-gray-400 text-4xl mb-3">📬</div>
                <p className="text-gray-600 text-lg font-medium">친구 요청이 없습니다</p>
                <p className="text-gray-500 text-sm mt-2">새로운 친구 요청이 오면 여기에 표시됩니다</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {friendRequests.map((request) => (
                  <FriendRequestItem
                    key={String(request.friendId)}
                    request={request}
                    onAccept={onAcceptRequest}
                    onDecline={onDeclineRequest}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 닫기 버튼 */}
          <div className="p-6 border-t flex-shrink-0">
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}

// 개별 친구 요청 아이템 컴포넌트
interface FriendRequestItemProps {
  request: FriendRequestDto;
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
}

function FriendRequestItem({ request, onAccept, onDecline }: FriendRequestItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-200 hover:bg-blue-100 transition-colors">
      {/* 사용자 정보 */}
      <div className="flex items-center flex-1 min-w-0">
        <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-semibold mr-4 flex-shrink-0">
          {request.nickName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold text-gray-800 truncate">
            {request.nickName}
          </p>
          <p className="text-sm text-gray-600 truncate">
            {request.description}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {request.requestAt}
          </p>
          {/* 온라인 상태 표시 */}
          <div className="flex items-center mt-1">
            <div className={`w-2 h-2 rounded-full mr-1 ${request.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className={`text-xs ${request.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
              {request.isOnline ? '온라인' : '오프라인'}
            </span>
          </div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex space-x-2 ml-4">
        <button
          onClick={() => onAccept(request.friendId)}
          className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          수락
        </button>
        <button
          onClick={() => onDecline(request.friendId)}
          className="px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          거절
        </button>
      </div>
    </div>
  );
}