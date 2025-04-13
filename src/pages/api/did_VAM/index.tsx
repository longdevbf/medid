import React, { useState } from 'react';
//import styles from '../styles/index.module.css';
import styles from './index.module.css';
const MedIDPage = () => {
  const [nftName, setNftName] = useState('Medical ID NFT');
  const [metadata, setMetadata] = useState({
    name: 'Medical ID NFT',
    description: 'CIP68 Medical Identity Token',
    standard: 'CIP68',
    version: '1.0',
    identity: {
      fullName: '',
      dateOfBirth: '',
      idNumber: '',
      email: '',
      verified: false,
    },
    access: {
      publicInfo: 'name, verification status',
      privateInfo: 'encrypted, requires wallet auth',
    },
  });

  const updateMetadataField = (field: string, value: string) => {
    setMetadata((prev) => ({
      ...prev,
      identity: {
        ...prev.identity,
        [field]: value,
      },
    }));
  };

  return (
    <div className={styles.pageWrapper}>
      
      <section className={styles.hero}>
        <h1>Smart Healthcare on Blockchain</h1>
        <p>Combining cutting-edge technology with blockchain to deliver secure and intelligent healthcare services</p>
      </section>
      <div className={styles.container} >
      <main className={styles.mainContent}>
        <div className={styles.card}>
          <div className={styles.cardHeader}><h2>Identity Verification</h2></div>
          <div className={styles.cardBody}>
            <div className={styles.infoBox}>
              <h3>Verify Your Medical Identity</h3>
              <p>Securely verify your identity to access blockchain-based healthcare services. Your data remains encrypted and only accessible with your permission.</p>
            </div>
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <button className={styles.btnPrimary} style={{ padding: '15px 40px', fontSize: '16px' }}>Verify My Identity</button>
              <p style={{ marginTop: '15px', color: '#666' }}>If verification fails, you will need to mint a Medical Identity NFT.</p>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}><h2>Mint Medical Identity NFT</h2></div>
          <div className={styles.cardBody}>
            <div className={styles.infoBox}>
              <h3>Medical Identity NFT <span className={styles.cipBadge}>CIP68</span></h3>
              <p>Create a secure, non-transferable NFT that contains your verified medical identity.</p>
            </div>

            <div className={styles.splitLayout}>
              <div className={styles.formSection}>
                <div className={styles.dropArea}>
                  <p>Drag and drop your image or click to browse</p>
                  <button className={`${styles.btn} ${styles.btnOutline}`}>Choose File</button>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="nft-name">NFT Name</label>
                  <input
                    type="text"
                    id="nft-name"
                    className={styles.formControl}
                    value={nftName}
                    onChange={(e) => {
                      setNftName(e.target.value);
                      setMetadata({ ...metadata, name: e.target.value || 'Medical ID NFT' });
                    }}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="full-name">Full Name</label>
                  <input type="text" id="full-name" className={styles.formControl} onChange={(e) => updateMetadataField('fullName', e.target.value)} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="dob">Date of Birth</label>
                  <input type="date" id="dob" className={styles.formControl} onChange={(e) => updateMetadataField('dateOfBirth', e.target.value)} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="id-number">ID Number</label>
                  <input type="text" id="id-number" className={styles.formControl} onChange={(e) => updateMetadataField('idNumber', e.target.value)} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" className={styles.formControl} onChange={(e) => updateMetadataField('email', e.target.value)} />
                </div>

                <div className={styles.cipInfo}>
                  <h4>About CIP68 Standard</h4>
                  <p>CIP68 defines a standard for NFTs with reference scripts, enabling advanced functionality for digital assets on the Cardano blockchain.</p>
                </div>

                <button className={styles.btnPrimary} style={{ width: '100%', marginTop: 20 }}>Mint Medical NFT</button>
              </div>
                    
              <div className={styles.previewSection}>
                <h3>NFT Preview</h3>
                <div className={styles.nftPreview}>
                  <div className={styles.nftImagePreview}><p>Image preview will appear here</p></div>
                  <h4>{metadata.name}</h4>
                  <p style={{ color: '#666' }}>Owned by: [Your Wallet]</p>
                </div>
                <h3>Metadata</h3>
                <div className={styles.metadataPreview}>
                  <pre>{JSON.stringify(metadata, null, 2)}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blockchain Applications Section */}
        <div className={styles.card} style={{ marginTop: '40px' }}>
          <div className={styles.cardHeader}><h2>Blockchain Applications in Healthcare</h2></div>
          <div className={styles.cardBody}>
            <div className={styles.blockGrid}>
              <div className={styles.blockItem}><span className={styles.blockIconPositive}>+</span> Centralized Medical Records</div>
              <div className={styles.blockItem}><span className={styles.blockIconNegative}>✕</span> Medical Identity Management</div>
              <div className={styles.blockItem}><span className={styles.blockIconPositive}>+</span> Secure Payment Solutions</div>
              <div className={styles.blockItem}><span className={styles.blockIconNegative}>✕</span> Medication Management</div>
            </div>
          </div>
        </div>

      </main>
      </div>
    </div>
  );
};

export default MedIDPage;
