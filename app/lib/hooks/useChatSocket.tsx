'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { getTokenUser } from '../jwt.utils';

interface SocketContextType {
  client: Client | null;
  isConnected: boolean;
  sendMessage: (destination: string, body: any, replyTo: string) => void;
  subscribe: (destination: string, callback: (message: any) => void) => void;
  unsubscribe: (destination: string) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}


export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const clientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const subscriptionsRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    // 로그인된 상태에서만 소켓 연결
    if (status === 'authenticated' && session?.accessToken) {
      connectSocket();
    } else if (status === 'unauthenticated') {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [status, session]);

  const connectSocket = () => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (!url) {
      console.error('NEXT_PUBLIC_SOCKET_URL 환경 변수가 설정되지 않았습니다.');
      return;
    }

    if(session == null) {
      console.error('세션 정보가 없습니다. 소켓 연결을 할 수 없습니다.');
      return;
    }

    console.log('소켓 서버 URL:', url);

    const socket = new SockJS(url);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        // 인증 토큰을 헤더에 포함
        Authorization: `${session?.accessToken}`,
      },
      onConnect: () => {
        console.log('WebSocket 연결 성공');
        setIsConnected(true);

    
        const userId = getTokenUser(session.accessToken || "");

        client.subscribe(`/topic/chat/user/${userId}`, (message) => {
          if (message.body) {
            const parsedMessage = JSON.parse(message.body);
            console.log('받은 메시지:', parsedMessage);
          }
        });
      },
      onDisconnect: () => {
        console.log('WebSocket 연결 해제');
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error('STOMP 오류:', frame);
        setIsConnected(false);
      },
      debug: (str) => {
        console.log('STOMP 디버그:', str);
      }
    });

    client.activate();
    clientRef.current = client;
  };

  const disconnectSocket = () => {
    if (clientRef.current && clientRef.current.active) {
      clientRef.current.deactivate();
      clientRef.current = null;
      setIsConnected(false);
      subscriptionsRef.current.clear();
    }
  };

  const sendMessage = (destination: string, body: any, replyTo: string) => {
    if (clientRef.current && isConnected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
        headers: {
          'reply-to': replyTo,
        },
      });
    } else {
      console.error('소켓이 연결되지 않았습니다.');
    }
  };

  const subscribe = (destination: string, callback: (message: any) => void) => {
    if (clientRef.current && isConnected) {
      const subscription = clientRef.current.subscribe(destination, (message) => {
        if (message.body) {
          const parsedMessage = JSON.parse(message.body);
          callback(parsedMessage);
        }
      });
      subscriptionsRef.current.set(destination, subscription);
    }
  };

  const unsubscribe = (destination: string) => {
    const subscription = subscriptionsRef.current.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      subscriptionsRef.current.delete(destination);
    }
  };

  const value: SocketContextType = {
    client: clientRef.current,
    isConnected,
    sendMessage,
    subscribe,
    unsubscribe,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};