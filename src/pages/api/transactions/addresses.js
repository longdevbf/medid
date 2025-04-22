import { query } from '../sql/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { fromAddress, type, currentType } = req.query;

    if (!fromAddress) {
      return res.status(400).json({ message: 'Missing from address' });
    }

    let sql = `
      SELECT 
        id, txHash, amount, from_address, to_address, unit, 
        transaction_type, current_type, create_at 
      FROM transactions 
      WHERE from_address = $1
    `;
    
    const params = [fromAddress];
    let paramCount = 1;
    
    if (type) {
      paramCount++;
      sql += ` AND transaction_type = $${paramCount}`;
      params.push(type);
    }
    
    if (currentType) {
      paramCount++;
      sql += ` AND current_type = $${paramCount}`;
      params.push(currentType);
    }
    
    sql += ` ORDER BY create_at DESC`;
    
    const result = await query(sql, params);
    return res.status(200).json(result.rows || []);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
}