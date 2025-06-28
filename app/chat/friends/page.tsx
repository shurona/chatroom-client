'use client'; // This directive marks the component as a Client Component in Next.js App Router

import React, { useEffect, useState } from 'react';
import { Friend } from '@/app/types/friend';
import { useRouter } from 'next/navigation';
import { FriendsList } from '@/app/ui/friend/friendList';
import { fetchFriendsFromServer } from '@/app/lib/friend.action';
import { useSession } from 'next-auth/react';


// Friends List Page Component
export default function Page() {
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setFriends(response);

      setError(null);
      setLoading(false);

    } catch (err) {
      setError('친구 목록을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  useEffect(() => {
  // c onsole.log('친구 페이지 마운트됨, 친구 목록 로드 시작');
    loadFriends();
  }, []);


  const handleFriendClick = (friend: Friend) => {
    // 여기서 채팅 페이지로 이동하거나 다른 액션 수행
    // router.push(`/chat/messages/${friend.id}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">친구 목록</h2>
        <p className="text-gray-600">
          {loading ? '로딩 중...' : `총 ${friends.length}명의 친구`}
        </p>
      </div>

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
  );
};
