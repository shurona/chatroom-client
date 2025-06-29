export interface Friend {
  id: Number;
  nickName: string;
  description: string;
  createdAt: string;
  isOnline: boolean;
}

export interface FriendRequestDto {
  friendId: Number;
  requestedUserId: Number;
  nickName: string;
  description: string;
  requestAt: string;
  isOnline: boolean;
}

export type OnlineStatus = 'online' | 'offline';