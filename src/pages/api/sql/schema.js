import db from './db.js';

// Tạo bảng users
async function createUserTable() {
    const createUserTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            did_number VARCHAR(255) UNIQUE NOT NULL,
            wallet_address VARCHAR(255) UNIQUE NOT NULL,
            pubkey VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        console.log("Attempting to create user table...");
        const result = await db.query(createUserTableQuery);
        console.log("User table created successfully");
        return result;
    } catch(e) {
        console.error("Error creating user table", e);
        throw e;
    }
}

// Tạo bảng transactions
async function createTransactionTable() {
    const createdTransactionTableQuery = `
        CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            txHash VARCHAR(255) UNIQUE NOT NULL,
            amount DECIMAL(10, 2),
            from_address VARCHAR(255) NOT NULL,
            to_address VARCHAR(255)[] NOT NULL,
            unit VARCHAR(50),
            transaction_type VARCHAR(50) NOT NULL,
            current_type VARCHAR(50) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        console.log("Attempting to create transaction table...");
        const result = await db.query(createdTransactionTableQuery);
        console.log("Transaction table created successfully");
        return result;
    } catch(e) {
        console.error("Error creating transaction table", e);
        throw e;
    }
}

// Tạo bảng medical_records
async function createMedicalRecordTable() {
    const createMedicalRecordTableQuery = `
        CREATE TABLE IF NOT EXISTS medical_records (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            record_type VARCHAR(50) NOT NULL,
            content TEXT NOT NULL,
            issued_by VARCHAR(255),
            ipfs_hash VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        console.log("Attempting to create medical_records table...");
        const result = await db.query(createMedicalRecordTableQuery);
        console.log("Medical records table created successfully");
        return result;
    } catch(e) {
        console.error("Error creating medical_records table", e);
        throw e;
    }
}

// Hàm khởi tạo tất cả các bảng
async function initializeDatabase() {
    try {
        await createUserTable();
        await createTransactionTable();
        await createMedicalRecordTable();
        console.log("Database initialization completed successfully");
        return { success: true };
    } catch (error) {
        console.error("Database initialization error:", error);
        return { success: false, error };
    }
}

export { createUserTable, createTransactionTable, createMedicalRecordTable, initializeDatabase };
export default { createUserTable, createTransactionTable, createMedicalRecordTable, initializeDatabase };