'use server';

import { FriendRequestDto, Friend } from '@/app/types/friend.type';
import { axiosApiClient } from "@/app/api/utils/axios.utils";
import { ServerResponse } from "@/app/types/response.type";

/**
 * 서버에서 친구 목록을 가져오는 함수
 */
export async function fetchFriendsFromServer(token: string)
: Promise<ServerResponse<Friend[]>> {
  // 토큰이 없으면 빈 배열 반환
  if(!token) {
    console.error("토큰이 없습니다. 친구 목록을 불러올 수 없습니다.");
    return {
      success: false,
      error: "토큰이 없습니다."
    };
  }

  return axiosApiClient.get<Friend[]>(`/v1/friends`, token)
}

/**
 * 서버에서 친구 요청 목록을 가져오는 함수
 */
export async function fetchFriendRequestsFromServer(token: string)
  : Promise<ServerResponse<FriendRequestDto[]>> {
  // 토큰이 없으면 빈 배열 반환
  if(!token) {
    console.error("토큰이 없습니다. 친구 요청 목록을 불러올 수 없습니다.");
    return {
      success: false,
      error: "토큰이 없습니다."
    };
  }

  return axiosApiClient.get<FriendRequestDto[]>(`/v1/friends/requests`, token);
}


/**
 * 친구 요청을 수락하는 함수
 */
export async function acceptFriendRequest(id: Number, token: string): Promise<void> {
  if (!token) {
    null;
  }

  axiosApiClient.put<void>(`/v1/friends/requests/${id}/accept`, {}, token);
}

/**
 * 친구 요청을 거절하는 함수
 */
export async function refuseFriendRequest(id: Number, token: string): Promise<void> {
  if (!token) {
    null;
  }

  axiosApiClient.delete<void>(`/v1/friends/requests/${id}/refuse`, token);
}


/**
 * 친구요청을 보내는 함수
 */
export async function sendFriendRequest(userId: string, token: string): Promise<void> {
  if (!token) {
    null;
  }

  axiosApiClient.post<void>(`/v1/friends`, { userId }, token);
}
