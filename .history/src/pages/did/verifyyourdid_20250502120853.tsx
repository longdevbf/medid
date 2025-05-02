"use client";

// 1. Remove unused imports
import React, { useState, ChangeEvent, DragEvent, useRef } from 'react';
import Link from 'next/link';
import styles from '../../styles/verify_did.module.css';
import { useWallet } from '@meshsdk/react';
import { deserializeAddress } from '@meshsdk/core';
import { encryptData } from '../../secret/encryptAndDecrypt';
import mintNFT from '../../utils/DidAction/mint';
import { PinataSDK } from "pinata";
import { checkUserInDatabase, saveUserToDatabase } from '../../service/userService';
import { verify_did } from '../../utils/DidAction/verify';

// 2. Define proper interfaces instead of 'any'
interface VerificationResult {
  verified: boolean;
  didNumber: string | null;
  hasNft: boolean;
}

const Mint: React.FC = () => {
  // Wallet connection
  const { wallet, connected } = useWallet();

  // Form state
  const [nftName, setNftName] = useState<string>('Medical ID NFT');
  const [fullName, setFullName] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [idNumber, setIdNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [encryptionKey, setEncryptionKey] = useState<string>('');
  const [confirmEncryptionKey, setConfirmEncryptionKey] = useState<string>('');
  
  // File handling
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Transaction state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txStatus, setTxStatus] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  
  // Verification state
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [didNumber, setDidNumber] = useState<string | null>(null);

  // Pinata configuration
  const JWT = process.env.J;
  const pinataGateway = "emerald-managing-koala-687.mypinata.cloud";
  const pinata = new PinataSDK({ pinataJwt: JWT, pinataGateway: pinataGateway });

  // Key để mã hóa DID là cố định
  const DID_ENCRYPTION_KEY = "00000000";

  // Xử lý xác thực danh tính
  const handleVerify = async () => {
    if (!connected || !wallet) {
      setTxStatus('Vui lòng kết nối ví trước');
      return;
    }

    setIsVerifying(true);
    setTxStatus('Đang xác thực danh tính...');
    
    try {
      // Lấy địa chỉ ví
      const userAddress = await wallet.getChangeAddress();
      const { pubKeyHash: userPubKey } = deserializeAddress(userAddress);
      
      // Mã hóa địa chỉ ví để tạo DID
      const encryptedAddress = encryptData(userAddress, DID_ENCRYPTION_KEY);
      
      // Kiểm tra xem người dùng đã có trong database chưa
      const storedDid = await checkUserInDatabase(userAddress, userPubKey);
      
      if (storedDid) {
        setTxStatus('Đang kiểm tra NFT danh tính trong ví của bạn...');
        setDidNumber(storedDid);
        
        // Sử dụng hàm verify_did để kiểm tra NFT trong ví
        const nftVerified = await verify_did(wallet, DID_ENCRYPTION_KEY, storedDid);
        
        if (nftVerified) {
          // NFT tồn tại và DID khớp với database
          setVerificationResult({
            verified: true,
            didNumber: storedDid,
            hasNft: true
          });
          setTxStatus(`Xác thực thành công! NFT danh tính hợp lệ. DID: ${storedDid}`);
        } else {
          // DID tồn tại trong database nhưng không có NFT hoặc NFT không khớp
          setVerificationResult({
            verified: true,
            didNumber: storedDid,
            hasNft: false
          });
          setTxStatus('Bạn đã được xác thực, nhưng NFT danh tính không hợp lệ hoặc không tồn tại. Vui lòng tạo NFT mới.');
        }
      } else {
        // Người dùng chưa có trong database
        setDidNumber(encryptedAddress);
        setVerificationResult({
          verified: false,
          didNumber: null,
          hasNft: false
        });
        setTxStatus('Bạn chưa có định danh. Vui lòng tạo NFT định danh mới.');
        
        // Tự động lưu DID mới vào database
        try {
          await saveUserToDatabase(userAddress, userPubKey, encryptedAddress);
          setDidNumber(encryptedAddress);
          setTxStatus('Đã tạo định danh mới. Vui lòng tạo NFT định danh.');
        } catch (saveError) {
          console.error("Lỗi khi lưu định danh mới:", saveError);
          setTxStatus('Lỗi khi tạo định danh mới. Vui lòng thử lại sau.');
        }
      }
    } catch (error) {
      console.error('Lỗi xác thực:', error);
      setTxStatus(`Lỗi: ${error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'}`);
      setVerificationResult(null);
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle file upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setImageUrl(event.target.result);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>, isDragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isDragging);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setImageUrl(event.target.result);
        }
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  // Upload image to Pinata using PinataSDK
  const uploadToPinata = async (): Promise<{ ipfsUrl: string, fileType: string }> => {
    if (!file) throw new Error("Không có file được chọn");

    try {
      const uploadResult = await pinata.upload.public.file(file);
      if (!uploadResult || !uploadResult.cid) {
        throw new Error("Upload thất bại");
      }
      const ipfsUrl = `ipfs://${uploadResult.cid}`;
      const fileType = file.type; // Get the file's MIME type

      return { ipfsUrl, fileType };
    } catch (error) {
      console.error("Lỗi khi upload lên Pinata:", error);
      throw new Error("Không thể tải ảnh lên IPFS");
    }
  };

  // Handle NFT minting
  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      setTxStatus('Vui lòng kết nối ví trước');
      return;
    }
    
    if (!file) {
      setTxStatus('Vui lòng tải lên ảnh cho NFT danh tính');
      return;
    }
    
    if (!fullName || !dob || !idNumber || !email) {
      setTxStatus('Vui lòng điền đầy đủ thông tin danh tính');
      return;
    }
    
    if (!encryptionKey) {
      setTxStatus('Vui lòng nhập khóa mã hóa để bảo vệ thông tin của bạn');
      return;
    }
    
    if (encryptionKey !== confirmEncryptionKey) {
      setTxStatus('Khóa mã hóa không khớp');
      return;
    }

    if (!didNumber) {
      setTxStatus('Không tìm thấy định danh. Vui lòng xác thực danh tính trước.');
      return;
    }

    setIsLoading(true);
    setTxStatus('Đang xử lý yêu cầu của bạn...');
    
    try {
      // Lấy địa chỉ ví và pubKeyHash
      const userAddress = await wallet.getChangeAddress();
      const { pubKeyHash: userPubKey } = deserializeAddress(userAddress);
      
      // Tải ảnh lên Pinata
      setTxStatus('Đang tải ảnh lên IPFS...');
      const { ipfsUrl, fileType } = await uploadToPinata();
      
      // Mã hóa thông tin danh tính
      setTxStatus('Đang mã hóa thông tin danh tính của bạn...');
      const identityData = {
        fullName,
        dateOfBirth: dob,
        idNumber,
        email,
        did_number: didNumber
      };
      
      // Mã hóa dữ liệu danh tính
      const encryptedIdentity = encryptData(JSON.stringify(identityData), encryptionKey);
      console.log('Dữ liệu danh tính đã mã hóa:', encryptedIdentity);
      
      // Chuẩn bị metadata với pubKeyHash và dữ liệu đã mã hóa
      const metadata = {
        _pk: userPubKey,
        name: nftName,
        description: "CIP68 Medical Identity Token",
        image: ipfsUrl,
        mediaType: fileType,
        encryptedData: encryptedIdentity,
        did_number: didNumber, // Thêm DID vào metadata của NFT
        fingerprint: `medid-${userAddress.substring(0, 8)}`,
        totalSupply: "1"
      };
      
      console.log('Metadata:', metadata);
      console.log('IPFS URL:', ipfsUrl);
      
      // Tạo NFT
      setTxStatus('Đang tạo NFT danh tính y tế trên blockchain...');
      const result = await mintNFT(wallet, nftName, metadata, {});
      
      // Cập nhật UI khi thành công
      setTxHash(result);
      setTxStatus('NFT danh tính y tế đã được tạo thành công!');
      
      // Tự động xác thực lại sau khi mint
      setTimeout(() => {
        handleVerify();
      }, 3000);
      
    } catch (error) {
      console.error('Lỗi khi tạo NFT:', error);
      setTxStatus(`Lỗi: ${error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const clearForm = () => {
    setNftName('Medical ID NFT');
    setFullName('');
    setDob('');
    setIdNumber('');
    setEmail('');
    setFile(null);
    setImageUrl('');
    setEncryptionKey('');
    setConfirmEncryptionKey('');
  };

  // Tính toán trạng thái hiển thị UI
  const showVerificationSection = !verificationResult || !verificationResult.hasNft;
  const showMintForm = verificationResult && !verificationResult.hasNft && didNumber;

  return (
    <div className={styles.web3Theme}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>Xác thực danh tính sức khỏe trên Blockchain</h1>
          <p className={styles.heroSubtitle}>
            Kết hợp công nghệ tiên tiến với blockchain để mang lại dịch vụ chăm sóc sức khỏe
            thông minh và an toàn
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.container}>
          {/* Identity Verification Card */}
          {showVerificationSection && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Xác thực danh tính</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.infoBox}>
                  <h3>Xác thực danh tính y tế của bạn</h3>
                  <p>
                    Xác thực danh tính của bạn một cách an toàn để truy cập các dịch vụ chăm sóc
                    sức khỏe trên blockchain. Dữ liệu của bạn được mã hóa và chỉ có thể truy cập
                    khi có sự cho phép của bạn.
                  </p>
                </div>
                <div className={styles.verifyButtonWrapper}>
                  <button 
                    className={styles.btnPrimary} 
                    onClick={handleVerify}
                    disabled={isVerifying || !connected}
                  >
                    {isVerifying ? (
                      <span className={styles.spinner}></span>
                    ) : (
                      'Xác thực danh tính của tôi'
                    )}
                  </button>
                  {txStatus && <p className={styles.verifyNote}>{txStatus}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Verification Result Display */}
          {verificationResult && verificationResult.hasNft && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Xác thực thành công!</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.successMessage}>
                  <div className={styles.successIcon}>✓</div>
                  <h3>Danh tính của bạn đã được xác thực</h3>
                  <p>DID: {verificationResult.didNumber}</p>
                  <p>NFT danh tính hợp lệ đã được tìm thấy trong ví của bạn.</p>
                  <p>Bạn đã có thể truy cập đầy đủ vào các dịch vụ chăm sóc sức khỏe trên blockchain.</p>
                  <div className={styles.nextSteps}>
                    <Link href="/service">
                      <button className={styles.btnPrimary}>Truy cập dịch vụ</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NFT Minting Card */}
          {showMintForm && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Tạo NFT danh tính y tế</h2>
                {!connected && (
                  <div className={styles.walletWarning}>
                    <p>Vui lòng kết nối ví để tạo NFT</p>
                  </div>
                )}
              </div>
              <div className={styles.cardBody}>
                <div className={styles.infoBox}>
                  <h3>
                    NFT danh tính y tế <span className={styles.cipBadge}>CIP68</span>
                  </h3>
                  <p>
                    Tạo NFT không thể chuyển nhượng chứa danh tính y tế đã được xác minh của bạn.
                    Token CIP68 này cho phép truy cập an toàn vào hồ sơ y tế của bạn đồng thời
                    duy trì quyền riêng tư.
                  </p>
                  {didNumber && (
                    <div className={styles.didInfo}>
                      <p><strong>DID của bạn:</strong> {didNumber}</p>
                    </div>
                  )}
                </div>
                <form onSubmit={handleMint}>
                  <div className={styles.formGroup}>
                    <label htmlFor="nftName">Tên NFT</label>
                    <input
                      type="text"
                      id="nftName"
                      value={nftName}
                      onChange={(e) => setNftName(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="fullName">Họ và tên</label>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="dob">Ngày sinh</label>
                      <input
                        type="date"
                        id="dob"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="idNumber">Số CMND/CCCD</label>
                      <input
                        type="text"
                        id="idNumber"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Ảnh đại diện</label>
                    <div
                      className={`${styles.dropArea} ${isDragging ? styles.dragging : ''}`}
                      onDragOver={(e) => handleDrag(e, true)}
                      onDragEnter={(e) => handleDrag(e, true)}
                      onDragLeave={(e) => handleDrag(e, false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imageUrl ? (
                        <img src={imageUrl} alt="Preview" className={styles.preview} />
                      ) : (
                        <>
                          <p>Kéo thả hoặc click để chọn ảnh</p>
                          <span className={styles.browseLink}>Chọn file</span>
                        </>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="encryptionKey">Khóa mã hóa</label>
                    <input
                      type="password"
                      id="encryptionKey"
                      value={encryptionKey}
                      onChange={(e) => setEncryptionKey(e.target.value)}
                      required
                    />
                    <p className={styles.formHelp}>
                      Lưu ý: Hãy lưu giữ khóa mã hóa này cẩn thận. Bạn sẽ cần nó để truy cập dữ liệu y tế.
                    </p>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="confirmEncryptionKey">Xác nhận khóa mã hóa</label>
                    <input
                      type="password"
                      id="confirmEncryptionKey"
                      value={confirmEncryptionKey}
                      onChange={(e) => setConfirmEncryptionKey(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formActions}>
                    <button
                      type="submit"
                      className={styles.btnPrimary}
                      disabled={isLoading || !connected}
                    >
                      {isLoading ? (
                        <span className={styles.spinner}></span>
                      ) : (
                        'Tạo NFT danh tính'
                      )}
                    </button>
                    <button
                      type="button"
                      className={styles.btnSecondary}
                      onClick={clearForm}
                      disabled={isLoading}
                    >
                      Xóa form
                    </button>
                  </div>
                </form>

                {txStatus && <p className={styles.txStatus}>{txStatus}</p>}
                {txHash && (
                  <p className={styles.txHash}>
                    Transaction Hash:{' '}
                    <a
                      href={`https://preprod.cexplorer.io/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {txHash}
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mint;