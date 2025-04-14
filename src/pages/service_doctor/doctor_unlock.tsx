import React from 'react';
import styles from '../../styles/unlock.module.css';

const DoctorUnlock = () => {
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

        <form className={styles.unlockForm}>
          <div className={styles.formGroup}>
            <label htmlFor="txhash">Transaction Hash (txhash)</label>
            <input
              type="text"
              id="txhash"
              name="txhash"
              placeholder="Enter transaction hash here..."
              required
            />
            <span className={styles.formInfo}>
              The transaction hash serves as a unique identifier on the
              blockchain for the specific medical record
            </span>
          </div>

          <button type="submit" className={styles.unlockBtn}>
            Unlock Medical Records
          </button>
        </form>

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
