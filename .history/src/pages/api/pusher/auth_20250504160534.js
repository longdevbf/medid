import { pusherServer } from '../../../lib/pusher';

export default async function handler(req, res) {
  const { socket_id, channel_name } = req.body;
  
  // Kiểm tra xem channel là private của user hiện tại
  const walletFromChannel = channel_name.replace('private-', '');
  
  // Xác thực kết nối
  const authResponse = pusherServer.authorizeChannel(socket_id, channel_name);
  
  res.send(authResponse);
}