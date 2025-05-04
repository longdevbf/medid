import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Phía server (API routes)
export const pusherServer = new Pusher({
  appId: "1986087",
  key: "b6f25bae8feb04b31a58",
  secret: "2ad5cc4a63274ffad99b",
  cluster: "ap1",
  useTLS: true
});

// Phía client (React components) - THÊM authEndpoint
export const pusherClient = new PusherClient("b6f25bae8feb04b31a58", {
  cluster: "ap1",
  authEndpoint: '/api/pusher/auth' 
});