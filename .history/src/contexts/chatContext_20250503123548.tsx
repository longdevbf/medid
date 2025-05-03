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

  // Đăng ký và lắng nghe các sự kiện socket
  useEffect(() => {
    if (!socket || !walletAddress) return;
    
    // Đăng ký lại khi socket đã kết nối
    if (socket.connected && walletAddress) {
      socket.emit('register', walletAddress);
    }
    
    // Lắng nghe tin nhắn đến
    socket.on('receive_message', (data: Message) => {
      console.log('Received message:', data);
      setMessages((prevMessages) => {
        const sender = data.from;
        const updatedMessages = { ...prevMessages };
        
        if (!updatedMessages[sender]) {
          updatedMessages[sender] = [];
          // Thêm người gửi vào danh sách liên hệ nếu chưa có
          setAllContacts((prev) => {
            if (!prev.includes(sender)) {
              return [...prev, sender];
            }
            return prev;
          });
        }
        
        updatedMessages[sender] = [...updatedMessages[sender], data];
        return updatedMessages;
      });
    });
    
    // Lắng nghe xác nhận gửi tin nhắn
    socket.on('message_delivered', (data: { to: string, message: string, timestamp: string }) => {
      console.log('Message delivered:', data);
      setMessages((prevMessages) => {
        const recipient = data.to;
        const updatedMessages = { ...prevMessages };
        
        if (!updatedMessages[recipient]) {
          updatedMessages[recipient] = [];
        }
        
        updatedMessages[recipient].push({
          from: walletAddress,
          to: recipient,
          message: data.message,
          timestamp: data.timestamp
        });
        
        return updatedMessages;
      });
    });
    
    // Lắng nghe khi người nhận không trực tuyến
    socket.on('user_offline', (data: { to: string }) => {
      console.log('User offline:', data.to);
      alert(`Người dùng ${data.to} hiện không trực tuyến. Tin nhắn của bạn sẽ được gửi khi họ online.`);
    });
    
    return () => {
      socket.off('receive_message');
      socket.off('message_delivered');
      socket.off('user_offline');
    };
  }, [socket, walletAddress]);

  // Theo dõi các cuộc trò chuyện để cập nhật danh sách liên hệ
  useEffect(() => {
    const contacts = Object.keys(messages);
    setAllContacts(contacts);
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = () => {
    if (!socket || !message.trim() || !recipientAddress || !walletAddress) return;
    
    console.log(`Sending message to ${recipientAddress}: ${message}`);
    
    const messageData = {
      to: recipientAddress,
      from: walletAddress,
      message: message.trim()
    };
    
    socket.emit('send_message', messageData);
    setMessage('');
  };

  const selectChat = (address: string | null) => {
    setCurrentChat(address);
    if (address) {
      setRecipientAddress(address);
    }
  };

  // Đây là phần bạn thiếu - Khai báo đối tượng value
  const value = {
    isOpen,
    messages,
    recipientAddress,
    message,
    toggleChat,
    sendMessage,
    setRecipientAddress,
    setMessage,
    currentChat,
    selectChat,
    allContacts,
    connectionStatus
  };

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