export interface Friend {
  id: number;
  friendUserid: number;
  nickName: string;
  description: string;
  createdAt: string;
  isOnline: boolean;
}

export interface FriendRequestDto {
  friendId: number;
  requestedUserId: number;
  nickName: string;
  description: string;
  requestAt: string;
  isOnline: boolean;
}

export type OnlineStatus = 'online' | 'offline';