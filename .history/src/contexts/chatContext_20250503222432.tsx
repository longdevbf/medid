import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

type Message = {
  _id?: string;  // Thêm _id từ MongoDB
  from: string;
  to?: string;
  message: string;
  timestamp: string;
  read?: boolean; // Thêm trạng thái đọc
};

type Contact = {
  address: string;
  lastMessage?: string;
  lastTimestamp?: string;
};
console.log()

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
  loadChatHistory: (otherAddress: string) => void;
  addNewChat: (address: string) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Key để lưu contacts vào localStorage
const CONTACTS_STORAGE_KEY = 'medid_chat_contacts';

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

  // Tải danh sách liên hệ từ localStorage khi khởi tạo
  useEffect(() => {
    if (typeof window !== 'undefined' && walletAddress) {
      try {
        const savedContactsString = localStorage.getItem(`${CONTACTS_STORAGE_KEY}_${walletAddress}`);
        if (savedContactsString) {
          const savedContacts = JSON.parse(savedContactsString);
          setAllContacts(savedContacts);
          
          // Nếu có liên hệ, tự động tải lịch sử chat cho mỗi liên hệ khi socket đã kết nối
          if (socket && socket.connected && savedContacts.length > 0) {
            savedContacts.forEach((contact: string) => {
              loadChatHistory(contact);
            });
          }
        }
      } catch (error) {
        console.error("Error loading contacts from localStorage:", error);
      }
    }
  }, [walletAddress, socket?.connected]);

  // Lưu danh sách liên hệ vào localStorage khi thay đổi
  useEffect(() => {
    if (typeof window !== 'undefined' && walletAddress && allContacts.length > 0) {
      try {
        localStorage.setItem(`${CONTACTS_STORAGE_KEY}_${walletAddress}`, JSON.stringify(allContacts));
      } catch (error) {
        console.error("Error saving contacts to localStorage:", error);
      }
    }
  }, [allContacts, walletAddress]);

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
            
            // Tự động tải lịch sử chat cho mỗi liên hệ khi kết nối thành công
            if (allContacts.length > 0) {
              allContacts.forEach(contact => {
                loadChatHistoryWithSocket(socketInstance, contact, walletAddress);
              });
            }
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

  // Hàm tải lịch sử chat với socket cụ thể
  const loadChatHistoryWithSocket = (socketInstance: Socket, otherAddress: string, myWalletAddress: string) => {
    console.log(`Loading chat history with ${otherAddress} using socket`);
    socketInstance.emit('get_chat_history', {
      with: otherAddress,
      myAddress: myWalletAddress
    });
  };

  // Đăng ký và lắng nghe các sự kiện socket
  useEffect(() => {
    if (!socket || !walletAddress) return;
    
    // Đăng ký lại khi socket đã kết nối
    if (socket.connected && walletAddress) {
      socket.emit('register', walletAddress);
      
      // Tự động đồng bộ danh bạ từ localStorage lên server
      if (allContacts.length > 0) {
        socket.emit('sync_contacts', {
          walletAddress,
          contacts: allContacts
        });
      }
      
      // Nếu chưa có danh bạ local, lấy từ server
      if (allContacts.length === 0) {
        socket.emit('get_contacts', walletAddress);
      }
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
    socket.on('message_delivered', (data: Message) => {
      console.log('Message delivered:', data);
      setMessages((prevMessages) => {
        const recipient = data.to!;
        const updatedMessages = { ...prevMessages };
        
        if (!updatedMessages[recipient]) {
          updatedMessages[recipient] = [];
        }
        
        updatedMessages[recipient] = [...updatedMessages[recipient], data];
        return updatedMessages;
      });
    });
    
    // Lắng nghe khi có lỗi gửi tin nhắn
    socket.on('message_error', (data: { error: string, originalMessage: any }) => {
      console.error('Message error:', data);
      alert(`Không thể gửi tin nhắn: ${data.error}`);
    });
    
    // Lắng nghe tin nhắn chưa đọc khi đăng nhập
    socket.on('unread_messages', (unreadMessages: Message[]) => {
      console.log('Received unread messages:', unreadMessages);
      
      // Nhóm tin nhắn theo người gửi
      const groupedMessages: Record<string, Message[]> = {};
      
      unreadMessages.forEach(msg => {
        const sender = msg.from;
        if (!groupedMessages[sender]) {
          groupedMessages[sender] = [];
        }
        groupedMessages[sender].push(msg);
      });
      
      // Cập nhật state
      setMessages(prevMessages => {
        const updatedMessages = { ...prevMessages };
        
        // Thêm vào messages hiện có
        Object.entries(groupedMessages).forEach(([sender, msgs]) => {
          if (!updatedMessages[sender]) {
            updatedMessages[sender] = [];
          }
          updatedMessages[sender] = [...updatedMessages[sender], ...msgs];
        });
        
        return updatedMessages;
      });
      
      // Cập nhật danh sách liên hệ
      const newContacts = Object.keys(groupedMessages);
      setAllContacts(prev => {
        const uniqueContacts = new Set([...prev, ...newContacts]);
        return Array.from(uniqueContacts);
      });
      
      // Thông báo cho người dùng
      if (unreadMessages.length > 0) {
        const senders = new Set(unreadMessages.map(msg => msg.from));
        alert(`Bạn có ${unreadMessages.length} tin nhắn chưa đọc từ ${senders.size} người`);
      }
    });
    
    // Lắng nghe lịch sử chat
    socket.on('chat_history', ({ with: otherAddress, messages: historyMessages }) => {
      console.log(`Received chat history with ${otherAddress}:`, historyMessages);
      
      setMessages(prev => {
        const updated = { ...prev };
        updated[otherAddress] = historyMessages;
        return updated;
      });
    });
    
    // Thêm event listener cho contacts_loaded
    socket.on('contacts_loaded', (contacts) => {
      console.log('Contacts loaded from server:', contacts);
      if (contacts && contacts.length > 0) {
        setAllContacts(contacts);
        
        // Tải lịch sử chat cho mỗi liên hệ
        contacts.forEach(contact => {
          loadChatHistory(contact);
        });
      }
    });
    
    return () => {
      socket.off('receive_message');
      socket.off('message_delivered');
      socket.off('message_error');
      socket.off('unread_messages');
      socket.off('chat_history');
      socket.off('contacts_loaded');
      socket.off('contacts_error');
    };
  }, [socket, walletAddress]);

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
      // Khi chọn một cuộc trò chuyện, tải lịch sử chat
      loadChatHistory(address);
    }
  };
  
  // Tải lịch sử chat với một người
  const loadChatHistory = (otherAddress: string) => {
    if (!socket || !walletAddress) return;
    
    console.log(`Loading chat history with ${otherAddress}`);
    socket.emit('get_chat_history', {
      with: otherAddress,
      myAddress: walletAddress
    });
  };
  
  // Thêm liên hệ mới và bắt đầu cuộc trò chuyện
  const addNewChat = (address: string) => {
    if (!address || address === walletAddress) return;
    
    // Thêm vào danh sách liên hệ nếu chưa có
    setAllContacts(prev => {
      if (prev.includes(address)) return prev;
      return [...prev, address];
    });
    
    // Chuẩn bị khung chat nếu chưa có
    setMessages(prev => {
      if (!prev[address]) {
        return { ...prev, [address]: [] };
      }
      return prev;
    });
    
    // Chọn chat mới thêm vào
    selectChat(address);
  };

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
    connectionStatus,
    loadChatHistory,
    addNewChat
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