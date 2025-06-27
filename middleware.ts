import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // 토큰이 있는 경우에만 접근 허용
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // accessToken이 있으면 접근 허용
        if (!!token?.accessToken) {
          return true;
        }
        
        // 인증되지 않은 경우, 현재 URL을 callbackUrl로 저장
        const url = new URL('/login', req.url);
        url.searchParams.set('callbackUrl', req.url);
        
        // 이미 로그인 페이지인 경우 리다이렉트 루프 방지
        if (req.nextUrl.pathname === '/login') {
          return false;
        }
        
        return false;

      },
    },
  }
)

export const config = {
  matcher: ["/chat/:path*"]
}