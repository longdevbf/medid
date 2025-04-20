import { query } from '../sql/db.js';
import { createUserTable } from '../sql/schema.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { walletAddress, pubKey, didNumber } = req.body;

    if (!walletAddress || !pubKey || !didNumber) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Đảm bảo bảng users đã được tạo
    await createUserTable();

    // Kiểm tra xem user đã tồn tại chưa
    const checkQuery = `
      SELECT id FROM users 
      WHERE wallet_address = $1 OR pubkey = $2
    `;
    const checkResult = await query(checkQuery, [walletAddress, pubKey]);

    if (checkResult.rows.length > 0) {
      return res.status(409).json({ 
        message: 'User already exists',
        id: checkResult.rows[0].id
      });
    }

    // Thêm user mới
    const insertQuery = `
      INSERT INTO users (wallet_address, pubkey, did_number)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    const insertResult = await query(insertQuery, [walletAddress, pubKey, didNumber]);

    return res.status(201).json({ 
      id: insertResult.rows[0].id,
      message: 'User saved successfully' 
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
}