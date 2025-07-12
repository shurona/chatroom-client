'use client';

import React, { useRef, useState } from 'react';

interface Message {
  id: number;
  sender: string;
  text: string;
  type: 'sent' | 'received';
  time: string;
}

interface ChatRoomDetailProps {
  selectedChatRoom: { id: number; name: string } | null;
  onClose: () => void;
}

export const ChatRoomDetail = ({ selectedChatRoom, onClose } : ChatRoomDetailProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'You', text: '안녕하세요! 채팅방에 오신 것을 환영합니다.', type: 'sent', time: '10:00 AM' },
    { id: 2, sender: 'Partner', text: '안녕하세요! 반갑습니다.', type: 'received', time: '10:01 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg: Message = {
      id: messages.length + 1,
      sender: 'You',
      text: newMessage,
      type: 'sent',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleChatInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!selectedChatRoom) return null;

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
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-lg">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex flex-col max-w-[80%] p-3 rounded-lg shadow-sm ${
                msg.type === 'sent'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.type === 'received' && (
                <span className="text-xs font-semibold text-gray-600 mb-1">{msg.sender}</span>
              )}
              <p className="text-sm break-words">{msg.text}</p>
              <span
                className={`mt-1 text-[0.65rem] ${
                  msg.type === 'sent' ? 'text-blue-100' : 'text-gray-500'
                } self-end`}
              >
                {msg.time}
              </span>
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
          className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleChatInputKeyPress}
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