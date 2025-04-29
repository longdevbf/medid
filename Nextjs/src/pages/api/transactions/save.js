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
      // CHANGE: Thay vì trả về lỗi 409, hãy cập nhật giao dịch hiện có
      const updateQuery = `
        UPDATE transactions 
        SET 
          user_id = COALESCE($1, user_id),
          amount = $2,
          from_address = $3,
          to_address = $4,
          unit = $5,
          transaction_type = $6,
          current_type = $7,
          update_at = NOW()
        WHERE id = $8
        RETURNING id
      `;
      
      const updateResult = await query(updateQuery, [
        userId || null,
        amount || 1,
        fromAddress,
        toAddress,
        unit,
        transactionType,
        currentType,
        checkResult.rows[0].id
      ]);
      
      return res.status(200).json({
        id: updateResult.rows[0].id,
        message: 'Transaction updated successfully',
        updated: true
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
      message: 'Transaction saved successfully',
      updated: false
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
}