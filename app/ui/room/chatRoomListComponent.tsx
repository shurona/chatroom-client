'use client';

import React from 'react';
import { ChatRoomResponseDto, ChatRoomType } from '@/app/types/chat.type';
import { formatLastMessageTime } from '@/app/lib/utils/date.utils';
import Skeleton from '@/app/chat/chats/(overview)/loading';

interface ChatRoomListProps {
  chatRooms: ChatRoomResponseDto[];
  onChatRoomClick: (chatRoom: ChatRoomResponseDto) => void;
  loading?: boolean;
  error?: string | null;
}

export function ChatRoomList({ chatRooms, onChatRoomClick, loading, error }: ChatRoomListProps) {
  // 로딩 상태
  if (loading) {
    return <Skeleton />;
  }

  // 에러 상태
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">⚠️ 채팅방 목록을 불러오는데 실패했습니다</div>
        <p className="text-sm text-gray-600">{error}</p>
      </div>
    );
  }

  // 빈 목록
  if (chatRooms.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-4xl mb-3">💬</div>
        <p className="text-gray-600 text-lg">아직 채팅방이 없습니다</p>
        <p className="text-sm text-gray-500 mt-1">새로운 채팅을 시작해보세요!</p>
      </div>
    );
  }

  // 채팅방 정렬 (읽지 않은 메시지가 있는 채팅방 우선, 그 다음 최신 메시지 순)
  const sortedChatRooms = [...chatRooms].sort((a, b) => {
    // 읽지 않은 메시지가 있는 채팅방을 우선 정렬
    if (a.unreadCt > 0 && b.unreadCt === 0) return -1;
    if (a.unreadCt === 0 && b.unreadCt > 0) return 1;
    
    // 읽지 않은 메시지 수가 같다면 최신 메시지 순으로 정렬
    if (!a.lastTime && !b.lastTime) return 0;
    if (!a.lastTime) return 1;
    if (!b.lastTime) return -1;
    return new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime();
  });

  return (
    <div className="space-y-3">
      {sortedChatRooms.map((chatRoom) => (
        <ChatRoomItem
          key={chatRoom.id}
          chatRoom={chatRoom}
          onClick={() => onChatRoomClick(chatRoom)}
        />
      ))}
    </div>
  );
}

// 개별 채팅방 아이템 컴포넌트
interface ChatRoomItemProps {
  chatRoom: ChatRoomResponseDto;
  onClick: () => void;
}

function ChatRoomItem({ chatRoom, onClick }: ChatRoomItemProps) {
  // roomType으로 그룹/개인 채팅 구분
  const isGroupChat = chatRoom.roomType === 'GROUP';
  const hasUnreadMessages = chatRoom.unreadCt > 0;
  
  return (
    <div 
      onClick={onClick}
      className={`flex items-center p-3 rounded-lg shadow-sm cursor-pointer transition-colors duration-200 border ${
        hasUnreadMessages 
          ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
      }`}
    >
      {/* 채팅방 아바타 */}
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-3 flex-shrink-0 relative">
        {isGroupChat ? (
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            hasUnreadMessages ? 'bg-blue-600' : 'bg-blue-500'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        ) : (
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            hasUnreadMessages ? 'bg-green-600' : 'bg-green-500'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
      </div>

      {/* 채팅방 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <p className={`text-md font-semibold truncate ${
              hasUnreadMessages ? 'text-gray-900' : 'text-gray-800'
            }`}>
              {chatRoom.name || '이름 없는 채팅방'}
            </p>
            {/* 채팅방 타입 표시 */}
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full font-medium ${
              isGroupChat 
                ? hasUnreadMessages 
                  ? 'bg-blue-200 text-blue-700' 
                  : 'bg-blue-100 text-blue-600'
                : hasUnreadMessages 
                  ? 'bg-green-200 text-green-700' 
                  : 'bg-green-100 text-green-600'
            }`}>
              {isGroupChat ? '그룹' : '개인'}
            </span>
          </div>
          
          {/* 시간과 읽지 않은 메시지 수 */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 flex-shrink-0">
              {chatRoom.lastTime ? formatLastMessageTime(chatRoom.lastTime) : ''}
            </span>
            
            {/* 읽지 않은 메시지 수 뱃지 */}
            {hasUnreadMessages && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium flex-shrink-0 min-w-[20px] text-center">
                {chatRoom.unreadCt > 99 ? '99+' : chatRoom.unreadCt}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className={`text-sm truncate flex-1 ${
            hasUnreadMessages ? 'text-gray-700 font-medium' : 'text-gray-500'
          }`}>
            {chatRoom.lastMessage || '메시지가 없습니다'}
          </p>
        </div>

        {/* 멤버 수 정보 */}
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-400">
            {isGroupChat ? `참가자 ${chatRoom.memberCt}명` : `1:1 채팅`}
          </p>
          
          {/* 생성일 정보 */}
          <span className="text-xs text-gray-400">
            생성: {formatLastMessageTime(chatRoom.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
