import { query } from '../sql/db.js';
import { createUserTable } from '../sql/schema.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { walletAddress, pubKey } = req.body;

    if (!walletAddress || !pubKey) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Đảm bảo bảng users đã được tạo
    await createUserTable();

    const sql = `
      SELECT did_number FROM users 
      WHERE wallet_address = $1 OR pubkey = $2
    `;
    
    const result = await query(sql, [walletAddress, pubKey]);
    
    if (result.rows && result.rows.length > 0) {
      return res.status(200).json({ 
        exists: true,
        didNumber: result.rows[0].did_number
      });
    }
    
    return res.status(200).json({ exists: false });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
}