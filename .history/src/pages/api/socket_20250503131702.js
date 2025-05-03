import { Server as SocketIOServer } from 'socket.io';
import { 
  saveMessage, 
  getUnreadMessages, 
  markMessagesAsRead, 
  getChatHistory,
  saveUserContacts,
  getUserContacts 
} from '../../lib/mongodb';

// Lưu trữ các kết nối người dùng (địa chỉ ví -> socket ID)
const users = new Map();

export default function handler(req, res) {
  // Nếu Socket.IO server đã được khởi tạo, không khởi tạo lại
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  console.log('Setting up socket');
  const io = new SocketIOServer(res.socket.server);
  res.socket.server.io = io;

  // Xử lý kết nối socket
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Người dùng đăng ký với địa chỉ ví
    socket.on('register', async (walletAddress) => {
      console.log(`User registered: ${walletAddress}`);
      users.set(walletAddress, socket.id);
      
      try {
        // Lấy các tin nhắn chưa đọc
        const unreadMessages = await getUnreadMessages(walletAddress);
        console.log(`Found ${unreadMessages.length} unread messages for ${walletAddress}`);
        
        if (unreadMessages.length > 0) {
          // Gửi tin nhắn chưa đọc đến người dùng
          socket.emit('unread_messages', unreadMessages);
          
          // Đánh dấu tin nhắn đã đọc
          await markMessagesAsRead(unreadMessages.map(msg => msg._id));
        }
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
      
      console.log('Current online users:', Array.from(users.entries()));
    });

    // Người dùng yêu cầu lịch sử chat
    socket.on('get_chat_history', async ({ with: otherAddress, myAddress }) => {
      console.log(`Getting chat history between ${myAddress} and ${otherAddress}`);
      try {
        const history = await getChatHistory(myAddress, otherAddress);
        console.log(`Found ${history.length} messages in history`);
        socket.emit('chat_history', { with: otherAddress, messages: history });
      } catch (error) {
        console.error('Error fetching chat history:', error);
        socket.emit('error', { message: 'Failed to fetch chat history' });
      }
    });

    // Người dùng gửi tin nhắn
    socket.on('send_message', async (data) => {
      const { to, from, message } = data;
      console.log(`Message from ${from} to ${to}: ${message}`);
      
      const timestamp = new Date().toISOString();
      
      // Tạo đối tượng tin nhắn để lưu vào database
      const messageObj = {
        from,
        to,
        message,
        timestamp,
        read: false
      };
      
      try {
        // Lưu tin nhắn vào MongoDB, bất kể người nhận có online hay không
        const result = await saveMessage(messageObj);
        console.log('Message saved to database:', result.insertedId);
        
        const savedMessage = { 
          ...messageObj, 
          _id: result.insertedId.toString()
        };
        
        // Tìm socket ID của người nhận
        const recipientSocketId = users.get(to);
        
        if (recipientSocketId) {
          console.log(`Recipient ${to} is online, sending message directly`);
          // Nếu người nhận online, gửi tin nhắn ngay và đánh dấu đã đọc
          io.to(recipientSocketId).emit('receive_message', savedMessage);
          await markMessagesAsRead([result.insertedId]);
        } else {
          console.log(`Recipient ${to} is offline, message saved for later`);
        }
        
        // Luôn gửi xác nhận cho người gửi
        socket.emit('message_delivered', savedMessage);
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('message_error', { 
          error: 'Failed to save message',
          originalMessage: data
        });
      }
    });

    // Thêm sự kiện đồng bộ danh bạ
    socket.on('sync_contacts', async ({ walletAddress, contacts }) => {
      try {
        await saveUserContacts(walletAddress, contacts);
        console.log(`Synced contacts for ${walletAddress}`);
      } catch (error) {
        console.error('Error syncing contacts:', error);
      }
    });

    // Thêm sự kiện lấy danh bạ từ server
    socket.on('get_contacts', async (walletAddress) => {
      try {
        const contacts = await getUserContacts(walletAddress);
        socket.emit('contacts_loaded', contacts);
        console.log(`Loaded contacts for ${walletAddress}:`, contacts);
      } catch (error) {
        console.error('Error getting contacts:', error);
        socket.emit('contacts_error', { error: 'Failed to load contacts' });
      }
    });

    // Người dùng ngắt kết nối
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      // Xóa người dùng khỏi danh sách
      for (const [walletAddress, socketId] of users.entries()) {
        if (socketId === socket.id) {
          users.delete(walletAddress);
          console.log(`User ${walletAddress} removed from active users`);
          break;
        }
      }
    });
  });

  res.end();
}