import { query } from '../sql/db.js';


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, txHash, amount, fromAddress, toAddress, unit, transactionType, currentType } = req.body;

    if (!txHash || !fromAddress || !toAddress || !unit || !transactionType || !currentType) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Kiểm tra xem transaction đã tồn tại chưa
    const checkQuery = `SELECT id FROM transactions WHERE txHash = $1`;
    const checkResult = await query(checkQuery, [txHash]);

    if (checkResult.rows.length > 0) {
      return res.status(409).json({ 
        message: 'Transaction already exists',
        id: checkResult.rows[0].id
      });
    }

    // Thêm transaction mới
    const insertQuery = `
      INSERT INTO transactions (user_id, txHash, amount, from_address, to_address, unit, transaction_type, current_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;
    const insertResult = await query(insertQuery, [
      userId || null, 
      txHash, 
      amount || 1, 
      fromAddress, 
      toAddress, 
      unit, 
      transactionType, 
      currentType
    ]);

    return res.status(201).json({ 
      id: insertResult.rows[0].id,
      message: 'Transaction saved successfully' 
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
}