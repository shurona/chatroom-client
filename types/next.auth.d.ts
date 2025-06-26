import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Session 타입 확장
   */
  interface Session {
    accessToken?: string
    refreshToken?: string
    userInfo?: string
    user: {
      // 기존 사용자 속성 유지하면서 확장
    } & DefaultSession["user"]
  }

  /**
   * User 타입 확장
   */
  interface User {
    accessToken?: string
    refreshToken?: string
  }
}

declare module "next-auth/jwt" {
  /**
   * JWT 토큰 타입 확장
   */
  interface JWT {
    userInfo?: string
    accessToken?: string
    refreshToken?: string

  }
}