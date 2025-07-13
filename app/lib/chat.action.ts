'use server';

import { axiosApiClient } from "@/app/api/utils/axios.utils"
import { ServerResponse } from "@/app/types/response.type";
import { ChatRoomResponseDto, ChatRoomCreateRequestDto, ChatRoomType, ChatContentType, ChatWriteRequestDto } from "@/app/types/chat.type";
import { PageResponseType} from "@/app/types/response.type";
import { ChatLogResponseDto } from "@/app/types/chat.type";

/**
 * 서버에서 채팅방 목록을 가져오는 함수
 */
export async function fetchChatRoomsFromServer (accessToken: string)
  : Promise<ServerResponse<ChatRoomResponseDto[]>> {

  if (!accessToken) {
    console.error("Access token is required to fetch chat rooms.");
    return Promise.resolve({
      success: false,
      error: "Access token is required."
    });
  }

  return await axiosApiClient.get('/v1/chats/rooms', accessToken);
};

/**
 * 서버에서 채팅방을 생성하는 함수
 */
export async function createPrivateChatRoom(accessToken: string, participantId: number)
: Promise<ServerResponse<ChatRoomResponseDto>> {
  if (!accessToken) {
    console.error("Access token is required to create a chat room.");
    return Promise.resolve({
      success: false,
      error: "Access token is required."
    });
  }

  const requestDto : ChatRoomCreateRequestDto = {
    friendUserIds: [participantId],
    roomType: ChatRoomType.PRIVATE
  };

  return await axiosApiClient.post<ChatRoomResponseDto>('/v1/chats/rooms/private', requestDto, accessToken);
}

/**
 * 서버에서 채팅 로그를 가져오는 함수
 */
export async function fetchChatLogsFromServer(accessToken: string, chatRoomId: number, page = 0)
: Promise<ServerResponse<PageResponseType<ChatLogResponseDto>>> {

  if (!accessToken) {
    console.error("Access token is required to fetch chat logs.");
    return Promise.resolve({
      success: false,
      error: "Access token is required."
    });
  }

  return await axiosApiClient.get(`/v1/chats/rooms/${chatRoomId}/logs?page=${page}`, accessToken);
}

/**
 * 서버에 메시지를 보내는 함수
 */
export async function sendMessageToServer(accessToken: string, chatRoomId: number, content: string)
: Promise<ServerResponse<number>> {
  if (!accessToken) {
    console.error("Access token is required to send a message.");
    return Promise.resolve({
      success: false,
      error: "Access token is required."
    });
  }

  const requestDto: ChatWriteRequestDto = {
    chatRoomId,
    message: content,
    type: ChatContentType.TEXT 
  };

  return await axiosApiClient.post<number>(`/v1/chats/rooms/${chatRoomId}/messages`, requestDto, accessToken);
}