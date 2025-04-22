import { query } from '../sql/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { patientAddress } = req.query;

    if (!patientAddress) {
      return res.status(400).json({ message: 'Missing patient address' });
    }

    // Tìm các giao dịch đến bệnh nhân với điều kiện:
    // - to_address chứa địa chỉ của bệnh nhân
    // - transaction_type là doctor_lock
    // - current_type là lock
    const sql = `
      SELECT 
        id, 
        txHash AS "txHash", 
        amount, 
        from_address AS "from_address", 
        to_address AS "to_address", 
        unit, 
        transaction_type AS "transaction_type", 
        current_type AS "current_type", 
        create_at AS "create_at" 
      FROM transactions 
      WHERE $1 = ANY(to_address)
      AND transaction_type = 'doctor_lock'
      AND current_type = 'lock'
      AND txHash IS NOT NULL
      ORDER BY create_at DESC
    `;
    
    console.log("Patient address:", patientAddress);
    const result = await query(sql, [patientAddress]);
    console.log("Found transactions for patient:", result.rows.length);
    
    return res.status(200).json(result.rows || []);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
}