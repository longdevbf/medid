import React, { useState, useEffect } from "react";
import { useWallet } from '@meshsdk/react';
import styles from "./unlock.module.css";
import unlockAndPaymentPortfolio from "../../../utils/DoctorAction/utils/unlock";
import { getPatientUnlockTransactions, saveTransaction, updateTransaction, getTransactionsByAddress } from "../../../service/transactionService";
import { getUserByWallet } from "../../../service/userService";

interface Transaction {
  id: number;
  txHash: string;
  amount: number;
  from_address: string;
  to_address: string[];
  unit: string;
  transaction_type: string;
  current_type: string;
  create_at: string;
}

// Add this interface after the Transaction interface
interface User {
  id: number;
  name?: string;
  email?: string;
  wallet_address?: string;
  public_key?: string;
  role?: string;
  did_number?: string;
  created_at?: string;
  updated_at?: string;
}

const Unlock: React.FC = () => {
    const { wallet, connected } = useWallet();
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [unlockHistory, setUnlockHistory] = useState<Transaction[]>([]);
    const [loadingTx, setLoadingTx] = useState<boolean>(false);
    const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
    const [processingTx, setProcessingTx] = useState<string | null>(null);
    // Replace any with the User interface
    const [userInfo, setUserInfo] = useState<User | null>(null);

    // Lấy danh sách giao dịch hợp lệ khi kết nối ví
    useEffect(() => {
        async function fetchTransactions() {
            if (!connected || !wallet) return;
            
            try {
                setLoadingTx(true);
                setLoadingHistory(true);
                setError("");
                const patientAddress = await wallet.getChangeAddress();
                console.log("Fetching transactions for patient address:", patientAddress);
                
                // Lấy thông tin bệnh nhân
                const user = await getUserByWallet(patientAddress);
                if (user) {
                    setUserInfo(user);
                    console.log("User info loaded:", user.id);
                }
                
                // Lấy danh sách giao dịch có thể unlock
                const txs = await getPatientUnlockTransactions(patientAddress);
                console.log("Found eligible transactions:", txs.length);
                setTransactions(txs);

                // Lấy lịch sử các giao dịch đã unlock
                const history = await getTransactionsByAddress(patientAddress, 'patient_unlock');
                console.log("Found unlock history:", history.length);
                setUnlockHistory(history);
            } catch (err) {
                console.error('Error fetching transactions:', err);
                setError('Failed to load record data. Please try again.');
            } finally {
                setLoadingTx(false);
                setLoadingHistory(false);
            }
        }
        
        fetchTransactions();
    }, [connected, wallet]);

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    // Handle unlock for a specific transaction
    const handleUnlock = async (tx: Transaction) => {
        if (!connected) {
            setError("Please connect your Cardano wallet first");
            return;
        }

        if (!tx.txHash) {
            setError("Transaction hash is missing or invalid");
            return;
        }
        
        console.log("Attempting to unlock transaction with hash:", tx.txHash);
        
        setLoading(true);
        setProcessingTx(tx.txHash);
        setError("");
        setSuccess("Verifying transaction on blockchain...");
        
        try {
            // 1. Call the unlock function with wallet and transaction hash
            const resultTxHash = await unlockAndPaymentPortfolio(wallet, tx.txHash);
            
            // 2. Get patient's wallet address
            const patientAddress = await wallet.getChangeAddress();
            
            // 3. Save new unlock transaction
            const unlockTx = {
                userId: userInfo?.id || null,
                txHash: resultTxHash,
                amount: tx.amount || 1,
                fromAddress: patientAddress,
                toAddress: [tx.from_address], // Doctor's address
                unit: tx.unit,
                transactionType: 'patient_unlock',
                currentType: 'unlock'
            };
            
            await saveTransaction(unlockTx);
            
            // 4. Update original transaction to 'unlocked'
            await updateTransaction(tx.id, 'unlocked');
            
            // 5. Update UI
            setSuccess(`Transaction processed successfully! Your medical records are now unlocked. Transaction ID: ${resultTxHash}`);
            
            // 6. Remove the unlocked transaction from the list
            setTransactions(transactions.filter(t => t.id !== tx.id));
            
            // 7. Add to unlock history
            setUnlockHistory(prevHistory => [
                {
                    id: Date.now(), // Temporary ID until refresh
                    txHash: resultTxHash,
                    amount: tx.amount || 1,
                    from_address: patientAddress,
                    to_address: [tx.from_address],
                    unit: tx.unit,
                    transaction_type: 'patient_unlock',
                    current_type: 'unlock',
                    create_at: new Date().toISOString()
                },
                ...prevHistory
            ]);
            
            // 8. Display blockchain link
            const txLink = document.getElementById('tx-success-link');
            if (txLink) {
                txLink.innerHTML = `<a href="https://preprod.cardanoscan.io/transaction/${resultTxHash}" target="_blank" rel="noopener noreferrer" class="${styles.txLink}">View on Cardanoscan <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>`;
            }
        } catch (error) {
            console.error("Error unlocking assets:", error);
            setError(`Transaction processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
            setProcessingTx(null);
        }
    };

    return (
        <section className={styles["main-content"]}>
            <div className="container">
                <div className={styles["unlock-card"]}>
                    <h2>Medical Record Unlock</h2>
                    
                    {!connected && (
                        <div className={styles["wallet-warning"]}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <p>Please connect your Cardano wallet to unlock medical records</p>
                        </div>
                    )}
                    
                    {connected && (
                        <>
                            <div className={styles["transactions-section"]}>
                                <h3>Available Records to Unlock</h3>
                                
                                {loadingTx ? (
                                    <div className={styles.loading}>
                                        <div className={styles.spinner}></div>
                                        <p>Loading available records...</p>
                                    </div>
                                ) : transactions.length > 0 ? (
                                    <div className={styles["transactions-list"]}>
                                        <table className={styles["transactions-table"]}>
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Doctor Address</th>
                                                    <th>Record ID</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactions.map(tx => (
                                                    <tr key={tx.id} className={styles["transaction-item"]}>
                                                        <td>{formatDate(tx.create_at)}</td>
                                                        <td className={styles.address}>
                                                            {tx.from_address.substring(0, 8)}...{tx.from_address.substring(tx.from_address.length - 8)}
                                                        </td>
                                                        <td className={styles.unitId}>
                                                            {tx.unit.substring(0, 10)}...
                                                        </td>
                                                        <td>
                                                            <button
                                                                onClick={() => handleUnlock(tx)}
                                                                disabled={loading || processingTx === tx.txHash}
                                                                className={styles["unlock-tx-btn"]}
                                                            >
                                                                {processingTx === tx.txHash ? 'Processing...' : 'Unlock Record'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className={styles["no-records"]}>
                                        <p>No records available to unlock. You might not have any locked records or they may have already been unlocked.</p>
                                    </div>
                                )}
                            </div>

                            {/* Phần hiển thị lịch sử unlock */}
                            <div className={styles["history-section"]}>
                                <h3>Your Unlock History</h3>
                                
                                {loadingHistory ? (
                                    <div className={styles.loading}>
                                        <div className={styles.spinner}></div>
                                        <p>Loading unlock history...</p>
                                    </div>
                                ) : unlockHistory.length > 0 ? (
                                    <div className={styles["history-list"]}>
                                        <table className={styles["transactions-table"]}>
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Doctor Address</th>
                                                    <th>Record ID</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {unlockHistory.map(tx => (
                                                    <tr key={tx.id} className={styles["history-item"]}>
                                                        <td>{formatDate(tx.create_at)}</td>
                                                        <td className={styles.address}>
                                                            {tx.to_address[0]?.substring(0, 8)}...{tx.to_address[0]?.substring(tx.to_address[0]?.length - 8)}
                                                        </td>
                                                        <td className={styles.unitId}>
                                                            {tx.unit.substring(0, 10)}...
                                                        </td>
                                                        <td>
                                                            <span className={styles["status-completed"]}>Completed</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className={styles["no-records"]}>
                                        <p>No unlock history found. Once you unlock records, they will appear here.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    
                    {error && (
                        <div className={styles["error-message"]}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}
                    
                    {success && (
                        <div className={styles["success-message"]}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            <span>{success}</span>
                            <div id="tx-success-link" className={styles["tx-link-container"]}></div>
                        </div>
                    )}
                </div>

                {/* Phần còn lại giữ nguyên */}
                <div className={styles.features}>
                    <h2 className={styles["features-title"]}>
                        Blockchain Security Features
                    </h2>
                    <div className={styles["features-grid"]}>
                        <div className={styles["feature-card"]}>
                            <div className={styles["feature-icon"]}>
                                <span>🔒</span>
                            </div>
                            <h3>Secure Verification</h3>
                            <p>
                                Multi-layered authentication system with blockchain
                                validation to ensure data integrity and security.
                            </p>
                        </div>
                        <div className={styles["feature-card"]}>
                            <div className={styles["feature-icon"]}>
                                <span>⚡</span>
                            </div>
                            <h3>Instant Access</h3>
                            <p>
                                Access your medical records instantly after verification
                                with our optimized blockchain technology.
                            </p>
                        </div>
                        <div className={styles["feature-card"]}>
                            <div className={styles["feature-icon"]}>
                                <span>🛡️</span>
                            </div>
                            <h3>Privacy Protection</h3>
                            <p>
                                Complete control over your healthcare data with enhanced
                                privacy features and detailed access logs.
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className={styles["how-it-works"]}>
                    <h2>How Unlocking Works</h2>
                    <div className={styles["steps-container"]}>
                        <div className={styles.step}>
                            <div className={styles["step-number"]}>1</div>
                            <h3>Connect Wallet</h3>
                            <p>Connect your Cardano blockchain wallet to authenticate your identity</p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles["step-number"]}>2</div>
                            <h3>Select Record</h3>
                            <p>Choose from available locked records that doctors have prepared for you</p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles["step-number"]}>3</div>
                            <h3>Verify & Pay</h3>
                            <p>The smart contract verifies your credentials and processes the payment</p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles["step-number"]}>4</div>
                            <h3>Access Records</h3>
                            <p>After verification, your medical records are instantly unlocked</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Unlock;