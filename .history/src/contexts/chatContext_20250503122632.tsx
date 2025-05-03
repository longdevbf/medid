import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

type Message = {
  from: string;
  to?: string;
  message: string;
  timestamp: string;
};

type ChatContextType = {
  isOpen: boolean;
  messages: Record<string, Message[]>; // Lưu tin nhắn theo địa chỉ ví
  recipientAddress: string;
  message: string;
  toggleChat: () => void;
  sendMessage: () => void;
  setRecipientAddress: (address: string) => void;
  setMessage: (message: string) => void;
  currentChat: string | null;
  selectChat: (address: string | null) => void;
  allContacts: string[];
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'error';
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children, walletAddress }: { children: ReactNode, walletAddress?: string }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [recipientAddress, setRecipientAddress] = useState('');
  const [message, setMessage] = useState('');
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [allContacts, setAllContacts] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'error'>('disconnected');
  const [socketInitialized, setSocketInitialized] = useState(false);

  // Khởi tạo Socket.IO
  useEffect(() => {
    if (!walletAddress || socketInitialized) return;

    const initSocket = async () => {
      try {
        setConnectionStatus('connecting');
        console.log('Initializing socket connection...');
        
        // Kích hoạt API endpoint để đảm bảo Socket.IO server đang chạy
        await fetch('/api/socket');
        
        // Đây là sự thay đổi quan trọng - không set path trong options
        const socketInstance = io();
        
        socketInstance.on('connect', () => {
          console.log('Socket connected!', socketInstance.id);
          setConnectionStatus('connected');
          
          // Đăng ký với socket server
          if (walletAddress) {
            socketInstance.emit('register', walletAddress);
          }
        });
        
        socketInstance.on('connect_error', (err) => {
          console.error('Connection error:', err);
          setConnectionStatus('error');
        });
        
        socketInstance.on('disconnect', () => {
          console.log('Socket disconnected');
          setConnectionStatus('disconnected');
        });
        
        setSocket(socketInstance);
        setSocketInitialized(true);
        
        return () => {
          socketInstance.disconnect();
          setConnectionStatus('disconnected');
        };
      } catch (error) {
        console.error('Socket initialization error:', error);
        setConnectionStatus('error');
      }
    };

    initSocket();
  }, [walletAddress, socketInitialized]);

  // Phần còn lại của file giữ nguyên
  // ...

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};