/**
 * UserResponseDto
 */
export interface UserResponseDto {
  userId: number;
  loginId: string;
  nickName: string;
  description: string;
  phoneNumber: string;
}

export interface UserSearchResult {
  userId: string; // 사용자 ID
  nickName: string; // 사용자 닉네임
  description: string; // 사용자 설명
  isOnline: boolean; // 온라인 상태
  requested: FriendRequestStatus | null; // 친구 요청 상태
}

export type FriendRequestStatus = 'REQUESTED' | 'ACCEPTED' | 'REFUSED' | 'BANNED';

