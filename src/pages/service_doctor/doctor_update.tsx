import React, { useState } from 'react';
//import styles from '../styles/index.module.css';
import styles from '../../styles/update.module.css';

type HistoryRecord = {
  date: string;
  nftName: string;
  type: string;
  amount: string;
  status: string;
};

const DoctorUpdateRecord = () => {
  const [activeTab, setActiveTab] = useState('record-update');
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [resultMsg, setResultMsg] = useState<{ type: string; text: string }>({ type: '', text: '' });

  const resetForm = () => {
    const form = document.getElementById('updateRecordForm') as HTMLFormElement | null;
    if (form) {
      form.reset();
    }
    setResultMsg({ type: '', text: '' });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const nftName = form.nftName.value;
    const patientAddress = form.patientAddress.value;
    const initialData = form.initialData.value;
    const examinationData = form.examinationData.value;
    const billingAmount = form.billingAmount.value;
    const billType = form.billType.value;

    if (!patientAddress.startsWith('0x') || patientAddress.length < 10) {
      setResultMsg({ type: 'error', text: 'Please enter a valid patient blockchain address' });
      return;
    }

    if (initialData.length < 10) {
      setResultMsg({ type: 'error', text: 'Please enter more detailed initial medical data' });
      return;
    }

    if (examinationData.length < 10) {
      setResultMsg({ type: 'error', text: 'Please enter more detailed examination data' });
      return;
    }

    if (parseFloat(billingAmount) <= 0) {
      setResultMsg({ type: 'error', text: 'Please enter a valid billing amount' });
      return;
    }

    const now = new Date();
    const newRecord: HistoryRecord = {
      date: now.toLocaleDateString() + ' ' + now.toLocaleTimeString(),
      nftName,
      type: billType,
      amount: `$${parseFloat(billingAmount).toFixed(2)}`,
      status: 'Confirmed'
    };

    setHistory([newRecord, ...history]);
    setResultMsg({
      type: 'success',
      text: 'Medical record updated successfully! Transaction submitted to the blockchain.'
    });

    console.log({
      nftName,
      patientAddress,
      initialData,
      examinationData,
      billingAmount,
      billType
    });
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
          As an authorized healthcare provider, you can update patient medical records on the blockchain. Please enter the NFT name, initial data, examination results, and billing information.
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
                <input type="text" id="patientAddress" name="patientAddress" placeholder="0x..." required />
              </div>

              <div className={styles.twoColumns}>
                <div className={styles.formGroup}>
                  <label htmlFor="initialData">Initial Medical Data:</label>
                  <textarea id="initialData" name="initialData" placeholder="Enter initial diagnosis, symptoms, and baseline measurements" required />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="examinationData">New Examination Data:</label>
                  <textarea id="examinationData" name="examinationData" placeholder="Enter new examination findings, test results, and treatment recommendations" required />
                </div>
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

              <div className={styles.twoColumns}>
                <div className={styles.formGroup}>
                  <label htmlFor="billingAmount">Billing Amount:</label>
                  <div className={styles.priceInput}>
                    <input type="number" id="billingAmount" name="billingAmount" min="0" step="0.01" placeholder="0.00" required />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="billType">Bill Type:</label>
                  <select id="billType" name="billType" required>
                    <option value="">Select billing type</option>
                    <option value="consultation">Consultation</option>
                    <option value="procedure">Procedure</option>
                    <option value="laboratory">Laboratory Services</option>
                    <option value="medication">Medication</option>
                    <option value="followup">Follow-up Visit</option>
                    <option value="emergency">Emergency Care</option>
                  </select>
                </div>
              </div>

              <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
                <input type="checkbox" id="confirmCheck" required />
                <label htmlFor="confirmCheck">I confirm that this update is accurate and authorized under my medical license</label>
              </div>

              <div className={styles.btnGroup}>
                <button type="button" className={styles.btnSecondary} onClick={resetForm}>Reset</button>
                <button type="submit" className={styles.btn}>Update Medical Record</button>
              </div>
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
                      <th>Update Type</th>
                      <th>Billing Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry, index) => (
                      <tr key={index}>
                        <td>{entry.date}</td>
                        <td>{entry.nftName}</td>
                        <td>{entry.type}</td>
                        <td>{entry.amount}</td>
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
            </div>
          )}
        </div>
      </div>
      
    </>
  );
};

export default DoctorUpdateRecord;

