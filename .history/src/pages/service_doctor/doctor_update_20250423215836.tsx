import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import styles from '../../styles/update.module.css';
import { useWallet } from '@meshsdk/react'; 
import { deserializeAddress } from '@meshsdk/core';
import { encryptData, decryptData } from '../../secret/encryptAndDecrypt';
import updateTokens from '../../utils/DoctorAction/utils/update';
import { PinataSDK } from "pinata";
import Image from 'next/image'; // Import Next.js Image component

// Define more specific types
type HistoryRecord = {
  date: string;
  nftName: string;
  diagnosisCode: string;
  treatmentCode: string;
  status: string;
};

// Replace 'Record<string, any>' with more specific types
interface PatientInfo {
  identifier?: string;
  name?: string;
  birthDate?: string;
  gender?: string;
}

interface EncounterData {
  date?: string;
  provider?: string;
  reason?: string;
  notes?: string;
  [key: string]: string | undefined;
}

interface ClinicalData {
  vitals?: {
    bloodPressure?: string;
    heartRate?: string;
    temperature?: string;
    [key: string]: string | undefined;
  };
  labResults?: Record<string, string>;
  observations?: string[];
  [key: string]: unknown;
}

interface MedicationData {
  name?: string;
  dosage?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: string | undefined;
}

interface ProcedureData {
  name?: string;
  date?: string;
  notes?: string;
  [key: string]: string | undefined;
}

interface SettingsData {
  permissions?: string[];
  preferences?: Record<string, boolean>;
  [key: string]: unknown;
}

interface UpdateData {
  ngayKham: string;
  noiDungKham: string;
  maChanDoan: string;
  maDieuTri: string;
  bacSi: string;
  newImages?: string[];
}

// Define a complete MedicalRecord interface
interface MedicalRecord {
  patient?: PatientInfo;
  encounter?: EncounterData;
  clinicalData?: ClinicalData;
  medication?: MedicationData;
  procedure?: ProcedureData;
  settings?: SettingsData;
  medicalImages?: string[];
  updates?: UpdateData[];
  [key: string]: unknown; // For any other fields we might not know about
}

