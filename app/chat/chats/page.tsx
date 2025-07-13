'use client'; // This directive marks the component as a Client Component in Next.js App Router

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { fetchChatRoomsFromServer } from '@/app/lib/chat.action'; // Import the function to fetch chat rooms
import { createPrivateChatRoom} from '@/app/lib/chat.action'; // Import the function to create a private chat room
import { ChatRoomResponseDto } from '@/app/types/chat.type'; // Import the ChatRoomResponseDto type
import { ChatRoomList } from '@/app/ui/room/chatRoomListComponent'; // Import the ChatRoomList component
import { ChatRoomDetail } from '@/app/ui/room/chatRoomDetail'; // Import the ChatRoomDetail component
import { NewChatModal } from '@/app/ui/room/newPersonalChatModal'; // Import the NewChatModal component

// Chat List Page Component
const App = () => {
  // State to control New Chat modal visibility
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  // State to control Chat Room Search modal visibility
  const [isChatSearchModalOpen, setIsChatSearchModalOpen] = useState(false);
  // State to store the chat room search query
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  // State to store the selected chat room for detail view
  const [selectedChatRoom, setSelectedChatRoom] = useState<{ id: number; name: string } | null>(null);

  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [chatRooms, setChatRooms] = useState<ChatRoomResponseDto[]>([]); // State to hold chat rooms
  const { data: session, status } = useSession();


  // Handler for creating a new chat (for demonstration)
  const handleCreateNewChat = async (friendId: number) => {
    if (friendId === -1) {
      alert('참가자를 선택해주세요.');
      return;
    }

    // 채팅방 생성
    const response = await createPrivateChatRoom(session?.accessToken || '', friendId);

    if (response.success) {
      // 채팅방 목록을 새로고침
      await fetchChatRooms();
    } else {
      alert(`채팅방 생성에 실패했습니다: ${response.error}`);
    }

    setIsNewChatModalOpen(false);
  };

  // Handler for searching chat rooms (for demonstration)
  const handleSearchChatRooms = () => {
    if (chatSearchQuery.trim() === '') {
      alert('검색어를 입력해주세요.');
      return;
    }
    alert(`채팅방 검색: "${chatSearchQuery}"`);
    setChatSearchQuery('');
    setIsChatSearchModalOpen(false);
  };

  const fetchChatRooms = async () => {
    // This function would typically fetch chat rooms from the server
    setLoading(true);
    setError(null);
    if(session?.accessToken) {
      try {
        const response = await fetchChatRoomsFromServer(session.accessToken);
        if (response.success) {
          setChatRooms(response.data || []);
          setLoading(false);
          setError(null);
        } else {
          console.error('채팅방 목록을 불러오는 데 실패했습니다:', response.error);
        }
      } catch (error) {
        console.error('채팅방 목록을 불러오는 중 오류 발생:', error);
      }
    }
  }

  const handleChatRoomClick = (chatRoom: ChatRoomResponseDto) => {
    // 채팅방 클릭 시 해당 채팅방으로 이동
    setSelectedChatRoom({ id: chatRoom.id, name: chatRoom.name });
    window.history.pushState({ chatRoomId: chatRoom.id }, '', ''); // 히스토리 추가
  };

  // 채팅방 상세 보기를 닫는 함수
  const handleCloseChatRoom = () => {
    setSelectedChatRoom(null);
    window.history.pushState(null, '', ''); // 히스토리 상태 초기화
  };

  // 
  useEffect(() => {
    fetchChatRooms();

    const handlePopState = (event: PopStateEvent) => {
      // 브라우저의 뒤로 가기 버튼을 눌렀을 때 실행
      if (!event.state || !event.state.chatRoomId) {
        setSelectedChatRoom(null); // 채팅방 목록으로 돌아가기
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    // Main container for the chat list content
    <div className="p-6">
      {selectedChatRoom ? (
        // 채팅방 상세 보기
        <ChatRoomDetail
          selectedChatRoom={selectedChatRoom}
          onClose={handleCloseChatRoom} // Close detail view
        />
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">채팅방 목록</h2>

      {/* Buttons for New Chat and Chat Room Search */}
      <div className="mb-6 flex space-x-3">
        <button
          onClick={() => setIsNewChatModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          새로운 채팅
        </button>

        {/* Chat Room Search Button */}
        <button
          onClick={() => setIsChatSearchModalOpen(true)}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          채팅방 검색
        </button>
      </div>

      {/* 채팅방 목록 */}
      <ChatRoomList 
        chatRooms={chatRooms}
        onChatRoomClick={handleChatRoomClick}
        loading={loading}
        error={error}
      />

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onCreateChat={handleCreateNewChat}
      />

      {/* Chat Room Search Modal */}
      {isChatSearchModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
            <h3 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-3">채팅방 검색</h3>
            <button
              onClick={() => setIsChatSearchModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-light leading-none"
            >
              &times;
            </button>

            <div className="flex flex-col space-y-4">
              <div>
                <label htmlFor="chatSearchQuery" className="block text-sm font-medium text-gray-700 mb-1">
                  검색어
                </label>
                <input
                  type="text"
                  id="chatSearchQuery"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                  placeholder="채팅방 이름 또는 참가자 검색"
                  value={chatSearchQuery}
                  onChange={(e) => setChatSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchChatRooms();
                    }
                  }}
                />
              </div>
              <button
                onClick={handleSearchChatRooms}
                className="w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 ease-in-out"
              >
                검색
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default App;
