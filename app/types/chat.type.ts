// Chat room response DTO
export interface ChatRoomResponseDto {
  id: number;
  name: string;
  roomType: ChatRoomType;
  lastMessage: string;
  lastTime: string; // 날짜가 넘어온다.
  memberCt: number;
  unreadCt: number;
  createdAt: string; // 날짜가 넘어온다.
  updatedAt: string; // 날짜가 넘어온다.
}

// Chat room creation request DTO
export interface ChatRoomCreateRequestDto {
  friendUserIds: number[]; // For private chats, the ID of the participant
  name?: string; // Optional name for group chats
  roomType: ChatRoomType;
}

export interface ChatWriteRequestDto {
  chatRoomId: number; // 채팅방 ID
  message: string;
  type: ChatContentType;
}

// Chat content types
export interface ChatLogResponseDto {
  id: number;
  content: string;
  type: ChatContentType;
  writerId: number;
  writeUserNickName: string; // 작성자 닉네임
  wroteTime: string; // 날짜가 넘어온다.
  unreadCount: number;
}
export interface ReadNotificationDto {
  userId: number; // 읽음 상태를 업데이트한 사용자 ID
  readAt: string; // 읽음 시간
}

export interface ChatUnReadUserResponseDto {
  readStatusMap: Record<number, number>; // 메시지 ID와 읽음 상태 매핑
}

export enum ChatRoomType {
  GROUP = "GROUP",
  PRIVATE = "PRIVATE"
}

export enum ChatContentType {
  TEXT = "TEXT",
  // IMAGE = "IMAGE",
  // FILE = "FILE",
}