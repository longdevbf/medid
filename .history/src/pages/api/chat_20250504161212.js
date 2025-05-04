import { pusherServer } from '../../lib/pusher';
import { 
  saveMessage, 
  getUnreadMessages, 
  markMessagesAsRead, 
  getChatHistory, 
  saveUserContacts,
  getUserContacts 
} from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, data } = req.body;

    switch (action) {
      case 'register': {
        const { walletAddress } = data;
        
        
        const unreadMessages = await getUnreadMessages(walletAddress);
        
       
        if (unreadMessages.length > 0) {
          await pusherServer.trigger(`private-${walletAddress}`, 'unread_messages', unreadMessages);
          
          
          await markMessagesAsRead(unreadMessages.map(msg => msg._id));
        }
        
        return res.status(200).json({ success: true });
      }
      
      case 'send_message': {
        const { from, to, message } = data;
        
 
        const messageObj = {
          from,
          to,
          message,
          timestamp: new Date().toISOString(),
          read: false
        };
        
  
        const result = await saveMessage(messageObj);
        const savedMessage = { 
          ...messageObj, 
          _id: result.insertedId.toString() 
        };
        
    
        await pusherServer.trigger(`private-${to}`, 'receive_message', savedMessage);
        
        // Phản hồi xác nhận cho người gửi
        await pusherServer.trigger(`private-${from}`, 'message_delivered', savedMessage);
        
        return res.status(200).json({ success: true, message: savedMessage });
      }
      
      case 'get_chat_history': {
        const { myAddress, with: otherAddress } = data;
        
        // Lấy lịch sử chat
        const history = await getChatHistory(myAddress, otherAddress);
        
        // Gửi lịch sử chat
        await pusherServer.trigger(
          `private-${myAddress}`, 
          'chat_history', 
          { with: otherAddress, messages: history }
        );
        
        return res.status(200).json({ success: true });
      }
      
      case 'sync_contacts': {
        const { walletAddress, contacts } = data;
        
        // Lưu danh bạ
        await saveUserContacts(walletAddress, contacts);
        
        return res.status(200).json({ success: true });
      }
      
      case 'get_contacts': {
        const { walletAddress } = data;
        
        // Lấy danh bạ
        const contacts = await getUserContacts(walletAddress);
        
        // Gửi danh bạ
        await pusherServer.trigger(
          `private-${walletAddress}`, 
          'contacts_loaded', 
          contacts
        );
        
        return res.status(200).json({ success: true });
      }
      
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}