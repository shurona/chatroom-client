export function formatLastMessageTime(dateString: string): string {
  const messageDate = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - messageDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // 오늘
    return messageDate.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } else if (diffDays === 1) {
    // 어제
    return '어제';
  } else if (diffDays < 7) {
    // 이번 주
    return messageDate.toLocaleDateString('ko-KR', { weekday: 'short' });
  } else if (diffDays < 365) {
    // 올해
    return messageDate.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
  } else {
    // 작년 이전
    return messageDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}