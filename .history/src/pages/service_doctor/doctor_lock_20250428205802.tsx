import React, { useState, useEffect } from 'react';
import { useWallet } from '@meshsdk/react';
import styles from '../../styles/doctor_lock.module.css';
import sendPortfolio from '../../utils/DoctorAction/lock';
import { Asset } from '@meshsdk/core';
import { getUserByWallet } from '../../service/userService';
import { saveTransaction } from '../../service/transactionService';

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

interface DoctorInfo {
  id: number;
  wallet_address: string;
  did_number: string;
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
  const [doctorInfo, setDoctorInfo] = useState<DoctorInfo | null>(null);

  // Tải thông tin bác sĩ khi wallet được kết nối
  useEffect(() => {
    const fetchDoctorInfo = async () => {
      if (!connected || !wallet) return;
      
      try {
        const address = await wallet.getChangeAddress();
        const doctor = await getUserByWallet(address);
        if (doctor) {
          setDoctorInfo(doctor);
          console.log("Đã lấy thông tin bác sĩ:", doctor.id);
        } else {
          console.log("Không tìm thấy thông tin bác sĩ cho địa chỉ:", address);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin bác sĩ:", error);
      }
    };

    fetchDoctorInfo();
  }, [connected, wallet]);

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
      
      // Lấy địa chỉ ví bác sĩ (fromAddress)
      const doctorAddress = await wallet.getChangeAddress();
      
      // Gọi hàm sendPortfolio - truyền chính xác giá trị người dùng đã nhập
      const txHash = await sendPortfolio(wallet, assets, patientAddress, amount);
      
      // Lưu vào cơ sở dữ liệu
      try {
        // Kiểm tra nếu bác sĩ chưa đăng ký
        if (!doctorInfo || !doctorInfo.id) {
          console.log("Bác sĩ chưa đăng ký, giao dịch vẫn lưu nhưng không có userId");
        }

        await saveTransaction({
          userId: doctorInfo?.id || null,
          txHash: txHash,
          amount: amount,
          fromAddress: doctorAddress,
          toAddress: [patientAddress],
          unit: unit,
          transactionType: 'doctor_lock',
          currentType: 'lock'
        });
        
        console.log("Đã lưu giao dịch vào cơ sở dữ liệu");
      } catch (saveError) {
        console.error("Lỗi khi lưu giao dịch vào cơ sở dữ liệu:", saveError);
        // Chỉ hiển thị cảnh báo, không dừng quy trình vì giao dịch blockchain đã thành công
      }
      
      // Thêm vào lịch sử giao dịch (hiển thị giao diện)
      const newTransaction: TransactionRecord = {
        date: new Date().toLocaleDateString(),
        patientAddress: patientAddress,
        assetName: assetName,
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

  // Phần return giữ nguyên
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
            {!connected && (
              <div className={styles.connectionWarning}>
                <p>Please connect your Cardano wallet to proceed</p>
              </div>
            )}
            
            {connected && !doctorInfo && (
              <div className={styles.registrationWarning}>
                <p>Warning: You aren&aspo;t registered as a doctor. Your transactions will be recorded but not linked to your account.</p>
                <a href="/register" className={styles.registerLink}>Register Now</a>
              </div>
            )}

            <div className={styles.assetLockForm}>
              <h3 className={styles.formTitle}>Lock Patient Payment Assets</h3>
              <form onSubmit={handleSubmit}>
                {/* Form fields remain unchanged */}
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

            {/* Process Steps and Transaction History remain unchanged */}
            <div className={styles.processSteps}>
              {/* Content unchanged */}
            </div>

            {transactionHistory.length > 0 && (
              <div className={styles.transactionHistory}>
                {/* Content unchanged */}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorAssetLockPage;