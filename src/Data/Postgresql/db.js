// app/api/sql/db.js
import { Pool } from 'pg';

let pool;

// Initialize the pool on the server side only
if (typeof window === 'undefined') {
  pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_4ZS9aGWzMYUf@ep-mute-wind-a586yqah-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require',
    ssl: { rejectUnauthorized: false },
  });
}

export default pool;