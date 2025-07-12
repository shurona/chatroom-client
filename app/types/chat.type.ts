export interface ChatRoomResponseDto {
  id: number;
  name: string;
  roomType: ChatRoomType;
  lastMessage: string;
  lastTime: string; // ISO 8601 format
  memberCt: number;
  unreadCt: number;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

export enum ChatRoomType {
  GROUP = "GROUP",
  PRIVATE = "PRIVATE"
}

export interface ChatRoomCreateRequestDto {
  friendUserIds: number[]; // For private chats, the ID of the participant
  name?: string; // Optional name for group chats
  roomType: ChatRoomType;
}