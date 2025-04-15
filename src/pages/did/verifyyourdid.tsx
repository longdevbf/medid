"use client";

import React, { useState, useEffect, ChangeEvent, DragEvent, useRef } from 'react';
import Link from 'next/link';
import styles from '../../styles/verify_did.module.css';
import { useWallet } from '@meshsdk/react';
import { deserializeAddress } from '@meshsdk/core';
import { encryptData } from '../../secret/encryptAndDecrypt';
import mintNFT from '../../utils/DidAction/mint';
import axios from 'axios';
import  {PinataSDK}  from "pinata"; // Import PinataSDK from official package

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
  const [mintHistory, setMintHistory] = useState<any[]>([]);

  // Pinata configuration
  const JWT =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MzdkNzd" +
  "iZC1kMWY2LTQyMWUtOGY2MC01OTgwZTMyOTdhOTEiLCJlbWFpbCI6Imxvbmd0ZC5hNWs0OGd0YkBnbWF" +
  "pbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXN" +
  "pcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3V" +
  "udCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXM" +
  "iOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5Ijo" +
  "iZGNjYmY4MTA2ZDg1NjQzM2I1YWUiLCJzY29wZWRLZXlTZWNyZXQiOiIxZWM0YmE5YjQ3ZjllMjA1MzN" +
  "lYTFiYmM5MjZkODIzOTJjZTcxODYyOWZjMmMwZWZjOTBjMWRiYjAxYTljN2IzIiwiZXhwIjoxNzc0NTI" +
  "0MTMyfQ.IokET3UfMOUUe9EQaZ6y7iNOnJdKdu0rbzxeO0PKTSc";
  const pinataGateway = "emerald-managing-koala-687.mypinata.cloud"; // Cấu hình gateway giống file index.tsx
  const pinata = new PinataSDK({ pinataJwt: JWT, pinataGateway: pinataGateway }); // Khởi tạo instance Pinata

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

  // Upload image to Pinata using PinataSDK (giống index.tsx)
  const uploadToPinata = async (): Promise<string> => {
    if (!file) throw new Error("No file selected for upload.");

    try {
      const uploadResult = await pinata.upload.public.file(file);
      if (!uploadResult || !uploadResult.cid) {
        throw new Error("Upload failed");
      }
      const ipfsUrl = `ipfs://${uploadResult.cid}`;

      return ipfsUrl;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      throw new Error("Failed to upload image to IPFS.");
    }
  };

  // Handle NFT minting
  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      setTxStatus('Please connect your wallet first');
      return;
    }
    
    if (!file) {
      setTxStatus('Please upload an image for your Medical ID NFT');
      return;
    }
    
    if (!fullName || !dob || !idNumber || !email) {
      setTxStatus('Please fill in all required identity information');
      return;
    }
    
    if (!encryptionKey) {
      setTxStatus('Please enter an encryption key to secure your information');
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
      const userAddress = await wallet.getChangeAddress();
      const { pubKeyHash: userPubKey} = deserializeAddress(userAddress);
      
      // 2. Upload image to Pinata
      setTxStatus('Uploading image to IPFS...');
      const ipfsUrl = await uploadToPinata();
      
      // 3. Encrypt identity information
      setTxStatus('Encrypting your identity information...');
      const identityData = {
        fullName,
        dateOfBirth: dob,
        idNumber,
        email
      };
      
      const encryptedIdentity = encryptData(JSON.stringify(identityData), encryptionKey);
      console.log('Encrypted Identity:', encryptedIdentity);
      // 4. Prepare metadata with pubKeyHash
      const metadata = {
        name: nftName,
        description: "CIP68 Medical Identity Token",
        image: ipfsUrl,
        mediaType: file.type,
        _pk: userPubKey, // Include pubKeyHash as required
        data: encryptedIdentity
      };
      console.log('Metadata:', metadata);
      console.log('IPFS URL:', ipfsUrl);
      // 5. Mint the NFT
      setTxStatus('Minting your Medical ID NFT on the blockchain...');
      const result = await mintNFT(wallet, nftName, metadata);
      
      // 6. Update UI with success
      setTxHash(result);
      setTxStatus('Medical ID NFT minted successfully!');
      
      // Reset form if desired
      // clearForm();
      
    } catch (error) {
      console.error('Error minting NFT:', error);
      setTxStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
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

  // Calculate metadata preview
  const metadataPreview = {
    name: nftName,
    description: 'CIP68 Medical Identity Token',
    standard: 'CIP68',
    version: '1.0',
    identity: {
      fullName: fullName ? '******' : '',
      dateOfBirth: dob ? '******' : '',
      idNumber: idNumber ? '******' : '',
      email: email ? '******' : '',
      verified: false,
    },
    access: {
      publicInfo: 'name, verification status',
      privateInfo: 'encrypted, requires wallet auth and encryption key',
    },
    _pk: connected ? '(your wallet pubKeyHash)' : '(connect wallet to view)',
  };

  return (
    <>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.container}>
          <h1>Smart Healthcare on Blockchain</h1>
          <p>
            Combining cutting-edge technology with blockchain to deliver secure and
            intelligent healthcare services
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.container}>
          {/* Identity Verification Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Identity Verification</h2>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.infoBox}>
                <h3>Verify Your Medical Identity</h3>
                <p>
                  Securely verify your identity to access blockchain-based healthcare
                  services. Your data remains encrypted and only accessible with your
                  permission.
                </p>
              </div>
              <div className={styles.verifyButtonWrapper}>
                <Link href="/verify">
                  <button className={styles.btnPrimary}>Verify My Identity</button>
                </Link>
                <p className={styles.verifyNote}>
                  If verification fails, you&apos;ll need to mint a Medical Identity NFT.
                </p>
              </div>
            </div>
          </div>

          {/* NFT Minting Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Mint Medical Identity NFT</h2>
              {!connected && (
                <div className={styles.walletWarning}>
                  <p>Please connect your wallet to mint an NFT</p>
                </div>
              )}
            </div>
            <div className={styles.cardBody}>
              <div className={styles.infoBox}>
                <h3>
                  Medical Identity NFT <span className={styles.cipBadge}>CIP68</span>
                </h3>
                <p>
                  Create a secure, non-transferable NFT that contains your verified medical
                  identity. This CIP68-compliant token enables secure access to your
                  medical records while maintaining privacy.
                </p>
              </div>
              <form onSubmit={handleMint}>
                <div className={styles.splitLayout}>
                  <div className={styles.formSection}>
                    <input
                      type="file"
                      id="file-upload"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className={styles.hiddenFileInput}
                    />
                    <div
                      className={`${styles.dropArea} ${isDragging ? styles.dragActive : ''}`}
                      onDragEnter={(e) => handleDrag(e, true)}
                      onDragOver={(e) => handleDrag(e, true)}
                      onDragLeave={(e) => handleDrag(e, false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imageUrl ? (
                        <div className={styles.imagePreview}>
                          <img src={imageUrl} alt="Preview" />
                        </div>
                      ) : (
                        <>
                          <p>Drag and drop your image or click to browse</p>
                          <button type="button" className={styles.btnOutline}>
                            Choose File
                          </button>
                        </>
                      )}
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="nft-name">NFT Name</label>
                      <input
                        type="text"
                        id="nft-name"
                        className={styles.formControl}
                        placeholder="Enter a name for your Medical ID NFT"
                        value={nftName}
                        onChange={(e) => setNftName(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="full-name">Full Name</label>
                      <input
                        type="text"
                        id="full-name"
                        className={styles.formControl}
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="dob">Date of Birth</label>
                      <input
                        type="date"
                        id="dob"
                        className={styles.formControl}
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="id-number">ID Number</label>
                      <input
                        type="text"
                        id="id-number"
                        className={styles.formControl}
                        placeholder="National ID / Passport Number"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        className={styles.formControl}
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="encryption-key">Encryption Key (Password)</label>
                      <input
                        type="password"
                        id="encryption-key"
                        className={styles.formControl}
                        placeholder="Create a strong encryption key"
                        value={encryptionKey}
                        onChange={(e) => setEncryptionKey(e.target.value)}
                        required
                      />
                      <small className={styles.formHelp}>
                        This key will be used to encrypt your identity data. Keep it safe - you'll need it to decrypt your information.
                      </small>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="confirm-encryption-key">Confirm Encryption Key</label>
                      <input
                        type="password"
                        id="confirm-encryption-key"
                        className={styles.formControl}
                        placeholder="Confirm your encryption key"
                        value={confirmEncryptionKey}
                        onChange={(e) => setConfirmEncryptionKey(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.cipInfo}>
                      <h4>About CIP68 Standard</h4>
                      <p>
                        CIP68 is a Cardano Improvement Proposal that defines a standard for
                        NFTs with reference scripts, enabling advanced functionality for
                        digital assets on the Cardano blockchain.
                      </p>
                    </div>
                    <button 
                      type="submit" 
                      className={styles.btnPrimary}
                      disabled={isLoading || !connected}
                    >
                      {isLoading ? 'Processing...' : 'Mint Medical NFT'}
                    </button>
                    
                    {txStatus && (
                      <div className={`${styles.txStatus} ${txHash ? styles.success : ''}`}>
                        <p>{txStatus}</p>
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
                  </div>
                  <div className={styles.previewSection}>
                    <h3>NFT Preview</h3>
                    <div className={styles.nftPreview}>
                      <div className={styles.nftImagePreview}>
                        {imageUrl ? (
                          <img src={imageUrl} alt="Preview" />
                        ) : (
                          <p>Image preview will appear here</p>
                        )}
                      </div>
                      <h4 id="preview-name">{nftName}</h4>
                      <p className={styles.previewOwner}>
                        Owned by: {connected ? 'Your Wallet' : '[Connect Wallet]'}
                      </p>
                    </div>
                    <h3>Metadata</h3>
                    <div className={styles.metadataPreview}>
                      <pre>{JSON.stringify(metadataPreview, null, 2)}</pre>
                    </div>
                    <div className={styles.securityInfo}>
                      <h4>Data Security</h4>
                      <p>
                        <strong>Encryption:</strong> Your personal information is encrypted using AES-256 before being stored on the blockchain
                      </p>
                      <p>
                        <strong>Key Security:</strong> Only you have access to your encryption key - keep it secure
                      </p>
                      <p>
                        <strong>Blockchain Protection:</strong> Your identity is linked to your wallet's pubKeyHash for additional security
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mint;
