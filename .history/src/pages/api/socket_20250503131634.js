import { Server as SocketIOServer } from 'socket.io';
import { 
  saveMessage, 
  getUnreadMessages, 
  markMessagesAsRead, 
  getChatHistory,
  saveUserContacts,
  getUserContacts 
} from '../../lib/mongodb';

// Phần code hiện tại giữ nguyên...

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