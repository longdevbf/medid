import { pusherServer } from '../../../lib/pusher';

export default async function handler(req, res) {
  const { socket_id, channel_name } = req.body;
  
  try {
    
    const authResponse = pusherServer.authorizeChannel(socket_id, channel_name);
    
    res.send(authResponse);
  } catch (error) {
    console.error('Pusher authorization error:', error);
    res.status(403).json({ error: 'Unauthorized' });
  }
}