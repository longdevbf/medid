import React, { useState } from 'react';
import { useWallet } from '@meshsdk/react';
import styles from '../../styles/unlock.module.css';
import unlockPortfolio from '../../utils/PatientAction/utils/unlock';

const DoctorUnlock = () => {
  // Wallet connection
  const { wallet, connected } = useWallet();
  
  // State variables
  const [txHash, setTxHash] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unlockResult, setUnlockResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle form submission
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!txHash || txHash.trim() === '') {
      setError('Transaction hash is required');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setUnlockResult(null);
    setIsSuccess(false);
    
    try {
      // Call the unlock function with wallet and transaction hash
      const result = await unlockPortfolio(wallet, txHash);
      
      setUnlockResult(result);
      setIsSuccess(true);
      setError(null);
    } catch (err) {
      console.error('Error unlocking records:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className={styles.hero}>
        <h1>Doctor Record Access</h1>
        <p>
          Securely unlock patient medical records with blockchain verification
        </p>
      </section>

      <div className={styles.unlockContainer}>
        <h2>Unlock Patient Records</h2>

        <div className={styles.unlockDescription}>
          <p>
            As a healthcare provider, you can access patient medical records
            securely through our blockchain-based system. Enter the transaction
            hash (txhash) provided by the patient or system to unlock and
            decrypt the medical records. This ensures that only authorized
            personnel can access sensitive healthcare information while
            maintaining a transparent audit trail.
          </p>
        </div>

        {!connected && (
          <div className={styles.walletWarning}>
            <p>Please connect your wallet to unlock patient records</p>
          </div>
        )}

        <form className={styles.unlockForm} onSubmit={handleUnlock}>
          <div className={styles.formGroup}>
            <label htmlFor="txhash">Transaction Hash (txhash)</label>
            <input
              type="text"
              id="txhash"
              name="txhash"
              placeholder="Enter transaction hash here..."
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              required
              disabled={isLoading}
            />
            <span className={styles.formInfo}>
              The transaction hash serves as a unique identifier on the
              blockchain for the specific medical record
            </span>
          </div>

          <button 
            type="submit" 
            className={styles.unlockBtn}
            disabled={isLoading || !connected}
          >
            {isLoading ? 'Processing...' : 'Unlock Medical Records'}
          </button>
        </form>

        {error && (
          <div className={styles.errorMessage}>
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {isSuccess && unlockResult && (
          <div className={styles.successMessage}>
            <h3>Records Unlocked Successfully</h3>
            <p>Transaction ID: {unlockResult}</p>
            <p>You can now view the patient's medical records</p>
          </div>
        )}

        <div className={styles.securityInfo}>
          <h3>Security Information</h3>
          <p>
            All access attempts are recorded on the blockchain for transparency
            and accountability. Patient data remains encrypted and is only
            decrypted temporarily for authorized viewing. Your account
            credentials and this transaction will be securely logged in
            compliance with healthcare regulations and data protection laws.
          </p>
        </div>

        <div className={styles.blockVisualization}>
          <div className={styles.blockChain}>
            <div className={styles.block}>Block #1</div>
            <div className={styles.arrow}>→</div>
            <div className={styles.block}>Block #2</div>
            <div className={styles.arrow}>→</div>
            <div className={styles.block}>Block #3</div>
            <div className={styles.arrow}>→</div>
            <div className={styles.block}>Block #n</div>
          </div>
          <div className={styles.blockInfo}>
            <p>Medical records are encrypted</p>
            <p>Data is securely stored and centrally accessible</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorUnlock;