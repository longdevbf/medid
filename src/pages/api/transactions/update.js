import { query } from '../sql/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { doctorAddress } = req.query;

    if (!doctorAddress) {
      return res.status(400).json({ message: 'Missing doctor address' });
    }

    // Tìm các giao dịch mà có địa chỉ bác sĩ trong mảng to_address
    // PostgreSQL có toán tử @> kiểm tra mảng có chứa giá trị không
    const sql = `
      SELECT 
        id, txHash, amount, from_address, to_address, unit, 
        transaction_type, current_type, create_at 
      FROM transactions 
      WHERE to_address @> ARRAY[$1]
      AND transaction_type = 'patient_lock'
      AND current_type = 'lock'
      ORDER BY create_at DESC
    `;
    
    const result = await query(sql, [doctorAddress]);
    return res.status(200).json(result.rows || []);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
}