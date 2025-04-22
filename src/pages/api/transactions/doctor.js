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

    // Sửa cách truy vấn - thêm alias để đảm bảo tên field đúng
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
      AND transaction_type = 'patient_lock'
      AND current_type = 'lock'
      AND txHash IS NOT NULL
      ORDER BY create_at DESC
    `;
    
    console.log("Doctor address:", doctorAddress);
    const result = await query(sql, [doctorAddress]);
    console.log("Found transactions:", result.rows.length);
    
    // Thêm log để debug
    if (result.rows.length > 0) {
      console.log("First transaction txHash:", result.rows[0].txHash);
      console.log("Sample transaction:", JSON.stringify(result.rows[0], null, 2));
    }
    
    return res.status(200).json(result.rows || []);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
}