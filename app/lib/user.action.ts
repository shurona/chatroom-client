'use server';

import { getTokenUser } from "./jwt.utils";
import { UserResponseDto, UserSearchResult } from "@/app/types/user.type";
import { axiosApiClient } from "@/app/api/utils/axios.utils";
import { ServerResponse } from "@/app/types/response.type";


/**
 * 사용자 ID로 사용자 정보를 찾습니다.
 */
export async function findUserById(accessToken : string | undefined)
: Promise<ServerResponse<UserResponseDto>> {

  if( !accessToken) {
    return {
      success: false,
      error: '액세스 토큰이 제공되지 않았습니다.'
    };
  }

  const userId = getTokenUser(accessToken);

  return await axiosApiClient.get<UserResponseDto>(`/v1/users/${userId}`, accessToken);
}

export async function findUserByNickname(accessToken: string, nickname: string, page: number)
  : Promise<ServerResponse<UserSearchResult[]>> {

  if (!accessToken) {
    return {
      success: false,
      error: '액세스 토큰이 제공되지 않았습니다.'
    };
  }

   if (!nickname.trim()) {
    return {
      success: false,
      error: '검색할 닉네임을 입력해주세요.'
    };
  }

  return axiosApiClient.get<UserSearchResult[]>(
    `/v1/users/list?query=${encodeURIComponent(nickname)}&page=${page}`, 
    accessToken
  );
}