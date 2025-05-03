import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Socket as NetSocket } from 'net';

interface SocketServer extends HTTPServer {
  io?: SocketIOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

// Lưu trữ các kết nối người dùng (địa chỉ ví -> socket ID)
const users = new Map<string, string>();

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
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
    socket.on('register', (walletAddress) => {
      console.log(`User registered: ${walletAddress}`);
      users.set(walletAddress, socket.id);
      console.log('Current users:', Array.from(users.entries()));
    });

    // Người dùng gửi tin nhắn
    socket.on('send_message', (data) => {
      const { to, from, message } = data;
      console.log(`Message from ${from} to ${to}: ${message}`);
      
      // Tìm socket ID của người nhận
      const recipientSocketId = users.get(to);
      
      if (recipientSocketId) {
        // Gửi tin nhắn đến người nhận
        io.to(recipientSocketId).emit('receive_message', {
          from,
          message,
          timestamp: new Date().toISOString()
        });
        
        // Gửi xác nhận lại cho người gửi
        socket.emit('message_delivered', {
          to,
          message,
          timestamp: new Date().toISOString()
        });
      } else {
        // Người nhận không trực tuyến
        socket.emit('user_offline', { to });
      }
    });

    // Người dùng ngắt kết nối
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      // Xóa người dùng khỏi danh sách
      for (const [walletAddress, socketId] of users.entries()) {
        if (socketId === socket.id) {
          users.delete(walletAddress);
          break;
        }
      }
    });
  });

  res.end();
}