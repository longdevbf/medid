import React, { useState } from 'react';
import styles from '../../styles/update.module.css';
import { useWallet } from '@meshsdk/react'; 
import { deserializeAddress } from '@meshsdk/core';
import { encryptData, decryptData } from '../../secret/encryptAndDecrypt';
import updateTokens from '../../utils/DoctorAction/utils/update';

type HistoryRecord = {
  date: string;
  nftName: string;
  diagnosisCode: string;
  treatmentCode: string;
  status: string;
};

const DoctorUpdateRecord = () => {
  const { wallet, connected } = useWallet();
  const [activeTab, setActiveTab] = useState('record-update');
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [resultMsg, setResultMsg] = useState<{ type: string; text: string }>({ type: '', text: '' });
  
  // Add encryption key states
  const [encryptionKey, setEncryptionKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [decodedData, setDecodedData] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string>('');

  const resetForm = () => {
    const form = document.getElementById('updateRecordForm') as HTMLFormElement | null;
    if (form) {
      form.reset();
    }
    setEncryptionKey('');
    setDecodedData(null);
    setResultMsg({ type: '', text: '' });
  };

  // Function to decrypt and view original data
  const handleDecrypt = () => {
    const form = document.getElementById('updateRecordForm') as HTMLFormElement | null;
    if (!form) return;

    const initialData = form.initialData.value;
    
    if (!initialData) {
      setResultMsg({ type: 'error', text: 'Please enter encrypted data in the initial data field' });
      return;
    }
    
    if (!encryptionKey) {
      setResultMsg({ type: 'error', text: 'Please enter the encryption key' });
      return;
    }
    
    try {
      // Try to decrypt the data
      const decrypted = decryptData(initialData, encryptionKey);
      
      if (!decrypted) {
        setResultMsg({ type: 'error', text: 'Invalid encryption key or corrupted data' });
        return;
      }
      
      // Parse and display the decrypted data
      const parsedData = JSON.parse(decrypted);
      setDecodedData(JSON.stringify(parsedData, null, 2));
      setResultMsg({ type: 'success', text: 'Data decrypted successfully. You may now add new examination data.' });
    } catch (error) {
      console.error('Decryption error:', error);
      setResultMsg({ type: 'error', text: 'Failed to decrypt data. Please check your encryption key.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!connected) {
      setResultMsg({ type: 'error', text: 'Vui lòng kết nối ví trước' });
      return;
    }
    
    const form = e.target as HTMLFormElement;

    const nftName = form.nftName.value;
    const patientAddress = form.patientAddress.value;
    const initialData = form.initialData.value;
    const examinationData = form.examinationData.value;
    const diagnosisCode = form.diagnosisCode.value;
    const treatmentCode = form.treatmentCode.value;

    if (!initialData) {
      setResultMsg({ type: 'error', text: 'Vui lòng nhập dữ liệu y tế mã hóa ban đầu' });
      return;
    }

    if (!encryptionKey) {
      setResultMsg({ type: 'error', text: 'Vui lòng nhập khóa mã hóa' });
      return;
    }

    if (!examinationData) {
      setResultMsg({ type: 'error', text: 'Vui lòng nhập dữ liệu khám mới' });
      return;
    }

    setIsLoading(true);
    setResultMsg({ type: 'info', text: 'Đang xử lý cập nhật hồ sơ y tế...' });

    try {
      // Tạo dữ liệu khám mới
      const now = new Date().toISOString();
      const updateData = {
        ngayKham: now,
        noiDungKham: examinationData,
        maChanDoan: diagnosisCode || 'N/A',
        maDieuTri: treatmentCode || 'N/A',
        bacSi: connected ? (await wallet.getUsedAddresses())[0] : 'Không xác định',
      };
      
      // Mã hóa riêng dữ liệu khám mới
      const encryptedUpdateData = encryptData(JSON.stringify(updateData), encryptionKey);
      
      // Lấy địa chỉ và khóa công khai
      const userAddress = await wallet.getChangeAddress();
      const { pubKeyHash: userPubKey } = deserializeAddress(userAddress);
      const patientPubKeyHash = deserializeAddress(patientAddress).pubKeyHash;

      // Chuẩn bị metadata với dữ liệu gốc và cập nhật mới
      const metadata = { 
        _pk: patientPubKeyHash,  // Dùng pubKeyHash của bệnh nhân, KHÔNG phải của bác sĩ
        name: nftName,
        image: "ipfs://bafkreibfxbxtpo4c27f6aa5zgjnmip74jesr3di4mzninbttxzgwaxu53u",
        mediaType: "image/png",
        description: "Hồ sơ y tế đã cập nhật",
        originalinfo: initialData,     // Giữ nguyên dữ liệu ban đầu
        update1: encryptedUpdateData,  // Thêm dữ liệu mới được mã hóa riêng
        capNhatLuc: now,
        capNhatBoi: userPubKey
      };

      console.log("Metadata để cập nhật:", metadata);
      
      // Cập nhật token trên blockchain
      const txResult = await updateTokens(
        wallet,
        [{ assetName: nftName, metadata }],
        { address: patientAddress, pubKeyHash: patientPubKeyHash }
      );
      
      // Ghi nhận cập nhật thành công
      setTxHash(txResult);
      
      const newRecord: HistoryRecord = {
        date: new Date().toLocaleString(),
        nftName,
        diagnosisCode: diagnosisCode || 'N/A',
        treatmentCode: treatmentCode || 'N/A',
        status: 'Đã xác nhận'
      };

      setHistory([newRecord, ...history]);
      setResultMsg({
        type: 'success',
        text: 'Cập nhật hồ sơ y tế thành công! Giao dịch đã được gửi lên blockchain.'
      });

    } catch (error) {
      console.error('Lỗi khi cập nhật hồ sơ:', error);
      setResultMsg({ 
        type: 'error', 
        text: `Lỗi: ${error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={styles.banner}>
        <h1>Doctor Medical Record Update</h1>
        <p>Update patient medical records and examination data on the blockchain</p>
      </div>
      <div className={styles.doctorContainer}>
        <div className={styles.card}>
          <div className={styles.infoText}>
            As an authorized healthcare provider, you can update patient medical records on the blockchain. 
            Enter the encrypted initial data, then add your new examination findings. The system will merge 
            and re-encrypt the data for blockchain storage.
          </div>
          
          <div className={styles.tabContainer}>
            <ul className={styles.tabs}>
              <li className={activeTab === 'record-update' ? styles.activeTab : ''} onClick={() => setActiveTab('record-update')}>Record Update</li>
              <li className={activeTab === 'history' ? styles.activeTab : ''} onClick={() => setActiveTab('history')}>Update History</li>
            </ul>
          </div>

          {activeTab === 'record-update' && (
            <form id="updateRecordForm" onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="nftName">Patient NFT Name:</label>
                <input type="text" id="nftName" name="nftName" placeholder="Patient NFT Identifier" required />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="patientAddress">Patient Blockchain Address:</label>
                <input 
                  type="text" 
                  id="patientAddress" 
                  name="patientAddress" 
                  placeholder="addr1..." 
                  required 
                />
                <small className={styles.formHelp}>Enter the Cardano address of the patient</small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="encryptionKey">Encryption Key:</label>
                <input 
                  type="password" 
                  id="encryptionKey" 
                  placeholder="Enter the patient's encryption key" 
                  value={encryptionKey}
                  onChange={(e) => setEncryptionKey(e.target.value)}
                  required 
                />
                <small className={styles.formHelp}>This key is needed to decrypt and re-encrypt the patient data</small>
              </div>

              <div className={styles.twoColumns}>
                <div className={styles.formGroup}>
                  <label htmlFor="initialData">Encrypted Medical Data:</label>
                  <textarea 
                    id="initialData" 
                    name="initialData" 
                    placeholder="Paste the encrypted medical data here" 
                    required 
                  />
                  <small className={styles.formHelp}>Paste the encrypted data from the patient's record</small>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="examinationData">New Examination Data:</label>
                  <textarea 
                    id="examinationData" 
                    name="examinationData" 
                    placeholder="Enter new examination findings, test results, and treatment recommendations" 
                    required 
                  />
                </div>
              </div>

              <div className={styles.twoColumns}>
                <div className={styles.formGroup}>
                  <label htmlFor="diagnosisCode">Diagnosis Code:</label>
                  <input type="text" id="diagnosisCode" name="diagnosisCode" placeholder="ICD-10 Code" />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="treatmentCode">Treatment Code:</label>
                  <input type="text" id="treatmentCode" name="treatmentCode" placeholder="CPT/HCPCS Code" />
                </div>
              </div>

              <div className={styles.btnGroup}>
                <button 
                  type="button" 
                  className={styles.btnSecondary} 
                  onClick={handleDecrypt}
                  disabled={isLoading}
                >
                  Decrypt Data
                </button>
                <button type="button" className={styles.btnSecondary} onClick={resetForm}>Reset</button>
                <button 
                  type="submit" 
                  className={styles.btn}
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Medical Record'}
                </button>
              </div>
              
              {decodedData && (
                <div className={styles.decodedDataSection}>
                  <h3>Decrypted Patient Data:</h3>
                  <pre className={styles.codeBlock}>{decodedData}</pre>
                </div>
              )}
            </form>
          )}

          {activeTab === 'history' && (
            <div>
              <h2>Update History</h2>
              <div className={styles.infoText}>
                Connect your account to view your update history. This will show all your recent medical record updates on the blockchain.
              </div>

              {history.length > 0 ? (
                <table className={styles.historyTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Patient NFT</th>
                      <th>Diagnosis Code</th>
                      <th>Treatment Code</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry, index) => (
                      <tr key={index}>
                        <td>{entry.date}</td>
                        <td>{entry.nftName}</td>
                        <td>{entry.diagnosisCode}</td>
                        <td>{entry.treatmentCode}</td>
                        <td><span style={{ color: '#2c762c' }}>{entry.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ marginTop: '20px' }}>No history records yet.</p>
              )}
            </div>
          )}

          {resultMsg.text && (
            <div className={`${styles.actionResult} ${styles[resultMsg.type]}`}>
              {resultMsg.text}
              {txHash && (
                <div className={styles.txHashContainer}>
                  <p>Transaction Hash: <a href={`https://preprod.cardanoscan.io/transaction/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a></p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorUpdateRecord;