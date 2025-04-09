import React, { useState } from 'react';
import styles from './Lockhoso.module.css';

interface Doctor {
  name: string;
  address: string;
}

interface StatusMessage {
  title: string;
  message: string;
}

const Lockhoso: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([{
    name: 'Dr. Jane Smith',
    address:
      'addr1qxck9k0c8ph4c7m3zqmuexcmjument0zw87h5krk3r9jmu0qp9eelew6s4kj',
  }]);
  const [policyId, setPolicyId] = useState<string>('');
  const [assetName, setAssetName] = useState<string>('');
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

  const handleAddDoctor = () => {
    const nameInput = document.getElementById('doctor-name') as HTMLInputElement;
    const addressInput = document.getElementById('doctor-wallet') as HTMLInputElement;
    const name = nameInput?.value.trim();
    const address = addressInput?.value.trim();

    if (name && address) {
      setDoctors([...doctors, { name, address }]);
      nameInput.value = '';
      addressInput.value = '';
    } else {
      alert('Please enter both doctor name and wallet address.');
    }
  };

  const handleRemoveDoctor = (index: number) => {
    const newList = [...doctors];
    newList.splice(index, 1);
    setDoctors(newList);
  };

  const handleVerifyNFT = () => {
    if (policyId && assetName) {
      setPreviewVisible(true);
    } else {
      alert('Please enter both Policy ID and Asset Name.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage({
      title: 'Transaction Successful',
      message: `Your NFT has been successfully locked in the smart contract with ${doctors.length} authorized providers.`,
    });
    document.getElementById('status-message')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.content}>
      <div className={styles['form-section']}>
        <h3>NFT Asset Information</h3>
        <div className={styles['form-group']}>
          <label htmlFor="policy-id">Policy ID</label>
          <input
            type="text"
            id="policy-id"
            value={policyId}
            onChange={(e) => setPolicyId(e.target.value)}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="asset-name">Asset Name</label>
          <input
            type="text"
            id="asset-name"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            required
          />
        </div>

        <button type="button" id="verify-nft" onClick={handleVerifyNFT} className={styles['add-doctor-btn']}>
          Verify NFT
        </button>

        {previewVisible && (
          <div className={styles['nft-preview']}>
            <div className={styles['nft-details']}>
              <h4>Medical Record Preview</h4>
              <p><strong>Policy ID:</strong> {policyId.substring(0, 10)}...</p>
              <p><strong>Asset Name:</strong> {assetName}</p>
              <p><strong>Owner:</strong> addr1q9v8...</p>
            </div>
          </div>
        )}
      </div>

      <div className={styles['form-section']}>
        <h3>Healthcare Providers</h3>
        <div className={styles['form-group']}>
          <label>Doctor/Provider Name</label>
          <input type="text" id="doctor-name" placeholder="Enter provider name" />
        </div>
        <div className={styles['form-group']}>
          <label>Wallet Address</label>
          <input type="text" id="doctor-wallet" placeholder="Enter wallet address" />
        </div>

        <button
          type="button"
          id="add-doctor"
          onClick={handleAddDoctor}
          className={styles['add-doctor-btn']}
        >
          Add Provider
        </button>

        <div className={styles['doctor-list']}>
          {doctors.map((doc, index) => (
            <div key={index} className={styles['doctor-item']}>
              <div className={styles['doctor-info']}>
                <div className={styles['doctor-name']}>{doc.name}</div>
                <div className={styles['doctor-address']}>{doc.address}</div>
              </div>
              <button
                type="button"
                className={styles['remove-btn']}
                onClick={() => handleRemoveDoctor(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles['btn-container']}>
        <button type="submit" className={styles['btn-lock']}>
          Lock NFT in Contract
        </button>
      </div>

      {statusMessage && (
        <div id="status-message" className={`${styles['status-bar']} ${styles.success}`}>
          <h3>{statusMessage.title}</h3>
          <p>{statusMessage.message}</p>
        </div>
      )}
    </form>
  );
};

export default Lockhoso;
