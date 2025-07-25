'use client';

import { fetchChatLogsFromServer, sendMessageToServer } from '@/app/lib/chat.action';
import { ChatUnReadUserResponseDto, ChatLogResponseDto, ReadNotificationDto } from '@/app/types/chat.type';
import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/app/lib/hooks/useChatSocket';
import { getTokenUser } from '@/app/lib/jwt.utils';
import { send } from 'process';

interface ChatRoomDetailProps {
  selectedChatRoom: { id: number; name: string } | null;
  onClose: () => void;
}

export const ChatRoomDetail = ({ selectedChatRoom, onClose } : ChatRoomDetailProps) => {
  const [messages, setMessages] = useState<ChatLogResponseDto[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesRef = useRef<ChatLogResponseDto[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const { data: session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null); // 메시지 스크롤을 위한 참조
  const { sendMessage, subscribe, unsubscribe, isConnected } = useSocket();

  // If no chat room is selected, return null to avoid rendering
  if (!selectedChatRoom) return null;

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // 메시지 전송 함수
  useEffect(() => {
    if(selectedChatRoom && isConnected && userId !== null) {
      const room = selectedChatRoom.id;
      const replyDest = `/topic/room/${room}/read/user/${userId}`;
      // 채팅방이 선택되었고 소켓이 연결된 경우, 해당 채팅방의 메시지를 구독
      subscribe(`/topic/room/${room}`, (message: ChatLogResponseDto) => {
        // 신규 메시지가 있을 때만 update
        const prev = messagesRef.current;                     // 최신 상태 참조
        const updated = [...prev, message];                   // 메시지 추가
        messagesRef.current = updated;                        // ref에도 저장
        setMessages(updated);                                 // 상태 업데이트 및 렌더링

        const messageIds = updated
          .map(msg => msg.id)
          .filter(id => id !== undefined);

        // 메시지 ID가 있는 경우에만 읽음 상태를 전송
        if (messageIds.length > 0) {
          console.log('sendMessage 호출됨:', messageIds);
          sendMessage(`/app/room/${room}/read`, { messageIds }, replyDest);
        }
        // 메시지 스크롤을 가장 아래로 이동
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });

      // 다른 사람이 읽음 상태를 업데이트하기 위한 구독
      subscribe(`/topic/room/${room}/read-notifications`, (notification: ReadNotificationDto) => {
        const messageIds =  messagesRef.current.map(msg => msg.id);
        if(messageIds.length === 0) return; 

        sendMessage(`/app/room/${room}/read`, { messageIds }, replyDest);
        console.log('읽음 상태 업데이트:', notification);
      })

      // 채팅 별 안 읽은 유저 수 업데이트를 위한 구독
      subscribe(replyDest, (message: ChatUnReadUserResponseDto) => {
        console.log('읽음 응답 도착:', message);
        
        const logIdWithUnread = message.readStatusMap;

        // messages 상태 업데이트
        setMessages((prevMessages) => {
          return prevMessages.map(msg => {
            msg.unreadCount = logIdWithUnread[msg.id]; // 읽음 상태 업데이트
            return msg;
          });
        });
      });

      // 컴포넌트 언마운트 시 구독 해제
      return () => {
        unsubscribe(`/topic/room/${room}`); // 채팅방 메시지 구독 해제
        unsubscribe(`/topic/room/${room}/read-notifications`); // 읽음 상태 구독 해제
        unsubscribe(replyDest); // 안 읽은 유저 수 구독 해제
      };
    } 
  }, [selectedChatRoom, isConnected, userId]);


  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    console.log('메시지를 전송합니다: ' + newMessage); // 메시지 전송 로직을 여기에 추가해야 합니다.

    if(selectedChatRoom === null || session == null) {
      console.error('채팅방이나 사용자 ID가 설정되지 않았습니다.');
      return;
    }

    // 메시지를 저장한다.
    sendMessageToServer(session.accessToken || '', selectedChatRoom?.id, newMessage);
    setNewMessage('');

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatLogs = async (chatRoomId: number) => {
    const response = await fetchChatLogsFromServer(session?.accessToken || '', chatRoomId);
    try {
      if (response.success) {
        setMessages(response.data?.content || []);
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.error('Failed to fetch chat logs:', response.error);
      }
    } catch (error) {
      console.error('Error fetching chat logs:', error);
    }
  };

  const handleChatInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return; // IME 입력 중에는 처리하지 않음

    if (e.key === 'Enter') {
      e.preventDefault(); // 기본 Enter 키 동작 방지
      e.stopPropagation(); // 이벤트 전파 방지
      handleSendMessage();
    }
  };

  // Fetch chat logs when the selected chat room changes
  useEffect(() => {
    if (selectedChatRoom) {      
      fetchChatLogs(selectedChatRoom.id);
    }
  }, [selectedChatRoom]);

  // session 정보가 변경될 때마다 userId를 업데이트
  useEffect(() => {
    if (session?.accessToken) {
      const userId = getTokenUser(session.accessToken); // 토큰에서 userId 추출
      setUserId(userId ? parseInt(userId, 10) : null); // Set the userId from the token
    }
  }, [session]);

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center p-4 bg-indigo-600 text-white shadow-md rounded-t-xl mb-4">
        <button
          onClick={onClose}
          className="mr-3 text-white hover:text-indigo-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold flex-1">{selectedChatRoom.name}</h2>
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span className="ml-2">온라인</span>
      </div>

      {/* Message List Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-lg min-h-[400px]">
        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`flex ${msg.writerId === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex flex-col items-end"> {/* 메시지와 읽음 상태를 함께 묶기 */}
              <div
                className={`flex flex-col max-w-[80%] p-3 rounded-lg shadow-sm ${
                  msg.writerId === userId
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {msg.writerId !== userId && (
                  <span className="text-xs font-semibold text-gray-600 mb-1">{msg.writeUserNickName}</span>
                )}
                <p className="text-sm break-words">{msg.content}</p>
                
                {/* 시간과 읽음 상태 */}
                <div className="flex items-center justify-between mt-1">
                  <span
                    className={`text-[0.65rem] ${
                      msg.writerId === userId ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {msg.wroteTime}
                  </span>
                  {/* 내가 보낸 메시지에만 읽지 않은 사용자 수 표시 */}
                  {msg.writerId === userId && msg.unreadCount !== undefined && msg.unreadCount > 0 && (
                    <span className="text-[0.6rem] text-blue-100 ml-2">
                      {msg.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="flex p-4 border-t border-gray-200 bg-white rounded-b-xl mt-4">
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleChatInputKeyPress}
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-6 py-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};