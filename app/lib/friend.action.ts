import { Friend } from '@/app/types/friend';

export async function fetchFriendsFromServer(token: string): Promise<Friend[]> {
  // 토큰이 없으면 빈 배열 반환
  if(!token) {
    console.error("토큰이 없습니다. 친구 목록을 불러올 수 없습니다.");
    return [];
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/v1/friends`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':  `${token}`, // 토큰을 Authorization 헤더에 포함
      },
      credentials: 'include', // 쿠키를 포함하여 요청
    });

    if (!response.ok) {
      throw new Error('친구 목록을 불러오는 데 실패했습니다.');
    }

    const data = await response.json();

    return data.data as Friend[];
  } catch (error) {
    console.error('친구 목록 로드 오류:', error);
    return [];
  }
}