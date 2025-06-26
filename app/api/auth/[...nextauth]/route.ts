import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, Session } from "next-auth";
import { getTokenUser, isTokenExpired } from '@/app/lib/jwt.utils'; // 유틸리티 함수 임포트


// 토큰 갱신 함수
async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      return {
        success : false,
        error: '토큰 갱신에 실패했습니다.',
      }
    }

    const data = await response.json();

    return {
      success: true,
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken || refreshToken,
    };
  } catch (error) {
    console.error('토큰 갱신 오류:', error);
    return { success: false };
  }
}

// 인증 옵션 설정
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
      },
      async authorize(credentials) {

        // 이미 auth.action.ts에서 인증을 처리했으므로
        // 여기서는 전달받은 토큰을 사용자 객체에 포함시키기만 함
        if (!credentials?.accessToken || credentials.accessToken === 'undefined') {
          console.error("Access token is missing or invalid");
          throw new Error("Access token is required");
        }

        // 사용자 정보는 토큰에서 추출하거나 추가 API 호출로 가져올 수 있음
        // 여기서는 간단히 토큰만 포함시킴
        return {
          id: "user-id", // 실제 구현에서는 토큰에서 추출한 사용자 ID 사용
          accessToken: credentials.accessToken,
          refreshToken: credentials.refreshToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 첫 로그인 시
      if (user && user.accessToken) {
        const userInfo = getTokenUser(user.accessToken);

        if(userInfo) {
          token.userInfo = userInfo
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
        
          return token;
        } else {
          return {} as any; // 사용자 정보가 없으면 빈 토큰 반환
        }
      }

      // accessToken이 유효한지 확인
      if (token.accessToken && !isTokenExpired(token.accessToken)) {
        return token;
      }

      // 토큰이 만료된 경우 갱신 시도
      if (token.refreshToken) {
        console.log('AccessToken 만료, 갱신 시도');
        const refreshResult = await refreshAccessToken(token.refreshToken as string);
        
        if (refreshResult.success) {
          // 여기서는 accessToken만 갱신한다.
          return {
            userInfo: token.userInfo,
            accessToken: refreshResult.accessToken,
            refreshToken: refreshResult.refreshToken,
          }
        }
      }
      // refreshToken도 없는 경우
      console.error('AccessToken과 RefreshToken 모두 만료됨');
      return {} as any;
    },
    async session({ session, token }) {
      // 토큰이 비어있으면 세션도 무효화
      if (!token || Object.keys(token).length === 0) {
        console.log('토큰이 없어 세션을 무효화합니다.');
        return null as any; // 세션 무효화
      }

      // 에러가 있는 경우에도 세션 무효화
      if (token.error) {
        return null as any; // 세션 무효화
      }

      if (token.accessToken) {
        session.userInfo = token.userInfo;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // 절대 URL인 경우
      if (url.startsWith("http")) {
        // 같은 도메인인지 확인
        if (new URL(url).origin === baseUrl) {
          return url;
        }
        return baseUrl;
      }

      // 상대 URL인 경우
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      
      // 기본값
      return `${baseUrl}/chat/friends`;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 14 * 24 * 60 * 60, // 14일
  },
  pages: {
    signIn: "/login",
    error: "/login", // 로그인 실패 시 리다이렉트할 페이지
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// API 라우트 핸들러 생성 및 내보내기
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };