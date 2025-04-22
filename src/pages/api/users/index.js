import { query } from '../sql/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { walletAddress } = req.query;
    
    if (!walletAddress) {
      return res.status(400).json({ message: 'Missing wallet address' });
    }

    const sql = `
      SELECT * FROM users 
      WHERE wallet_address = $1
    `;
    
    const result = await query(sql, [walletAddress]);
    
    if (result.rows && result.rows.length > 0) {
      return res.status(200).json(result.rows[0]);
    }
    
    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
}