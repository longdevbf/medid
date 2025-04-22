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

// Hàm cập nhật kích thước cột unit từ VARCHAR(50) thành VARCHAR(255)
async function updateUnitColumnSize() {
  try {
    console.log("Updating 'unit' column size in transactions table...");
    
    // Kiểm tra xem bảng transactions có tồn tại không
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'transactions'
      );
    `;
    
    const tableExists = await db.query(checkTableQuery);
    
    if (!tableExists.rows[0].exists) {
      console.log("Transactions table does not exist yet. No need to update.");
      return { success: true, message: "Table does not exist yet" };
    }
    
    // Kiểm tra kích thước hiện tại của cột unit
    const checkColumnQuery = `
      SELECT character_maximum_length 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'transactions' 
      AND column_name = 'unit';
    `;
    
    const columnInfo = await db.query(checkColumnQuery);
    
    if (columnInfo.rows.length === 0) {
      console.log("Column 'unit' does not exist in transactions table.");
      return { success: false, message: "Column does not exist" };
    }
    
    const currentLength = columnInfo.rows[0].character_maximum_length;
    console.log(`Current 'unit' column length: ${currentLength}`);
    
    if (currentLength >= 255) {
      console.log("Column 'unit' already has sufficient length. No update needed.");
      return { success: true, message: "Already updated" };
    }
    
    // Thực hiện cập nhật kích thước cột
    const alterQuery = `
      ALTER TABLE transactions 
      ALTER COLUMN unit TYPE VARCHAR(255);
    `;
    
    await db.query(alterQuery);
    console.log("Successfully updated 'unit' column to VARCHAR(255)");
    
    return { success: true, message: "Column updated successfully" };
  } catch (error) {
    console.error("Error updating unit column size:", error);
    return { success: false, message: error.message };
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
    if (!initResult.success) {
      console.error("Database setup failed");
      return false;
    }
    
    console.log("Database setup completed successfully");
    return true;
  } catch (error) {
    console.error("Error during database setup:", error);
    return false;
  }
}

// Hàm chính để chạy test và cập nhật
async function runTests() {
  try {
    console.log("======= DATABASE TESTS AND UPDATES =======");
    
    // Test kết nối
    const connectionOk = await testConnection();
    if (!connectionOk) {
      throw new Error("Connection test failed");
    }
    
    // Kiểm tra và tạo cấu trúc database
    const setupOk = await setupDatabase();
    if (!setupOk) {
      throw new Error("Database setup failed");
    }
    
    // Cập nhật kích thước cột unit
    const updateResult = await updateUnitColumnSize();
    console.log("Unit column update result:", updateResult);
    
    // Đóng kết nối pool khi hoàn thành
    await db.pool.end();
    
    console.log("======= TESTS AND UPDATES COMPLETED =======");
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

// Hàm main để chạy trực tiếp từ command line
async function main() {
  const action = process.argv[2];
  
  if (action === 'update-unit') {
    // Chỉ chạy cập nhật cột unit
    try {
      await testConnection();
      const result = await updateUnitColumnSize();
      console.log("Update unit column result:", result);
      await db.pool.end();
      
      if (result.success) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    } catch (error) {
      console.error("Failed to update unit column:", error);
      process.exit(1);
    }
  } else {
    // Chạy toàn bộ test
    await runTests()
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
}

main();
// Export các hàm
export { testConnection, setupDatabase, updateUnitColumnSize, runTests };
export default { testConnection, setupDatabase, updateUnitColumnSize, runTests };