import React, { useState, useEffect } from 'react';
import { useWallet } from '@meshsdk/react';
import styles from '../../styles/unlock.module.css';
import unlockPortfolio from '../../utils/PatientAction/unlock';
import { getDoctorTransactions, saveTransaction, updateTransaction } from '../../service/transactionService';
import { getUserByWallet } from '../../service/userService';
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

const DoctorUnlock = () => {
  // Wallet connection
  const { wallet, connected } = useWallet();
  
  // State variables
  const [isLoading, setIsLoading] = useState(false);
  const [unlockResult, setUnlockResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);
  const [processingTx, setProcessingTx] = useState<string | null>(null);

  // Fetch eligible transactions when wallet connects
  useEffect(() => {
    async function fetchTransactions() {
      if (!connected || !wallet) return;
      
      try {
        setLoadingTx(true);
        setError(null);
        const address = await wallet.getChangeAddress();
        console.log("Fetching transactions for doctor address:", address);
        const txs = await getDoctorTransactions(address);
        console.log("Found eligible transactions:", txs.length);
        
        // Thêm log để kiểm tra dữ liệu từng transaction
        if (txs.length > 0) {
          console.log("Sample transaction:", txs[0]);
          console.log("txHash available:", txs.map(tx => !!tx.txHash));
        }
        
        setTransactions(txs);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load eligible records. Please try again.');
      } finally {
        setLoadingTx(false);
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
      setError('Please connect your wallet first');
      return;
    }

    if (!tx.txHash) {
      setError('Transaction hash is missing or invalid');
      return;
    }
    
    console.log("Attempting to unlock transaction with hash:", tx.txHash);
    
    setIsLoading(true);
    setProcessingTx(tx.txHash);
    setError(null);
    setUnlockResult(null);
    setIsSuccess(false);
    
    try {
      // 1. Call the unlock function with wallet and transaction hash
      const result = await unlockPortfolio(wallet, tx.txHash);
      
      // 2. Lấy thông tin user của bác sĩ từ địa chỉ ví
      const doctorAddress = await wallet.getChangeAddress();
      const doctorInfo = await getUserByWallet(doctorAddress);
      
      // Kiểm tra bác sĩ đã được đăng ký trong hệ thống chưa
      if (!doctorInfo || !doctorInfo.id) {
        setError('Bạn cần đăng ký tài khoản trước khi mở khóa hồ sơ');
        setIsLoading(false);
        setProcessingTx(null);
        return;
      }
      
      // 3. Record the unlock transaction với userId của bác sĩ
      await saveTransaction({
        userId: doctorInfo.id, // Sử dụng ID của bác sĩ
        txHash: result,
        amount: 1,
        fromAddress: doctorAddress,
        toAddress: [tx.from_address],
        unit: tx.unit,
        transactionType: 'doctor_unlock',
        currentType: 'unlock'
      });
      
      // 4. Update the original lock transaction
      await updateTransaction(tx.id, 'unlocked');
      
      // 5. Update the UI
      setUnlockResult(result);
      setIsSuccess(true);
      
      // 6. Remove the unlocked transaction from the list
      setTransactions(transactions.filter(t => t.id !== tx.id));
      
    } catch (err) {
      console.error('Error unlocking records:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
      setProcessingTx(null);
    }
  };

  return (
    <>
      <section className={styles.hero}>
        <h1>Doctor Record Access</h1>
        <p>
          Securely unlock patient medical records with blockchain verification
        </p>
      </section>

      <div className={styles.unlockContainer}>
        <h2>Unlock Patient Records</h2>

        <div className={styles.unlockDescription}>
          <p>
            As a healthcare provider, you can access patient medical records
            securely through our blockchain-based system. The system automatically
            shows you records where you have been granted access. Select a record
            to unlock and decrypt the medical information.
          </p>
        </div>

        {!connected && (
          <div className={styles.walletWarning}>
            <p>Please connect your wallet to unlock patient records</p>
          </div>
        )}

        <div className={styles.recordsList}>
          <h3>Available Medical Records</h3>
          
          {loadingTx && (
            <div className={styles.loading}>
              <p>Loading available records...</p>
            </div>
          )}
          
          {!loadingTx && transactions.length === 0 && (
            <div className={styles.noRecords}>
              <p>No available records found. Patients must grant you access to their medical records first.</p>
            </div>
          )}
          
          {!loadingTx && transactions.length > 0 && (
            <div className={styles.recordsTable}>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Patient Address</th>
                    <th>Record ID</th>
                    <th>TxHash</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.id} className={styles.recordItem}>
                      <td>{formatDate(tx.create_at)}</td>
                      <td className={styles.address}>
                        {tx.from_address.substring(0, 8)}...{tx.from_address.substring(tx.from_address.length - 8)}
                      </td>
                      <td className={styles.unitId}>
                        {tx.unit.substring(0, 10)}...
                      </td>
                      <td className={styles.txHash}>
                        {/* Hiển thị TxHash để debug */}
                        <span title={tx.txHash}>{tx.txHash ? `${tx.txHash.substring(0, 6)}...` : 'Missing'}</span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleUnlock(tx)}
                          disabled={isLoading || processingTx === tx.txHash || !tx.txHash}
                          className={styles.unlockItemBtn}
                        >
                          {processingTx === tx.txHash ? 'Processing...' : 'Unlock Record'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <h3>Error</h3>
            <p>{error}</p>
            {error.includes('đăng ký tài khoản') && (
              <div className={styles.errorHint}>
                <p>Để sử dụng chức năng này, bạn cần:</p>
                <ol>
                  <li>Đăng ký làm người dùng trong hệ thống</li>
                  <li>Sử dụng cùng địa chỉ ví khi đăng nhập</li>
                </ol>
                <a href="/register" className={styles.registerBtn}>Đăng ký ngay</a>
              </div>
            )}
          </div>
        )}

        {isSuccess && unlockResult && (
          <div className={styles.successMessage}>
            <h3>Records Unlocked Successfully</h3>
            <p>Transaction ID: {unlockResult}</p>
            <p>You can now view the patient&apos;s medical records</p>
          </div>
        )}

        <div className={styles.securityInfo}>
          <h3>Security Information</h3>
          <p>
            All access attempts are recorded on the blockchain for transparency
            and accountability. Patient data remains encrypted and is only
            decrypted temporarily for authorized viewing. Your account
            credentials and this transaction will be securely logged in
            compliance with healthcare regulations and data protection laws.
          </p>
        </div>

        <div className={styles.blockVisualization}>
          <div className={styles.blockChain}>
            <div className={styles.block}>Block #1</div>
            <div className={styles.arrow}>→</div>
            <div className={styles.block}>Block #2</div>
            <div className={styles.arrow}>→</div>
            <div className={styles.block}>Block #3</div>
            <div className={styles.arrow}>→</div>
            <div className={styles.block}>Block #n</div>
          </div>
          <div className={styles.blockInfo}>
            <p>Medical records are encrypted</p>
            <p>Data is securely stored and centrally accessible</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorUnlock;