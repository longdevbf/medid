"use client";

import React, { useState, useEffect, ChangeEvent, DragEvent } from 'react';
import Link from 'next/link';
import styles from '../../styles/verify_did.module.css';

const Mint: React.FC = () => {
  const [nftName, setNftName] = useState<string>('Medical ID NFT');
  const [fullName, setFullName] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [idNumber, setIdNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const metadata = {
    name: nftName,
    description: 'CIP68 Medical Identity Token',
    standard: 'CIP68',
    version: '1.0',
    identity: {
      fullName,
      dateOfBirth: dob,
      idNumber,
      email,
      verified: false,
    },
    access: {
      publicInfo: 'name, verification status',
      privateInfo: 'encrypted, requires wallet auth',
    },
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>, isDragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isDragging);
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
              <div className={styles.splitLayout}>
                <div className={styles.formSection}>
                  <div
                    className={`${styles.dropArea} ${isDragging ? styles.dragActive : ''}`}
                    onDragEnter={(e) => handleDrag(e, true)}
                    onDragOver={(e) => handleDrag(e, true)}
                    onDragLeave={(e) => handleDrag(e, false)}
                    onDrop={(e) => {
                      handleDrag(e, false);
                      // Xử lý file drop ở đây nếu cần
                    }}
                  >
                    <p>Drag and drop your image or click to browse</p>
                    <button type="button" className={styles.btnOutline}>
                      Choose File
                    </button>
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
                  <button type="submit" className={styles.btnPrimary}>
                    Mint Medical NFT
                  </button>
                </div>
                <div className={styles.previewSection}>
                  <h3>NFT Preview</h3>
                  <div className={styles.nftPreview}>
                    <div className={styles.nftImagePreview}>
                      <p>Image preview will appear here</p>
                    </div>
                    <h4 id="preview-name">{nftName}</h4>
                    <p className={styles.previewOwner}>Owned by: [Your Wallet]</p>
                  </div>
                  <h3>Metadata</h3>
                  <div className={styles.metadataPreview}>
                    <pre>{JSON.stringify(metadata, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mint;