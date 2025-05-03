import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medid';
const MONGODB_DB = process.env.MONGODB_DB || 'medid';

// Biến toàn cục để cache kết nối
let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // Nếu đã có kết nối, dùng lại
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Tạo kết nối mới
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(MONGODB_DB);

  // Lưu vào cache
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Hàm lấy collection messages
export async function getMessagesCollection() {
  const { db } = await connectToDatabase();
  return db.collection('messages');
}

// Hàm lưu tin nhắn mới
export async function saveMessage(message) {
  const collection = await getMessagesCollection();
  return collection.insertOne({
    ...message,
    read: false,
    createdAt: new Date()
  });
}

// Hàm lấy tin nhắn chưa đọc của một người dùng
export async function getUnreadMessages(walletAddress) {
  const collection = await getMessagesCollection();
  return collection.find({ 
    to: walletAddress,
    read: false 
  }).toArray();
}

// Hàm đánh dấu tin nhắn đã đọc
export async function markMessagesAsRead(messageIds) {
  const collection = await getMessagesCollection();
  return collection.updateMany(
    { _id: { $in: messageIds } },
    { $set: { read: true, readAt: new Date() } }
  );
}

// Hàm lấy lịch sử chat giữa hai người
export async function getChatHistory(address1, address2) {
  const collection = await getMessagesCollection();
  return collection.find({
    $or: [
      { from: address1, to: address2 },
      { from: address2, to: address1 }
    ]
  })
  .sort({ createdAt: 1 })
  .toArray();
}