import { query } from '../sql/db.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id, currentType } = req.body;

    if (!id || !currentType) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Update the transaction's current_type
    const updateQuery = `
      UPDATE transactions 
      SET current_type = $1
      WHERE id = $2
      RETURNING id, current_type
    `;
    
    const result = await query(updateQuery, [currentType, id]);
    
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