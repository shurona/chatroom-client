'use server';

import { FriendRequestDto, Friend } from '@/app/types/friend.type';

/**
 * 서버에서 친구 목록을 가져오는 함수
 */
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

/**
 * 서버에서 친구 요청 목록을 가져오는 함수
 */
export async function fetchFriendRequestsFromServer(token: string): Promise<FriendRequestDto[]> {
  // 토큰이 없으면 빈 배열 반환
  if(!token) {
    console.error("토큰이 없습니다. 친구 요청 목록을 불러올 수 없습니다.");
    return [];
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/v1/friends/requests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':  `${token}`, // 토큰을 Authorization 헤더에 포함
      },
      credentials: 'include', // 쿠키를 포함하여 요청
    });

    if (!response.ok) {
      throw new Error('친구 요청 목록을 불러오는 데 실패했습니다.');
    }

    const data = await response.json();

    return data.data as FriendRequestDto[];
  } catch (error) {
    console.error('친구 요청 목록 로드 오류:', error);
    return [];
  }
}

/**
 * 친구 요청을 수락하는 함수
 */
export async function acceptFriendRequest(id: Number, token: string): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/v1/friends/accept?id=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':  `${token}`, // 토큰을 Authorization 헤더에 포함
      },
      credentials: 'include', // 쿠키를 포함하여 요청
    });

    if (!response.ok) {
      throw new Error('친구 요청 수락에 실패했습니다.');
    }
  } catch (error) {
    console.error('친구 요청 수락 오류:', error);
  }
}

/**
 * 친구 요청을 거절하는 함수
 */
export async function refuseFriendRequest(id: Number, token: string): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/v1/friends/refuse?id=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':  `${token}`, // 토큰을 Authorization 헤더에 포함
      },
      credentials: 'include', // 쿠키를 포함하여 요청
    });

    if (!response.ok) {
      throw new Error('친구 요청 거절에 실패했습니다.');
    }
  } catch (error) {
    console.error('친구 요청 거절 오류:', error);
  }
}

/**
 * 친구요청을 보내는 함수
 */
export async function sendFriendRequest(userId: string, token: string): Promise<void> {
  console.log('친구 요청 전송:', userId + ' url: ' + `${process.env.NEXT_PUBLIC_API_URL || ''}/v1/friends`);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/v1/friends`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':  `${token}`, // 토큰을 Authorization 헤더에 포함
      },
      credentials: 'include', // 쿠키를 포함하여 요청
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('친구 요청 전송에 실패했습니다.');
    }

  } catch (error) {
    console.error('친구 요청 전송 오류:', error);
  }
}
