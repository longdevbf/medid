import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import styles from './Hoso.module.css';
import { useWallet } from '@meshsdk/react';
import { deserializeAddress } from '@meshsdk/core';
import { encryptData } from '../../../secret/encryptAndDecrypt';
import mintNFT from '../../../utils/PatientAction/utils/mint';
import { PinataSDK } from "pinata";

const Hoso: React.FC = () => {
  // Wallet connection
  const { wallet, connected } = useWallet();
  
  // Form state - Patient Info
  const [patientId, setPatientId] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [patientDob, setPatientDob] = useState<string>('');
  const [patientGender, setPatientGender] = useState<string>('');
  
  // Form state - Encounter
  const [encounterDate, setEncounterDate] = useState<string>('');
  const [encounterType, setEncounterType] = useState<string>('');
  const [providerId, setProviderId] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  
  // Form state - Clinical Data
  const [condition, setCondition] = useState<string>('');
  const [conditionDesc, setConditionDesc] = useState<string>('');
  const [observation, setObservation] = useState<string>('');
  const [observationValue, setObservationValue] = useState<string>('');
  
  // Form state - Medication & Procedures
  const [medication, setMedication] = useState<string>('');
  const [medicationDose, setMedicationDose] = useState<string>('');
  const [procedure, setProcedure] = useState<string>('');
  const [procedureDesc, setProcedureDesc] = useState<string>('');
  
  // Form state - Blockchain Settings
  const [accessLevel, setAccessLevel] = useState<string>('patient-only');
  const [consentStatus, setConsentStatus] = useState<string>('granted');
  const [recordExpiry, setRecordExpiry] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  
  // Encryption key state
  const [encryptionKey, setEncryptionKey] = useState<string>('');
  const [confirmEncryptionKey, setConfirmEncryptionKey] = useState<string>('');
  
  // File handling state - NFT Cover Image
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');
  const [isDraggingCover, setIsDraggingCover] = useState<boolean>(false);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  
  // File handling state - Multiple Medical Images
  const [medicalFiles, setMedicalFiles] = useState<File[]>([]);
  const [medicalImageUrls, setMedicalImageUrls] = useState<string[]>([]);
  const [isDraggingMedical, setIsDraggingMedical] = useState<boolean>(false);
  const medicalFilesInputRef = useRef<HTMLInputElement>(null);
  
  // Transaction state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txStatus, setTxStatus] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [nftName, setNftName] = useState<string>('Medical Record NFT');
  
  // Process states
  const [processingStep, setProcessingStep] = useState<string>('');
  
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
  
  // Handle cover image upload
  const handleCoverFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setCoverFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setCoverImageUrl(event.target.result);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleCoverDrag = (e: DragEvent<HTMLDivElement>, isDragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingCover(isDragging);
  };

  const handleCoverDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingCover(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setCoverFile(droppedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setCoverImageUrl(event.target.result);
        }
      };
      reader.readAsDataURL(droppedFile);
    }
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
  
  // Upload cover image to Pinata
  const uploadCoverToPinata = async (): Promise<string> => {
    if (!coverFile) throw new Error("No cover image selected.");

    try {
      const uploadResult = await pinata.upload.public.file(coverFile);
      if (!uploadResult || !uploadResult.cid) {
        throw new Error("Cover image upload failed");
      }
      return `ipfs://${uploadResult.cid}`;
    } catch (error) {
      console.error("Error uploading cover to Pinata:", error);
      throw new Error("Failed to upload cover image.");
    }
  };
  
  // Sửa hàm uploadMedicalFilesToPinata để trả về URL gateway thay vì ipfs://CID
