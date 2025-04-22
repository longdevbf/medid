import { query } from '../sql/db.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id, toAddress, newTxHash } = req.body;

    if (!id || !toAddress || !Array.isArray(toAddress) || !newTxHash) {
      return res.status(400).json({ message: 'Missing required parameters or invalid format' });
    }

    // Cập nhật cả to_address và txHash của giao dịch
    const updateQuery = `
      UPDATE transactions 
      SET to_address = $1, txHash = $2
      WHERE id = $3
      RETURNING id, txHash AS "txHash", to_address AS "to_address"
    `;
    
    const result = await query(updateQuery, [toAddress, newTxHash, id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    return res.status(200).json({ 
      message: 'Transaction updated successfully',
      transaction: result.rows[0]
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
}