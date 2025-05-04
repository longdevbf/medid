import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { pusherClient } from '../lib/';

type Message = {
  _id?: string;
  from: string;
  to?: string;
  message: string;
  timestamp: string;
  read?: boolean;
};

type ChatContextType = {
  isOpen: boolean;
  messages: Record<string, Message[]>;
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
  // State variables
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [recipientAddress, setRecipientAddress] = useState('');
  const [message, setMessage] = useState('');
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [allContacts, setAllContacts] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'error'>('disconnected');

  // Tải danh sách liên hệ từ localStorage khi khởi tạo
  useEffect(() => {
    if (typeof window !== 'undefined' && walletAddress) {
      try {
        const savedContactsString = localStorage.getItem(`${CONTACTS_STORAGE_KEY}_${walletAddress}`);
        if (savedContactsString) {
          const savedContacts = JSON.parse(savedContactsString);
          setAllContacts(savedContacts);
        }
      } catch (error) {
        console.error("Error loading contacts from localStorage:", error);
      }
    }
  }, [walletAddress]);

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

  // Khởi tạo Pusher connection và subscribe vào channel
  useEffect(() => {
    if (!walletAddress) return;

    setConnectionStatus('connecting');

    // Subscribe vào channel riêng của user
    const channel = pusherClient.subscribe(`private-${walletAddress}`);
    
    // Thiết lập kết nối events
    channel.bind('pusher:subscription_succeeded', () => {
      console.log('Pusher connected!');
      setConnectionStatus('connected');
      
      // Đăng ký với server
      registerWithServer(walletAddress);
      
      // Nếu có liên hệ, tải lịch sử chat
      if (allContacts.length > 0) {
        // Sync contacts với server
        syncContacts(walletAddress, allContacts);
        
        // Tải lịch sử chat cho mỗi liên hệ
        allContacts.forEach(contact => {
          loadChatHistory(contact);
        });
      }
    });
    
    channel.bind('pusher:subscription_error', (status: number) => {
      console.error('Pusher subscription error:', status);
      setConnectionStatus('error');
    });

    // Lắng nghe tin nhắn đến
    channel.bind('receive_message', (data: Message) => {
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
    channel.bind('message_delivered', (data: Message) => {
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

    // Lắng nghe tin nhắn chưa đọc
    channel.bind('unread_messages', (unreadMessages: Message[]) => {
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
    channel.bind('chat_history', ({ with: otherAddress, messages: historyMessages }: { with: string, messages: Message[] }) => {
      console.log(`Received chat history with ${otherAddress}:`, historyMessages);

      setMessages(prev => {
        const updated = { ...prev };
        updated[otherAddress] = historyMessages;
        return updated;
      });
    });

    // Lắng nghe danh sách liên hệ
    channel.bind('contacts_loaded', (contacts: string[]) => {
      console.log('Contacts loaded from server:', contacts);
      if (contacts && contacts.length > 0) {
        setAllContacts(contacts);

        // Tải lịch sử chat cho mỗi liên hệ
        contacts.forEach((contact: string) => {
          loadChatHistory(contact);
        });
      }
    });

    // Cleanup function
    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`private-${walletAddress}`);
      setConnectionStatus('disconnected');
    };
  }, [walletAddress]);

  // API helpers
  const registerWithServer = async (address: string) => {
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          data: { walletAddress: address }
        })
      });
    } catch (error) {
      console.error('Error registering with server:', error);
    }
  };

  const syncContacts = async (address: string, contacts: string[]) => {
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync_contacts',
          data: { walletAddress: address, contacts }
        })
      });
    } catch (error) {
      console.error('Error syncing contacts:', error);
    }
  };

  // UI functions
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!message.trim() || !recipientAddress || !walletAddress) return;
    
    console.log(`Sending message to ${recipientAddress}: ${message}`);

    try {
      const messageData = {
        from: walletAddress,
        to: recipientAddress,
        message: message.trim()
      };

      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_message',
          data: messageData
        })
      });
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Không thể gửi tin nhắn. Vui lòng thử lại sau.');
    }
  };

  const selectChat = (address: string | null) => {
    setCurrentChat(address);
    if (address) {
      setRecipientAddress(address);
      // Khi chọn một cuộc trò chuyện, tải lịch sử chat
      loadChatHistory(address);
    }
  };

  const loadChatHistory = async (otherAddress: string) => {
    if (!walletAddress) return;
    
    console.log(`Loading chat history with ${otherAddress}`);
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_chat_history',
          data: { myAddress: walletAddress, with: otherAddress }
        })
      });
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

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

    // Sync contacts với server nếu có wallet
    if (walletAddress) {
      syncContacts(walletAddress, [...allContacts, address]);
    }
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