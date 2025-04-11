import React, { useState } from 'react';
import { useWallet } from '@meshsdk/react';
import styles from '../../styles/doctor_lock.module.css';
import sendPortfolio from '../../utils/DoctorAction/utils/lock';
import { Asset } from '@meshsdk/core';

interface StatusMessage {
  title: string;
  message: string;
  type: 'success' | 'error';
  txHash?: string;
}

interface TransactionRecord {
  date: string;
  patientAddress: string;
  assetName: string;
  amount: string;
  status: string;
  txHash?: string;
}

const DoctorAssetLockPage: React.FC = () => {
  const { wallet, connected } = useWallet();
  const [policyId, setPolicyId] = useState<string>('');
  const [assetName, setAssetName] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [patientAddress, setPatientAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<TransactionRecord[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connected) {
      setStatusMessage({
        title: 'Lỗi Kết Nối',
        message: 'Vui lòng kết nối ví Cardano trước khi thực hiện giao dịch.',
        type: 'error'
      });
      return;
    }

    if (!policyId || !assetName || amount <= 0 || !patientAddress) {
      setStatusMessage({
        title: 'Thông tin không đầy đủ',
        message: 'Vui lòng nhập đầy đủ các trường thông tin.',
        type: 'error'
      });
      return;
    }

    if (!patientAddress.startsWith('addr')) {
      setStatusMessage({
        title: 'Địa chỉ không hợp lệ',
        message: 'Địa chỉ ví bệnh nhân phải là địa chỉ Cardano hợp lệ (bắt đầu bằng addr).',
        type: 'error'
      });
      return;
    }

    try {
      setLoading(true);
      setStatusMessage({
        title: 'Đang xử lý',
        message: 'Đang thực hiện giao dịch, vui lòng không đóng cửa sổ...',
        type: 'success'
      });

      // Sử dụng trực tiếp policyId và assetName, không chuyển đổi
      const unit = `${policyId}${assetName}`;
      
      console.log("Unit được tạo:", unit);
      
      // Tạo asset object cho giao dịch
      const assets: Asset[] = [
        {
          unit: unit,
          quantity: '1'
        }
        
      ];
      
      console.log("Assets trước khi gọi sendPortfolio:", assets);
      
      // Gọi hàm sendPortfolio - truyền chính xác giá trị người dùng đã nhập
      const txHash = await sendPortfolio(wallet, assets, patientAddress, amount);
      
      // Thêm vào lịch sử giao dịch
      const newTransaction: TransactionRecord = {
        date: new Date().toLocaleDateString(),
        patientAddress: patientAddress, // Giữ nguyên địa chỉ đầy đủ
        assetName: assetName, // Giữ nguyên tên tài sản
        amount: amount.toString(),
        status: 'active',
        txHash: txHash
      };
      
      setTransactionHistory([newTransaction, ...transactionHistory]);
      
      // Hiển thị thông báo thành công
      setStatusMessage({
        title: 'Giao Dịch Thành Công',
        message: `Tài sản đã được khóa thành công với yêu cầu thanh toán ${amount} ADA từ bệnh nhân.`,
        type: 'success',
        txHash: txHash
      });
      
    } catch (error) {
      console.error('Lỗi khi lock tài sản:', error);
      setStatusMessage({
        title: 'Giao Dịch Thất Bại',
        message: `Đã xảy ra lỗi: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>Doctor Asset Lock</h1>
          <p className={styles.heroText}>Secure patient payment processing through blockchain-based asset locking</p>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.assetLockContainer}>
            <div className={styles.assetLockForm}>
              <h3 className={styles.formTitle}>Lock Patient Payment Assets</h3>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="policyId" className={styles.formLabel}>Policy ID</label>
                  <input 
                    type="text" 
                    id="policyId" 
                    className={styles.formInput} 
                    placeholder="Enter blockchain policy ID"
                    value={policyId}
                    onChange={(e) => setPolicyId(e.target.value)}
                    required
                  />
                  <p className={styles.formHelp}>The unique identifier for the blockchain policy</p>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="assetName" className={styles.formLabel}>Asset Name</label>
                  <input 
                    type="text" 
                    id="assetName" 
                    className={styles.formInput} 
                    placeholder="Enter asset name"
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    required
                  />
                  <p className={styles.formHelp}>The name of the asset to be locked for payment</p>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="amount" className={styles.formLabel}>Payment Amount (ADA)</label>
                  <input 
                    type="number" 
                    id="amount" 
                    className={styles.formInput} 
                    placeholder="Enter amount to be paid"
                    value={amount || ''}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    min="0"
                    step="0.1"
                    required
                  />
                  <p className={styles.formHelp}>The required payment amount in ADA for medical services</p>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="patientAddress" className={styles.formLabel}>Patient Wallet Address</label>
                  <input 
                    type="text" 
                    id="patientAddress" 
                    className={styles.formInput} 
                    placeholder="Enter patient Cardano wallet address"
                    value={patientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
                    required
                  />
                  <p className={styles.formHelp}>The Cardano wallet address of the patient</p>
                </div>

                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Lock Asset'}
                </button>
              </form>

              {statusMessage && (
                <div className={`${styles.statusMessage} ${styles[statusMessage.type]}`}>
                  <h4>{statusMessage.title}</h4>
                  <p>{statusMessage.message}</p>
                  {statusMessage.txHash && (
                    <div className={styles.txDetails}>
                      <p><strong>Transaction ID:</strong></p>
                      <a
                        href={`https://preprod.cardanoscan.io/transaction/${statusMessage.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.txLink}
                      >
                        {statusMessage.txHash}
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Process Steps */}
            <div className={styles.processSteps}>
              <h3 className={styles.stepsTitle}>How Asset Locking Works</h3>
              <div className={styles.stepsContainer}>
                {['Submit Details', 'Blockchain Verification', 'Patient Payment', 'Asset Release'].map((title, index) => (
                  <div className={styles.step} key={index}>
                    <div className={styles.stepNumber}>{index + 1}</div>
                    <h4 className={styles.stepTitle}>{title}</h4>
                    <p className={styles.stepDescription}>
                      {[
                        'Enter policy ID, asset name, and payment amount',
                        'Smart contract validates the transaction details',
                        'Patient completes payment through secure blockchain wallet',
                        'Funds are released to healthcare provider',
                      ][index]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction History - Chỉ hiển thị giao dịch thực tế đã thực hiện */}
            {transactionHistory.length > 0 && (
              <div className={styles.transactionHistory}>
                <h3 className={styles.historyTitle}>Transaction History</h3>
                <table className={styles.historyTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Patient Address</th>
                      <th>Asset</th>
                      <th>Amount (ADA)</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionHistory.map((tx, i) => (
                      <tr key={i} className={styles.historyTableRow}>
                        <td>{tx.date}</td>
                        <td title={tx.patientAddress}>
                          {tx.patientAddress.length > 20 
                            ? `${tx.patientAddress.substring(0, 10)}...${tx.patientAddress.substring(tx.patientAddress.length - 10)}`
                            : tx.patientAddress}
                        </td>
                        <td>{tx.assetName}</td>
                        <td>{tx.amount}</td>
                        <td>
                          <span className={`${styles.status} ${tx.status === 'active' ? styles.statusActive : styles.statusCompleted}`}>
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          {tx.txHash && (
                            <a
                              href={`https://preprod.cardanoscan.io/transaction/${tx.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.viewLink}
                              title="View on Blockchain Explorer"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12" y2="8"></line>
                              </svg>
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorAssetLockPage;