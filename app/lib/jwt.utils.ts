/**
 * JWT 토큰에서 만료 시간을 추출합니다.
 * @returns 만료 시간 (밀리초) 또는 null
 */
export function getTokenExpiration(token: string): number | null {
  try {
    // JWT 토큰은 "header.payload.signature" 형식이므로, '.'로 분리하여 페이로드 부분을 가져옴
    const payload = JSON.parse(atob(token.split('.')[1]));

    // exp는 초 단위이므로 밀리초로 변환
    return payload.exp ? payload.exp * 1000 : null;
  } catch (error) {
    console.error('토큰 파싱 오류:', error);
    return null;
  }
}

/**
 * JWT 토큰에서 사용자 ID를 추출합니다.
 * @returns 사용자 ID 또는 null
 */
export function getTokenUser(token: string): string | null {
  try {
    // JWT 토큰은 "header.payload.signature" 형식이므로, '.'로 분리하여 페이로드 부분을 가져옴
    const payload = JSON.parse(atob(token.split('.')[1]));

    // 사용자 ID는 payload의 sub 필드에 저장된다고 가정
    return payload.sub || null;
  } catch (error) {
    console.error('토큰 파싱 오류:', error);
    return null;
  }
}

/**
 * JWT 토큰이 만료되었는지 확인합니다.
 * @returns 만료 여부
 */
export function isTokenExpired(token: string, bufferMinutes: number = 3): boolean {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;

  // 버퍼 시간을 두어 미리 갱신
  return Date.now() >= expiration - (bufferMinutes * 60 * 1000);
}