import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://admin:long@mongodb.90ys5h9.mongodb.net/';
const MONGODB_DB = 'MongoDb';

// Biến toàn cục để cache kết nối
let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // Nếu đã có kết nối, dùng lại
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    // Tạo kết nối mới - đã loại bỏ các options không cần thiết
    console.log("Connecting to MongoDB Atlas...");
    const client = await MongoClient.connect(MONGODB_URI);
    
    const db = client.db(MONGODB_DB);
    console.log("Connected to MongoDB Atlas successfully!");

    // Lưu vào cache
    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error("MongoDB Connection error:", error);
    throw error;
  }
}

// Hàm lấy collection messages
export async function getMessagesCollection() {
  const { db } = await connectToDatabase();
  return db.collection('messages');
}

// Hàm lưu tin nhắn mới
export async function saveMessage(message) {
  const collection = await getMessagesCollection();
  const messageWithTimestamp = {
    ...message,
    read: false,
    createdAt: new Date(),
    timestamp: message.timestamp || new Date().toISOString()
  };
  console.log("Saving message to MongoDB:", messageWithTimestamp);
  return collection.insertOne(messageWithTimestamp);
}

// Hàm lấy tin nhắn chưa đọc của một người dùng
export async function getUnreadMessages(walletAddress) {
  const collection = await getMessagesCollection();
  console.log(`Getting unread messages for ${walletAddress}`);
  return collection.find({ 
    to: walletAddress,
    read: false 
  }).toArray();
}

// Hàm đánh dấu tin nhắn đã đọc
export async function markMessagesAsRead(messageIds) {
  const collection = await getMessagesCollection();
  console.log(`Marking messages as read: ${messageIds}`);
  return collection.updateMany(
    { _id: { $in: messageIds } },
    { $set: { read: true, readAt: new Date() } }
  );
}

// Hàm lấy lịch sử chat giữa hai người
export async function getChatHistory(address1, address2) {
  const collection = await getMessagesCollection();
  console.log(`Getting chat history between ${address1} and ${address2}`);
  return collection.find({
    $or: [
      { from: address1, to: address2 },
      { from: address2, to: address1 }
    ]
  })
  .sort({ createdAt: 1 })
  .toArray();
}
// Thêm vào các hàm xử lý contacts

// Hàm lưu danh bạ của người dùng
export async function saveUserContacts(walletAddress, contacts) {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('contacts');
      
      // Cập nhật hoặc tạo mới document contacts
      return collection.updateOne(
        { walletAddress },
        { $set: { contacts, updatedAt: new Date() } },
        { upsert: true }
      );
    } catch (error) {
      console.error('Error saving user contacts:', error);
      throw error;
    }
  }
  
  // Hàm lấy danh bạ của người dùng
  export async function getUserContacts(walletAddress) {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('contacts');
      
      const result = await collection.findOne({ walletAddress });
      return result ? result.contacts : [];
    } catch (error) {
      console.error('Error getting user contacts:', error);
      return [];
    }
  }