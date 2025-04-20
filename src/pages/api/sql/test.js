import db from './db.js';
import { initializeDatabase } from './schema.js';

// Hàm test kết nối database
async function testConnection() {
  try {
    console.log("Testing database connection...");
    const result = await db.query('SELECT NOW() as time');
    console.log(`Database connection successful! Server time: ${result.rows[0].time}`);
    return true;
  } catch (error) {
    console.error("Database connection test failed:", error);
    return false;
  }
}

// Hàm kiểm tra và tạo bảng nếu chưa tồn tại
async function setupDatabase() {
  try {
    console.log("Setting up database...");
    
    // Kiểm tra kết nối
    const connectionSuccessful = await testConnection();
    if (!connectionSuccessful) {
      console.error("Cannot proceed with setup - connection failed");
      return false;
    }
    
    // Khởi tạo các bảng
    const initResult = await initializeDatabase();
    if (initResult.success) {
      console.log("Database setup completed successfully");
      return true;
    } else {
      console.error("Database setup failed");
      return false;
    }
  } catch (error) {
    console.error("Error during database setup:", error);
    return false;
  }
}

// Hàm chính để chạy test
async function runTests() {
  try {
    console.log("======= DATABASE TESTS =======");
    
    // Test kết nối
    await testConnection();
    
    // Kiểm tra và tạo cấu trúc database
    await setupDatabase();
    
    // Đóng kết nối pool khi hoàn thành
    await db.pool.end();
    
    console.log("======= TESTS COMPLETED =======");
    return true;
  } catch (error) {
    console.error("Test execution failed:", error);
    
    // Đảm bảo luôn đóng kết nối pool
    try {
      await db.pool.end();
    } catch (endError) {
      console.error("Error ending connection pool:", endError);
    }
    
    return false;
  }
}

// Chạy trực tiếp khi file này được thực thi
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests()
    .then(success => {
      if (success) {
        console.log("All tests passed!");
        process.exit(0);
      } else {
        console.error("Tests failed!");
        process.exit(1);
      }
    })
    .catch(error => {
      console.error("Unexpected error during tests:", error);
      process.exit(1);
    });
}

// Export các hàm
export { testConnection, setupDatabase, runTests };
export default { testConnection, setupDatabase, runTests };