import pg from 'pg';
const { Pool } = pg;

// Cấu hình kết nối PostgreSQL
const pool = new Pool({
  connectionString: 'postgresql://longdevDatabase_owner:npg_FjR3tHoasTU9@ep-twilight-art-a4vf2q7z-pooler.us-east-1.aws.neon.tech/longdevDatabase?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

// Kiểm tra kết nối
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Hàm truy vấn để tái sử dụng
const query = (text, params) => pool.query(text, params);

// Hàm kết nối trực tiếp
const getClient = async () => {
  const client = await pool.connect();
  const releaseClient = client.release;
  
  // Log khi client được release
  client.release = () => {
    console.log('Client released');
    return releaseClient.apply(client);
  };
  
  return client;
};

export { query, pool, getClient };
export default { query, pool, getClient };