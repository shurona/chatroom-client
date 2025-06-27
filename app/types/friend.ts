export interface Friend {
  id: string;
  loginId: string;
  description: string;
  createdAt: string;
  isOnline: boolean;
}

export type OnlineStatus = 'online' | 'offline';