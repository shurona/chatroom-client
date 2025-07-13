'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { fetchFriendsFromServer } from '@/app/lib/friend.action'; 
import { Friend } from '@/app/types/friend.type'; 

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (participantId: number) => void;
}

export const NewChatModal = ({ isOpen, onClose, onCreateChat }: NewChatModalProps) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriendId, setSelectedFriendId] = useState<number>(-1); // -1 indicates no selection
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    if (isOpen) {
      setSelectedFriendId(-1);
      fetchFriends();
    }
  }, [isOpen]);

  const fetchFriends = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (session?.accessToken) {
        const response = await fetchFriendsFromServer(session.accessToken);
        if (response.success) {
          setFriends(response.data || []);
          setError(null);
        } else {
          setError('친구 목록을 불러오는 데 실패했습니다.');
        }
      }
    } catch (err) {
      setError('친구 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChat = () => {
    if (selectedFriendId === -1) {
      alert('참가자를 선택해주세요.');
      return;
    }
    onCreateChat(selectedFriendId);
    onClose();
  };

  if (!isOpen) return null;

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
        <h3 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-3">새로운 채팅 시작</h3>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-light leading-none"
        >
          &times;
        </button>

        {loading ? (
          <p className="text-center text-gray-500">친구 목록을 불러오는 중...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="flex flex-col space-y-4">
            <div>
              <label htmlFor="friendSelect" className="block text-sm font-medium text-gray-700 mb-1">
                친구 선택
              </label>
              <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg">
                {friends.map((friend) => (
                  <div
                    key={friend.friendUserid}
                    className={`p-3 cursor-pointer flex items-center justify-between ${
                      selectedFriendId === friend.friendUserid ? 'bg-blue-100' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedFriendId(friend.friendUserid)}
                  >
                    <span className="text-gray-700">{friend.nickName}</span>
                    {selectedFriendId === friend.friendUserid && (
                      <span className="text-blue-500 font-semibold">선택됨</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleCreateChat}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out"
            >
              채팅 시작
            </button>
          </div>
        )}
      </div>
    </div>
  );
};