import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config({ path: 'e:/medid/.env' });

console.log("Connection string:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("Kết nối thành công!");
    const result = await client.query('SELECT NOW()');
    console.log("Database timestamp:", result.rows[0]);
    client.release();
  } catch (error) {
    console.error("Lỗi kết nối:", error);
  } finally {
    pool.end();
  }
}

testConnection();