const uploadMedicalFilesToPinata = async (): Promise<string[]> => {
  if (!medicalFiles.length) throw new Error("No medical files selected.");

  try {
    const urlArray: string[] = [];
    setProcessingStep('Uploading medical files to IPFS (0/' + medicalFiles.length + ')...');
    
    // Tải từng file lên riêng lẻ
    for (let i = 0; i < medicalFiles.length; i++) {
      const file = medicalFiles[i];
      setProcessingStep(`Uploading medical file ${i+1}/${medicalFiles.length} to IPFS...`);
      
      
      
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
    throw new Error("Failed to upload medical files.");
  }
};
  
  // Upload encrypted data to Pinata và trả về URL gateway thay vì ipfs://CID
const uploadEncryptedDataToPinata = async (encryptedData: string): Promise<string> => {
  try {
    // Create a blob with the encrypted data
    const encryptedBlob = new Blob([encryptedData], { type: 'application/json' });
    const encryptedFile = new File([encryptedBlob], 'encrypted_medical_data.json', { type: 'application/json' });
    
    // Upload the encrypted file to Pinata
    const uploadResult = await pinata.upload.public.file(encryptedFile);
    if (!uploadResult || !uploadResult.cid) {
      throw new Error("Encrypted data upload failed");
    }
    
    // Trả về URL gateway thay vì ipfs://CID
    return `https://${pinataGateway}/ipfs/${uploadResult.cid}`;
  } catch (error) {
    console.error("Error uploading encrypted data to Pinata:", error);
    throw new Error("Failed to upload encrypted data.");
  }
};

  // Handle form submission
  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      setTxStatus('Please connect your wallet first');
      return;
    }
    
    if (!coverFile) {
      setTxStatus('Please upload a cover image for your Medical Record NFT');
      return;
    }
    
    if (!medicalFiles.length) {
      setTxStatus('Please upload at least one medical image/document');
      return;
    }
    
    if (!encryptionKey) {
      setTxStatus('Please enter an encryption key to secure medical information');
      return;
    }
    
    if (encryptionKey !== confirmEncryptionKey) {
      setTxStatus('Encryption keys do not match');
      return;
    }

    setIsLoading(true);
    setTxStatus('Processing your request...');
    
    try {
      // 1. Get wallet address and pubKeyHash
      setProcessingStep('Preparing wallet credentials...');
      const userAddress = await wallet.getChangeAddress();
      const { pubKeyHash: userPubKey } = deserializeAddress(userAddress);
      
      // 2. Upload cover image to Pinata
      setProcessingStep('Uploading cover image to IPFS...');
      const coverImageCid = await uploadCoverToPinata();
      
      // 3. Upload multiple medical files to Pinata - nhận về mảng CID
      setProcessingStep('Uploading medical documents to IPFS...');
      const medicalFileCids = await uploadMedicalFilesToPinata();
      
      // 4. Collect medical data
      setProcessingStep('Preparing medical data...');
      
      // Create structured medical record using HL7 FHIR concepts
      const medicalRecord = {
        resourceType: "Bundle",
        type: "document",
        timestamp: new Date().toISOString(),
        patient: {
          identifier: patientId,
          name: patientName,
          birthDate: patientDob,
          gender: patientGender
        },
        encounter: {
          date: encounterDate,
          type: encounterType,
          provider: providerId,
          location: location
        },
        clinicalData: {
          condition: condition,
          conditionDescription: conditionDesc,
          observation: observation,
          observationValue: observationValue
        },
        medication: {
          rxNorm: medication,
          dosage: medicationDose
        },
        procedure: {
          code: procedure,
          description: procedureDesc
        },
        settings: {
          accessLevel: accessLevel,
          consentStatus: consentStatus,
          recordExpiry: recordExpiry,
          additionalNotes: additionalNotes
        },
        // Include array of CIDs for medical images instead of a single CID
        medicalImages: medicalFileCids
      };
      
      // 5. Encrypt the combined medical record data
      setProcessingStep('Encrypting medical information...');
      const encryptedMedicalData = encryptData(JSON.stringify(medicalRecord), encryptionKey);
      console.log('Data encrypted successfully');
      
      // 6. Upload encrypted data to Pinata to get a URL
      setProcessingStep('Uploading encrypted data to IPFS...');
      const encryptedDataUrl = await uploadEncryptedDataToPinata(encryptedMedicalData);
      console.log('Encrypted data uploaded, URL:', encryptedDataUrl);

      // 7. Mã hóa thêm một lớp cho URL
      setProcessingStep('Adding additional security layer...');
      const doubleEncryptedUrl = encryptData(encryptedDataUrl, encryptionKey);
      console.log('URL additionally encrypted for metadata');
      
      // 8. Prepare metadata with pubKeyHash and link to encrypted data
      const metadata = {
        _pk: userPubKey,
        name: nftName,
        description: "CIP68 Medical Record Token with Encrypted Data",
        image: coverImageCid,  // Cover image for NFT display
        mediaType: coverFile.type || "image/png",
        encryptedData: doubleEncryptedUrl,  // URL đã được mã hóa hai lần
        version: "1.0",
        standard: "CIP68-FHIR",
        owner: userAddress
      };
      
      console.log('Metadata prepared with double encryption');
      
      // 9. Mint the NFT
      setProcessingStep('Minting your Medical Record NFT on the blockchain...');
      const result = await mintNFT(wallet, nftName, metadata, {});
      
      // 9. Update UI with success
      setTxHash(result);
      setTxStatus('Medical Record NFT minted successfully!');
      
    } catch (error) {
      console.error('Error minting NFT:', error);
      setTxStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      setProcessingStep('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <main className={styles.content}>
        <div className={styles['section-header']}>
          <h2>NFT Medical Record Minting</h2>
          <p>
            Create a secure, immutable medical record as an NFT using HL7 FHIR standards
          </p>
        </div>

        <div className={styles.card}>
          <form id="nft-mint-form" onSubmit={handleMint}>
            {/* NFT Cover Image Upload Section */}
            <div className={styles['form-section']}>
              <h3>NFT Cover Image</h3>
              <p className={styles.sectionDesc}>This image will be visible as the NFT cover in wallets and marketplaces</p>
              <input
                type="file"
                id="cover-file-upload"
                ref={coverFileInputRef}
                onChange={handleCoverFileChange}
                accept="image/*"
                className={styles.hiddenFileInput}
                style={{ display: 'none' }}
              />
              <div
                className={`${styles.dropArea} ${isDraggingCover ? styles.dragActive : ''}`}
                onDragEnter={(e) => handleCoverDrag(e, true)}
                onDragOver={(e) => handleCoverDrag(e, true)}
                onDragLeave={(e) => handleCoverDrag(e, false)}
                onDrop={handleCoverDrop}
                onClick={() => coverFileInputRef.current?.click()}
              >
                {coverImageUrl ? (
                  <div className={styles.imagePreview}>
                    <img src={coverImageUrl} alt="NFT Cover Preview" />
                  </div>
                ) : (
                  <>
                    <p>Drag and drop cover image or click to browse</p>
                    <button type="button" className={styles.btnOutline}>
                      Choose Cover Image
                    </button>
                  </>
                )}
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="nft-name">NFT Name</label>
                <input 
                  type="text" 
                  id="nft-name" 
                  placeholder="Enter a name for your Medical Record NFT"
                  value={nftName}
                  onChange={(e) => setNftName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Medical Documents Upload Section */}
            <div className={styles['form-section']}>
              <h3>Medical Documents</h3>
              <p className={styles.sectionDesc}>Upload multiple medical images or documents to be encrypted and stored</p>
              <input
                type="file"
                id="medical-files-upload"
                ref={medicalFilesInputRef}
                onChange={handleMedicalFilesChange}
                accept="image/*,.pdf"
                className={styles.hiddenFileInput}
                style={{ display: 'none' }}
                multiple
              />
              <div
                className={`${styles.dropArea} ${styles.medicalDropArea} ${isDraggingMedical ? styles.dragActive : ''}`}
                onDragEnter={(e) => handleMedicalDrag(e, true)}
                onDragOver={(e) => handleMedicalDrag(e, true)}
                onDragLeave={(e) => handleMedicalDrag(e, false)}
                onDrop={handleMedicalDrop}
                onClick={() => medicalFilesInputRef.current?.click()}
              >
                <p>Drag and drop medical files or click to browse</p>
                <button type="button" className={styles.btnOutline}>
                  Choose Medical Files
                </button>
              </div>

              {/* Display previews of selected medical files */}
              {medicalImageUrls.length > 0 && (
                <div className={styles.medicalImagesGrid}>
                  {medicalImageUrls.map((url, index) => (
                    <div key={index} className={styles.medicalImageItem}>
                      <img src={url} alt={`Medical file ${index + 1}`} />
                      <button 
                        type="button"
                        className={styles.removeImageBtn}
                        onClick={() => removeMedicalFile(index)}
                      >
                        ✕
                      </button>
                      <span className={styles.imageCounter}>{index + 1}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Encryption Settings */}
            <div className={styles['form-section']}>
              <h3>Encryption Settings</h3>
              <div className={styles['form-grid']}>
                <div className={styles['form-group']}>
                  <label htmlFor="encryption-key">Encryption Key (Password)</label>
                  <input 
                    type="password" 
                    id="encryption-key" 
                    placeholder="Create a strong encryption key"
                    value={encryptionKey}
                    onChange={(e) => setEncryptionKey(e.target.value)}
                    required
                  />
                  <small className={styles.formHelp}>
                    This key will be used to encrypt your medical data. Keep it safe - you&apso;ll need it to decrypt your information.
                  </small>
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="confirm-encryption-key">Confirm Encryption Key</label>
                  <input 
                    type="password" 
                    id="confirm-encryption-key" 
                    placeholder="Confirm your encryption key"
                    value={confirmEncryptionKey}
                    onChange={(e) => setConfirmEncryptionKey(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Patient Info - giữ nguyên */}
            <div className={styles['form-section']}>
              <h3>Patient Information</h3>
              <div className={styles['form-grid']}>
                {/* Patient Info fields giữ nguyên */}
                <div className={styles['form-group']}>
                  <label htmlFor="patient-id">Patient Identifier</label>
                  <input 
                    type="text" 
                    id="patient-id" 
                    placeholder="Enter patient identifier"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    required
                  />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="patient-name">Patient Name</label>
                  <input 
                    type="text" 
                    id="patient-name" 
                    placeholder="Full name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="patient-dob">Date of Birth</label>
                  <input 
                    type="date" 
                    id="patient-dob"
                    value={patientDob}
                    onChange={(e) => setPatientDob(e.target.value)}
                    required
                  />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="patient-gender">Gender</label>
                  <select 
                    id="patient-gender"
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Giữ nguyên các phần còn lại */}
            {/* Encounter */}
            <div className={styles['form-section']}>
              <h3>Encounter Information</h3>
              <div className={styles['form-grid']}>
                <div className={styles['form-group']}>
                  <label htmlFor="encounter-date">Encounter Date</label>
                  <input 
                    type="datetime-local" 
                    id="encounter-date"
                    value={encounterDate}
                    onChange={(e) => setEncounterDate(e.target.value)}
                    required
                  />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="encounter-type">Encounter Type</label>
                  <select 
                    id="encounter-type"
                    value={encounterType}
                    onChange={(e) => setEncounterType(e.target.value)}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="ambulatory">Ambulatory</option>
                    <option value="emergency">Emergency</option>
                    <option value="inpatient">Inpatient</option>
                    <option value="virtual">Virtual</option>
                  </select>
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="provider-id">Provider Identifier</label>
                  <input 
                    type="text" 
                    id="provider-id" 
                    placeholder="Provider NPI"
                    value={providerId}
                    onChange={(e) => setProviderId(e.target.value)}
                    required
                  />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="location">Location</label>
                  <input 
                    type="text" 
                    id="location" 
                    placeholder="Facility name"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Clinical Data */}
            <div className={styles['form-section']}>
              <h3>Clinical Data</h3>
              <div className={styles['form-grid']}>
                <div className={styles['form-group']}>
                  <label htmlFor="condition">Condition/Diagnosis (SNOMED CT)</label>
                  <input 
                    type="text" 
                    id="condition" 
                    placeholder="SNOMED CT code"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    required
                  />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="condition-desc">Diagnosis Description</label>
                  <input 
                    type="text" 
                    id="condition-desc" 
                    placeholder="Condition description"
                    value={conditionDesc}
                    onChange={(e) => setConditionDesc(e.target.value)}
                    required
                  />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="observation">Observation/Finding</label>
                  <input 
                    type="text" 
                    id="observation" 
                    placeholder="Observation code (LOINC)"
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    required
                  />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="observation-value">Observation Value</label>
                  <input 
                    type="text" 
                    id="observation-value" 
                    placeholder="Value with units"
                    value={observationValue}
                    onChange={(e) => setObservationValue(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Medication */}
            <div className={styles['form-section']}>
              <h3>Medication & Procedures</h3>
              <div className={styles['form-grid']}>
                <div className={styles['form-group']}>
                  <label htmlFor="medication">Medication (RxNorm)</label>
                  <input 
                    type="text" 
                    id="medication" 
                    placeholder="RxNorm code"
                    value={medication}
                    onChange={(e) => setMedication(e.target.value)}
                  />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="medication-dose">Dosage Instructions</label>
                  <input 
                    type="text" 
                    id="medication-dose" 
                    placeholder="Dose, frequency, route"
                    value={medicationDose}
                    onChange={(e) => setMedicationDose(e.target.value)}
                  />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="procedure">Procedure (CPT/HCPCS)</label>
                  <input 
                    type="text" 
                    id="procedure" 
                    placeholder="Procedure code"
                    value={procedure}
                    onChange={(e) => setProcedure(e.target.value)}
                  />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="procedure-desc">Procedure Description</label>
                  <input 
                    type="text" 
                    id="procedure-desc" 
                    placeholder="Description"
                    value={procedureDesc}
                    onChange={(e) => setProcedureDesc(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Blockchain Settings */}
            <div className={styles['form-section']}>
              <h3>Blockchain Record Settings</h3>
              <div className={styles['form-grid']}>
                <div className={styles['form-group']}>
                  <label htmlFor="access-level">Access Level</label>
                  <select 
                    id="access-level"
                    value={accessLevel}
                    onChange={(e) => setAccessLevel(e.target.value)}
                    required
                  >
                    <option value="patient-only">Patient Only</option>
                    <option value="treating-provider">Treating Providers</option>
                    <option value="research">Research (De-identified)</option>
                    <option value="emergency">Emergency Access</option>
                  </select>
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="consent-status">Consent Status</label>
                  <select 
                    id="consent-status"
                    value={consentStatus}
                    onChange={(e) => setConsentStatus(e.target.value)}
                    required
                  >
                    <option value="granted">Consent Granted</option>
                    <option value="restricted">Restricted Consent</option>
                    <option value="denied">Consent Denied</option>
                  </select>
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="record-expiry">Record Expiry (Optional)</label>
                  <input 
                    type="date" 
                    id="record-expiry"
                    value={recordExpiry}
                    onChange={(e) => setRecordExpiry(e.target.value)}
                  />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="additional-notes">Additional Notes</label>
                  <textarea 
                    id="additional-notes" 
                    placeholder="Any additional information..."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className={styles['btn-container']}>
              <button 
                type="submit" 
                className={styles['btn-mint']}
                disabled={isLoading || !connected}
              >
                {isLoading ? 'Processing...' : 'Mint Medical Record NFT'}
              </button>
            </div>
            
            {txStatus && (
              <div className={styles.txStatus}>
                <p>{txStatus}</p>
                {processingStep && (
                  <div className={styles.processingStep}>
                    <div className={styles.spinner}></div>
                    <p>{processingStep}</p>
                  </div>
                )}
                {txHash && (
                  <div className={styles.txHashContainer}>
                    <p><strong>Transaction Hash:</strong></p>
                    <a 
                      href={`https://preprod.cardanoscan.io/transaction/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.txHashLink}
                    >
                      {txHash}
                    </a>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Benefits Section */}
        <div className={styles.card}>
          <div className={styles['section-header']}>
            <h2>Benefits of Blockchain EHRs</h2>
          </div>
          <div className={styles['feature-list']}>
            {["Immutable record keeping ensures medical data cannot be tampered with",
              "Patient-controlled access allows you to determine who can view your records",
              "Cross-institutional sharing enables seamless coordination between healthcare providers",
              "Cryptographic security protects sensitive patient information",
              "Transparent audit trail documents all access to records",
              "HL7 FHIR compliance ensures interoperability with existing healthcare systems",
            ].map((text, i) => (
              <div key={i} className={styles['feature-item']}>{text}</div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Hoso;