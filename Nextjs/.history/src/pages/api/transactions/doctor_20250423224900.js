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

    // Updated query to match transactions where the current address is in to_address
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
    
    console.log("Checking transactions for address:", doctorAddress);
    const result = await query(sql, [doctorAddress]);
    console.log("Found transactions:", result.rows.length);
    
    return res.status(200).json(result.rows || []);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
}