const DoctorUpdateRecord = () => {
  const { wallet, connected } = useWallet();
  const [activeTab, setActiveTab] = useState('record-update');
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [resultMsg, setResultMsg] = useState<{ type: string; text: string }>({ type: '', text: '' });
  
  // Encryption key states
  const [encryptionKey, setEncryptionKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [decodedData, setDecodedData] = useState<MedicalRecord | string | null>(null);
  // Fixed variable used without reference by adding it to the handleDecrypt logs
  const [decodedDataUrl, setDecodedDataUrl] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string>('');
  
  // File handling state - Multiple Medical Images
  const [medicalFiles, setMedicalFiles] = useState<File[]>([]);
  const [medicalImageUrls, setMedicalImageUrls] = useState<string[]>([]);
  const [isDraggingMedical, setIsDraggingMedical] = useState<boolean>(false);
  const medicalFilesInputRef = useRef<HTMLInputElement>(null);
  console.log("Decode : ", decodedDataUrl);
  // Pinata configuration
  const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MzdkNzd" +
  "iZC1kMWY2LTQyMWUtOGY2MC01OTgwZTMyOTdhOTEiLCJlbWFpbCI6Imxvbmd0ZC5hNWs0OGd0YkBnbWF" +
  "pbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXN" +
  "pcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3V" +
  "udCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXM" +
  "iOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5Ijo" +
  "iZGNjYmY4MTA2ZDg1NjQzM2I1YWUiLCJzY29wZWRLZXlTZWNyZXQiOiIxZWM0YmE5YjQ3ZjllMjA1MzN" +
  "lYTFiYmM5MjZkODIzOTJjZTcxODYyOWZjMmMwZWZjOTBjMWRiYjAxYTljN2IzIiwiZXhwIjoxNzc0NTI" +
  "0MTMyfQ.IokET3UfMOUUe9EQaZ6y7iNOnJdKdu0rbzxeO0PKTSc";
  const pinataGateway = "emerald-managing-koala-687.mypinata.cloud";
  const pinata = new PinataSDK({ pinataJwt: JWT, pinataGateway: pinataGateway });

  const resetForm = () => {
    const form = document.getElementById('updateRecordForm') as HTMLFormElement | null;
    if (form) {
      form.reset();
    }
    setEncryptionKey('');
    setDecodedData(null);
    setDecodedDataUrl(null);
    setMedicalFiles([]);
    setMedicalImageUrls([]);
    setResultMsg({ type: '', text: '' });
  };

  // Handle multiple medical files upload
  const handleMedicalFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setMedicalFiles(selectedFiles);
      
      const newUrls: string[] = [];
      selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            newUrls.push(event.target.result);
            if (newUrls.length === selectedFiles.length) {
              setMedicalImageUrls(newUrls);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleMedicalDrag = (e: DragEvent<HTMLDivElement>, isDragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingMedical(isDragging);
  };

  const handleMedicalDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingMedical(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setMedicalFiles(droppedFiles);

      const newUrls: string[] = [];
      droppedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            newUrls.push(event.target.result);
            if (newUrls.length === droppedFiles.length) {
              setMedicalImageUrls(newUrls);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeMedicalFile = (index: number) => {
    const updatedFiles = [...medicalFiles];
    updatedFiles.splice(index, 1);
    setMedicalFiles(updatedFiles);

    const updatedUrls = [...medicalImageUrls];
    updatedUrls.splice(index, 1);
    setMedicalImageUrls(updatedUrls);
  };
  
  // Upload multiple medical files to Pinata
  const uploadMedicalFilesToPinata = async (): Promise<string[]> => {
    if (!medicalFiles.length) return [];

    try {
      const urlArray: string[] = [];
      setProcessingStep('Uploading new medical images to IPFS (0/' + medicalFiles.length + ')...');
      
      // Tải từng file lên riêng lẻ
      for (let i = 0; i < medicalFiles.length; i++) {
        const file = medicalFiles[i];
        setProcessingStep(`Uploading new medical image ${i+1}/${medicalFiles.length} to IPFS...`);
        
        // Upload file hiện tại lên Pinata
        const uploadResult = await pinata.upload.public.file(file);
        
        if (!uploadResult || !uploadResult.cid) {
          throw new Error(`Medical file ${i+1} upload failed`);
        }
        
        // Lưu URL gateway thay vì ipfs://CID
        urlArray.push(`https://${pinataGateway}/ipfs/${uploadResult.cid}`);
      }
      
      return urlArray;
    } catch (error) {
      console.error("Error uploading medical files to Pinata:", error);
      throw new Error("Failed to upload new medical images.");
    }
  };
  
  // Upload encrypted data to Pinata và trả về URL gateway
  const uploadEncryptedDataToPinata = async (encryptedData: string): Promise<string> => {
    try {
      setProcessingStep('Uploading encrypted updated data to IPFS...');
      // Create a blob with the encrypted data
      const encryptedBlob = new Blob([encryptedData], { type: 'application/json' });
      const encryptedFile = new File([encryptedBlob], `updated_medical_data_${Date.now()}.json`, { type: 'application/json' });
      
      // Upload the encrypted file to Pinata
      const uploadResult = await pinata.upload.public.file(encryptedFile);
      if (!uploadResult || !uploadResult.cid) {
        throw new Error("Encrypted data upload failed");
      }
      
      // Trả về URL gateway
      return `https://${pinataGateway}/ipfs/${uploadResult.cid}`;
    } catch (error) {
      console.error("Error uploading encrypted data to Pinata:", error);
      throw new Error("Failed to upload updated encrypted data.");
    }
  };

  // Function to decrypt with two-layer approach
  const handleDecrypt = async () => {
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
    
    setIsProcessing(true);
    setProcessingStep('Decrypting layer 1 - URL...');
    setResultMsg({ type: 'info', text: 'Decrypting data...' });
    
    try {
      // First decryption - Should produce a URL
      const decryptedUrl = decryptData(initialData, encryptionKey);
      
      if (!decryptedUrl || !decryptedUrl.startsWith('http')) {
        setResultMsg({ type: 'error', text: 'First decryption failed or did not return a URL. Check your encryption key.' });
        setIsProcessing(false);
        return;
      }
      
      setDecodedDataUrl(decryptedUrl);
      // Use the decoded URL in a log to avoid the unused variable warning
      console.log('Successfully decrypted URL:', decryptedUrl);
      
      setProcessingStep('Fetching data from decrypted URL...');
      
      // Fetch content from the URL
      const response = await fetch(decryptedUrl);
      const encryptedContent = await response.text();
      
      // Second decryption - The actual medical record data
      const medicalRecordData = decryptData(encryptedContent, encryptionKey);
      
      if (!medicalRecordData) {
        setResultMsg({ type: 'error', text: 'Second decryption failed. Data might be corrupted.' });
        setIsProcessing(false);
        return;
      }
      
      try {
        // Try parsing as JSON but don't require it
        const parsed = JSON.parse(medicalRecordData);
        setDecodedData(parsed);
        setResultMsg({ 
          type: 'success', 
          text: 'Data decrypted successfully. You can now add new examination data and medical images.' 
        });
      } catch {
        // Remove the unused parameter completely instead of using underscore
        // If not JSON, just set as string
        setDecodedData(medicalRecordData);
        setResultMsg({ 
          type: 'warning', 
          text: 'Data decrypted but JSON parsing failed. Data shown as raw text.' 
        });
      }
      
    } catch (error) {
      console.error('Decryption error:', error);
      setResultMsg({ 
        type: 'error', 
        text: `Failed to decrypt data: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
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
    
    if (!decodedData) {
      setResultMsg({ type: 'error', text: 'Vui lòng giải mã dữ liệu ban đầu trước khi cập nhật' });
      return;
    }

    setIsLoading(true);
    setIsProcessing(true);
    setResultMsg({ type: 'info', text: 'Đang xử lý cập nhật hồ sơ y tế...' });

    try {
      // Tải các ảnh y tế mới lên Pinata (nếu có)
      const newMedicalImageUrls = await uploadMedicalFilesToPinata();
      
      // Tạo dữ liệu khám mới
      const now = new Date().toISOString();
      const doctorAddress = connected ? (await wallet.getUsedAddresses())[0] : 'Không xác định';
      const updateData = {
        ngayKham: now,
        noiDungKham: examinationData,
        maChanDoan: diagnosisCode || 'N/A',
        maDieuTri: treatmentCode || 'N/A',
        bacSi: doctorAddress,
        newImages: newMedicalImageUrls,
      };
      
      // Kết hợp dữ liệu cũ và mới
      let combinedData;
      
      if (typeof decodedData === 'object' && decodedData !== null) {
        // Nếu là object, hợp nhất với update
        const oldMedicalImages = decodedData.medicalImages || [];
        
        // Copy dữ liệu cũ
        combinedData = {
          ...decodedData,
          // Thêm trường updates nếu chưa có, hoặc thêm vào mảng nếu đã có
          updates: decodedData.updates ? [...decodedData.updates, updateData] : [updateData],
          // Hợp nhất danh sách ảnh cũ và mới
          medicalImages: [...oldMedicalImages, ...newMedicalImageUrls]
        };
      } else {
        // Nếu không phải object, tạo object mới
        combinedData = {
          originalData: decodedData,
          updates: [updateData],
          medicalImages: newMedicalImageUrls
        };
      }
      
      setProcessingStep('Encrypting combined medical data...');
      // Mã hóa dữ liệu kết hợp
      const encryptedCombinedData = encryptData(JSON.stringify(combinedData), encryptionKey);
      
      // Tải dữ liệu được mã hóa lên Pinata để lấy URL
      const encryptedDataUrl = await uploadEncryptedDataToPinata(encryptedCombinedData);
      
      // Mã hóa URL để lưu vào metadata
      setProcessingStep('Adding additional security layer...');
      const doubleEncryptedUrl = encryptData(encryptedDataUrl, encryptionKey);
      
      // Lấy địa chỉ và khóa công khai
      const userAddress = await wallet.getChangeAddress();
      const { pubKeyHash: userPubKey } = deserializeAddress(userAddress);
      const patientPubKeyHash = deserializeAddress(patientAddress).pubKeyHash;

      // Chuẩn bị metadata mới với URL đã mã hóa hai lần
      const updatedMetadata = { 
        _pk: patientPubKeyHash,  // Dùng pubKeyHash của bệnh nhân
        name: nftName,
        image: "ipfs://bafkreibfxbxtpo4c27f6aa5zgjnmip74jesr3di4mzninbttxzgwaxu53u",
        mediaType: "image/png",
        description: "Hồ sơ y tế đã cập nhật",
        encryptedData: doubleEncryptedUrl,  // URL đã được mã hóa hai lần
        lastUpdateBy: userPubKey
      };

      console.log("Metadata để cập nhật:", updatedMetadata);
      
      setProcessingStep('Updating record on blockchain...');
      // Cập nhật token trên blockchain
      const txResult = await updateTokens(
        wallet,
        [{ assetName: nftName, metadata: updatedMetadata }],
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
      setIsProcessing(false);
      setProcessingStep('');
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
            First decrypt the existing data, then add your examination findings and new medical images. 
            The system will combine all information and securely store it on the blockchain.
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
                  placeholder="Enter the patient&apos;s encryption key" 
                  value={encryptionKey}
                  onChange={(e) => setEncryptionKey(e.target.value)}
                  required 
                />
                <small className={styles.formHelp}>This key is needed to decrypt and re-encrypt the patient&apos;s data</small>
              </div>

              <div className={styles.twoColumns}>
                <div className={styles.formGroup}>
                  <label htmlFor="initialData">Encrypted Medical Data:</label>
                  <textarea 
                    id="initialData" 
                    name="initialData" 
                    placeholder="Paste the encrypted data from NFT metadata here" 
                    required 
                  />
                  <small className={styles.formHelp}>Paste the encryptedData field from the patient&apos;s NFT metadata</small>
                </div>

                <div className={styles.formGroup}>
                  <button 
                    type="button" 
                    className={styles.btnSecondary} 
                    onClick={handleDecrypt}
                    disabled={isLoading || isProcessing}
                    style={{ marginBottom: '10px' }}
                  >
                    {isProcessing ? 'Decrypting...' : 'Decrypt Data'}
                  </button>
                  {isProcessing && processingStep && (
                    <div className={styles.processingStepContainer || ''}>
                      <div className={styles.spinner || ''}></div>
                      <p>{processingStep}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {decodedData && (
                <>
                  {/* New medical images upload section */}
                  <div className={styles.formSection || ''}>
                    <h3>Upload New Medical Images</h3>
                    <p className={styles.sectionDesc || ''}>Upload new images from this examination to be added to the record</p>
                    <input
                      type="file"
                      id="medical-files-upload"
                      ref={medicalFilesInputRef}
                      onChange={handleMedicalFilesChange}
                      accept="image/*,.pdf"
                      className={styles.hiddenFileInput || ''}
                      style={{ display: 'none' }}
                      multiple
                    />
                    <div
                      className={`${styles.dropArea || ''} ${styles.medicalDropArea || ''} ${isDraggingMedical ? styles.dragActive || '' : ''}`}
                      onDragEnter={(e) => handleMedicalDrag(e, true)}
                      onDragOver={(e) => handleMedicalDrag(e, true)}
                      onDragLeave={(e) => handleMedicalDrag(e, false)}
                      onDrop={handleMedicalDrop}
                      onClick={() => medicalFilesInputRef.current?.click()}
                      style={{
                        border: '2px dashed #ccc',
                        padding: '20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        marginBottom: '15px',
                        backgroundColor: isDraggingMedical ? '#f5f5f5' : 'transparent',
                        minHeight: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <p>Drag and drop new medical images or click to browse</p>
                      <button 
                        type="button" 
                        className={styles.btnOutline || ''}
                        style={{
                          background: 'transparent',
                          border: '1px solid #0079a9',
                          padding: '8px 15px',
                          color: '#0079a9',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginTop: '10px'
                        }}
                      >
                        Choose Medical Files
                      </button>
                    </div>

                    {/* Display previews of selected medical files - Fix the img tag warning */}
                    {medicalImageUrls.length > 0 && (
                      <div className={styles.medicalImagesGrid || ''} style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: '10px',
                        marginTop: '15px'
                      }}>
                        {medicalImageUrls.map((url, index) => (
                          <div key={index} className={styles.medicalImageItem || ''} style={{
                            position: 'relative',
                            height: '120px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            {/* Replace img with Next.js Image component */}
                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                              <Image 
                                src={url} 
                                alt={`Medical file ${index + 1}`}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeMedicalFile(index)}
                              style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                background: 'rgba(0, 0, 0, 0.6)',
                                color: 'white',
                                border: 'none',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '10px',
                                zIndex: 10
                              }}
                            >
                              ✕
                            </button>
                            <span style={{
                              position: 'absolute',
                              bottom: '5px',
                              left: '5px',
                              background: 'rgba(0, 0, 0, 0.6)',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '10px',
                              fontSize: '10px',
                              zIndex: 10
                            }}>
                              {index + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
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
                  
                  <div className={styles.decodedDataSection || ''} style={{
                    marginTop: '20px',
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <h3>Decrypted Patient Data:</h3>
                    <pre className={styles.codeBlock || ''} style={{
                      backgroundColor: '#f1f1f1',
                      padding: '15px',
                      overflow: 'auto',
                      maxHeight: '400px',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}>
                      {typeof decodedData === 'object' 
                        ? JSON.stringify(decodedData, null, 2) 
                        : decodedData
                      }
                    </pre>
                  </div>

                  <div className={styles.btnGroup}>
                    <button type="button" className={styles.btnSecondary} onClick={resetForm}>Reset</button>
                    <button 
                      type="submit" 
                      className={styles.btn}
                      disabled={isLoading || isProcessing}
                    >
                      {isLoading ? 'Updating...' : 'Update Medical Record'}
                    </button>
                  </div>
                </>
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