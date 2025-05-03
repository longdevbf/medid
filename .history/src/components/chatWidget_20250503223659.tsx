import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../contexts/chatContext';
import { FaComments, FaTimes, FaPaperPlane, FaUser, FaCircle, FaPlus } from 'react-icons/fa';
import styles from './chatWidget.module.css';

const ChatWidget: React.FC = () => {
  const { 
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
    addNewChat
  } = useChat();
  console.log('ChatWidget rendered', recipientAddress);
  
  const [showNewChatForm, setShowNewChatForm] = useState(false);
  const [newChatAddress, setNewChatAddress] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, currentChat]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleAddNewChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChatAddress.trim()) {
      addNewChat(newChatAddress.trim());
      setNewChatAddress('');
      setShowNewChatForm(false);
    }
  };
  
  // Format wallet address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Format timestamp for display
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  // Get status color
  const getStatusColor = () => {
    switch(connectionStatus) {
      case 'connected': return '#2ecc71'; // green
      case 'connecting': return '#f1c40f'; // yellow
      case 'disconnected': return '#e74c3c'; // red
      case 'error': return '#e74c3c'; // red
      default: return '#e74c3c';
    }
  };
  
  return (
    <>
      {!isOpen ? (
        <button 
          className={styles.chatButton} 
          onClick={toggleChat} 
          aria-label="Open chat"
        >
          <FaComments size={24} />
          <span 
            className={styles.statusIndicator} 
            style={{ backgroundColor: getStatusColor() }}
            title={`Status: ${connectionStatus}`}
          ></span>
        </button>
      ) : (
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <div className={styles.headerTitle}>
              <h3>MedID Chat</h3>
              <div className={styles.connectionStatus}>
                <FaCircle 
                  size={10} 
                  color={getStatusColor()} 
                  title={`Status: ${connectionStatus}`}
                />
                <span>{connectionStatus}</span>
              </div>
            </div>
            <button 
              className={styles.closeButton} 
              onClick={toggleChat}
              aria-label="Close chat"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className={styles.chatContent}>
            <div className={styles.chatSidebar}>
              <div className={styles.sidebarHeader}>
                <h4>Cuộc trò chuyện</h4>
                <button 
                  className={styles.newChatButton} 
                  onClick={() => setShowNewChatForm(!showNewChatForm)}
                  title="Tạo cuộc trò chuyện mới"
                >
                  <FaPlus size={16} />
                </button>
              </div>
              
              {showNewChatForm && (
                <form className={styles.sidebarNewChatForm} onSubmit={handleAddNewChat}>
                  <input
                    type="text"
                    placeholder="Nhập địa chỉ ví..."
                    value={newChatAddress}
                    onChange={(e) => setNewChatAddress(e.target.value)}
                    className={styles.newChatInput}
                  />
                  <button type="submit" className={styles.addButton}>Thêm</button>
                </form>
              )}
              
              <ul className={styles.contactList}>
                {allContacts.length > 0 ? (
                  allContacts.map((contact) => (
                    <li 
                      key={contact}
                      className={`${styles.contactItem} ${currentChat === contact ? styles.activeContact : ''}`}
                      onClick={() => selectChat(contact)}
                    >
                      <div className={styles.contactAvatar}>
                        <FaUser />
                      </div>
                      <div className={styles.contactInfo}>
                        <span className={styles.contactName}>{formatAddress(contact)}</span>
                        <span className={styles.lastMessage}>
                          {messages[contact]?.length > 0 
                            ? messages[contact][messages[contact].length - 1].message.substring(0, 20) + '...' 
                            : 'Bắt đầu trò chuyện...'}
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className={styles.noContacts}>
                    Chưa có cuộc trò chuyện nào
                  </li>
                )}
              </ul>
            </div>
            
            <div className={styles.chatArea}>
              {currentChat ? (
                <>
                  <div className={styles.selectedChat}>
                    <span>Chat với: {formatAddress(currentChat)}</span>
                  </div>
                  
                  <div className={styles.messagesContainer}>
                    {messages[currentChat] && messages[currentChat].length > 0 ? (
                      messages[currentChat].map((msg, index) => (
                        <div 
                          key={index} 
                          className={`${styles.messageItem} ${msg.from === currentChat ? styles.receivedMessage : styles.sentMessage}`}
                        >
                          <div className={styles.messageContent}>
                            {msg.message}
                          </div>
                          <div className={styles.messageTime}>
                            {formatTime(msg.timestamp)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.noMessages}>
                        Chưa có tin nhắn nào. Hãy bắt đầu trò chuyện!
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  
                  <form onSubmit={handleSendMessage} className={styles.messageForm}>
                    <input 
                      type="text" 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)} 
                      placeholder="Nhập tin nhắn..." 
                      className={styles.messageInput}
                    />
                    <button 
                      type="submit" 
                      className={styles.sendButton} 
                      disabled={!message.trim() || connectionStatus !== 'connected'}
                    >
                      <FaPaperPlane />
                    </button>
                  </form>
                </>
              ) : (
                <div className={styles.startNewChat}>
                  <h3>Bắt đầu cuộc trò chuyện</h3>
                  <p>Chọn một liên hệ từ danh sách bên trái hoặc thêm một liên hệ mới</p>
                  <p className={styles.clickNewChat}>Nhấn vào <FaPlus size={14} /> để thêm liên hệ mới</p>
                  
                  {connectionStatus !== 'connected' && (
                    <p className={styles.connectionMessage}>
                      {connectionStatus === 'connecting' 
                        ? 'Đang kết nối đến server chat...' 
                        : 'Không thể kết nối đến server chat. Vui lòng thử lại sau.'}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;