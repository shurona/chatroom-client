'use client'; // This directive marks the component as a Client Component in Next.js App Router

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Friend, FriendRequestDto } from '@/app/types/friend.type';
import { UserSearchResult } from '@/app/types/user.type';

import { FriendsList } from '@/app/ui/friend/friendList';
import { FriendRequestModal } from '@/app/ui/friend/requestModal';
import { AddFriendModal } from '@/app/ui/friend/addFriendModal';

import { findUserByNickname } from '@/app/lib/user.action';
import { fetchFriendsFromServer, fetchFriendRequestsFromServer, sendFriendRequest, acceptFriendRequest, refuseFriendRequest } from '@/app/lib/friend.action';

// Friends List Page Component
export default function Page() {
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false); // Add Friend modal
  const [friendSearchId, setFriendSearchId] = useState('');

  const [friendRequests, setFriendRequests] = useState<FriendRequestDto[]>([]); // 친구 요청 목록 상태

  const { data: session, status } = useSession();

  const loadFriends = async () => {
    try {
      setLoading(true);

      // 세션이 없거나 accessToken이 없으면 로그인 페이지로 리다이렉트
      if(!session || !session.accessToken) {
        setError('로그인이 필요합니다.');
        setLoading(false);
        router.push("login?callbackUrl=/chat/friends");
        return;
      }

      const response = await fetchFriendsFromServer(session.accessToken);
      setFriends(response.data || []);

      setError(null);
      setLoading(false);

    } catch (err) {
      setError('친구 목록을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

   // 친구 요청 목록 로드
  const loadFriendRequests = async () => {
    if (!session?.accessToken) return;

    try {
      setError(null);
      
      const requests = await fetchFriendRequestsFromServer(session.accessToken);
      setFriendRequests(requests.data || []);
    } catch (err) {
      setError('친구 요청을 불러오는데 실패했습니다.');
      console.error('친구 요청 로드 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  // 친구 검색 핸들러 (다중 결과 반환)
const handleSearchFriend = async (searchId: string): Promise<UserSearchResult[]> => {
  try {
    if (!session?.accessToken) {
      throw new Error('인증이 필요합니다.');
    }

    // 10개만 검색하도록 0으로 페이지 설정
    const response = await findUserByNickname(session.accessToken, searchId, 0);

    return response.data || [];
    
  } catch (error) {
    console.error('친구 검색 오류:', error);
    return [];
  }
};

  // 친구 요청 전송 핸들러
  const handleSendFriendRequest = async (userId: string) => {
    try {
      if (!session?.accessToken) {
        return { success: false, error: '인증이 필요합니다.' };
      }
      const response = await sendFriendRequest(userId, session.accessToken);

      return { success: true };
    } catch (error) {
      console.error('친구 요청 전송 오류:', error);
      return { success: false, error: '친구 요청 전송에 실패했습니다.' };
    }
  };


  useEffect(() => {
    loadFriends();
    loadFriendRequests();
  }, []);


  const handleFriendClick = (friend: Friend) => {
    // 여기서 채팅 페이지로 이동하거나 다른 액션 수행
    // router.push(`/chat/messages/${friend.id}`);
  };

  // 친구 요청 수락
  const handleAcceptRequest = (id: Number) => {
    try {
      if (!session?.accessToken) {
        return { success: false, error: '인증이 필요합니다.' };
      }
      
      console.log('친구 요청 수락:', id);
      acceptFriendRequest(id, session.accessToken);
      setFriendRequests(prevRequests => prevRequests.filter(req => req.friendId !== id));

      // 친구 요청 수락 후 친구 목록 갱신
      loadFriends();
    } catch (error) {
        console.error('친구 요청 수락 오류:', error);
        alert('친구 요청 수락에 실패했습니다.');
      }
  };

  // 친구 요청 거절
  const handleDeclineRequest = (id: Number) => {
    alert(`친구 요청 ${id}번을 거절했습니다.`);
    if (!session?.accessToken) {
      return { success: false, error: '인증이 필요합니다.' };
    }
    // 친구 요청 거절 API 호출
    refuseFriendRequest(id, session.accessToken);

    setFriendRequests(prevRequests => prevRequests.filter(req => req.friendId !== id));
  };


  return (
    <div>
      {/* 헤더 */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">친구 목록</h2>
          <p className="text-gray-600">
            {loading ? '로딩 중...' : `총 ${friends.length}명의 친구`}
          </p>
        </div>
       {/* Friend Request Tab/Button and New Friend Add Button */}
      <div className="mb-6 flex space-x-3"> {/* Added flex and space-x-3 for layout */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-100 text-blue-800 font-semibold rounded-lg shadow-md hover:bg-blue-200 transition-colors duration-200"
        >
          친구 요청
          {friendRequests.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
              {friendRequests.length}
            </span>
          )}
        </button>

        {/* New: Add Friend Button */}
        <button
          onClick={() => setIsAddFriendModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 font-semibold rounded-lg shadow-md hover:bg-indigo-200 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          친구 추가
        </button>
      </div>

      <div className="p-6 max-w-4xl mx-auto">

        {/* 친구 목록 */}
        <FriendsList
          friends={friends}
          onFriendClick={handleFriendClick}
          loading={loading}
          error={error}
        />

        {/* 새로고침 버튼 */}
        {!loading && (
          <div className="mt-6 text-center">
            <button
              onClick={loadFriends}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              새로고침
            </button>
          </div>
        )}
      </div>
      {/* Friend Requests Modal */}
      <FriendRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        friendRequests={friendRequests}
        onAcceptRequest={handleAcceptRequest}
        onDeclineRequest={handleDeclineRequest}
        loading={false}
      />

      {/* New: Add Friend Search Modal */}
      <AddFriendModal
        isOpen={isAddFriendModalOpen}
        onClose={() => setIsAddFriendModalOpen(false)}
        onSearchFriend={handleSearchFriend}
        onSendFriendRequest={handleSendFriendRequest}
        loading={false}
      />
    </div>
  );
};
