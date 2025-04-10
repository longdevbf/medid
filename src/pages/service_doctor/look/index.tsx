import React from 'react';
//import styles from '../styles/index.module.css'; 
import styles from './index.module.css'; 




const DoctorAssetLockPage: React.FC = () => {
  return (
    <div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>Doctor Asset Lock</h1>
          <p className={styles.heroText}>Secure patient payment processing through blockchain-based asset locking</p>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.assetLockContainer}>
            <div className={styles.assetLockForm}>
              <h3 className={styles.formTitle}>Lock Patient Payment Assets</h3>
              <form>
                <div className={styles.formGroup}>
                  <label htmlFor="policyId" className={styles.formLabel}>Policy ID</label>
                  <input type="text" id="policyId" className={styles.formInput} placeholder="Enter blockchain policy ID" />
                  <p className={styles.formHelp}>The unique identifier for the blockchain policy</p>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="assetName" className={styles.formLabel}>Asset Name</label>
                  <input type="text" id="assetName" className={styles.formInput} placeholder="Enter asset name" />
                  <p className={styles.formHelp}>The name of the asset to be locked for payment</p>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="amount" className={styles.formLabel}>Payment Amount</label>
                  <input type="number" id="amount" className={styles.formInput} placeholder="Enter amount to be paid" />
                  <p className={styles.formHelp}>The required payment amount for medical services</p>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="patientId" className={styles.formLabel}>Patient ID</label>
                  <input type="text" id="patientId" className={styles.formInput} placeholder="Enter patient blockchain ID" />
                  <p className={styles.formHelp}>The blockchain identifier for the patient</p>
                </div>

                <button type="submit" className={styles.submitBtn}>Lock Asset</button>
              </form>
            </div>

            {/* Process Steps */}
            <div className={styles.processSteps}>
              <h3 className={styles.stepsTitle}>How Asset Locking Works</h3>
              <div className={styles.stepsContainer}>
                {['Submit Details', 'Blockchain Verification', 'Patient Payment', 'Asset Release'].map((title, index) => (
                  <div className={styles.step} key={index}>
                    <div className={styles.stepNumber}>{index + 1}</div>
                    <h4 className={styles.stepTitle}>{title}</h4>
                    <p className={styles.stepDescription}>
                      {[
                        'Enter policy ID, asset name, and payment amount',
                        'Smart contract validates the transaction details',
                        'Patient completes payment through secure blockchain wallet',
                        'Funds are released to healthcare provider',
                      ][index]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction History */}
            <div className={styles.transactionHistory}>
              <h3 className={styles.historyTitle}>Recent Asset Locks</h3>
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Patient ID</th>
                    <th>Asset</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['04/03/2025', 'PAT-78932', 'MED-TOKEN', '250.00', 'active'],
                    ['04/02/2025', 'PAT-45621', 'MED-TOKEN', '175.50', 'completed'],
                    ['04/01/2025', 'PAT-12587', 'MED-TOKEN', '320.75', 'completed'],
                  ].map(([date, patientId, asset, amount, status], i) => (
                    <tr key={i} className={styles.historyTableRow}>
                      <td>{date}</td>
                      <td>{patientId}</td>
                      <td>{asset}</td>
                      <td>{amount}</td>
                      <td>
                        <span className={`${styles.status} ${status === 'active' ? styles.statusActive : styles.statusCompleted}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorAssetLockPage;

