import React from 'react';
import styles from './Hoso.module.css';




const Hoso: React.FC = () => {
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
          <form id="nft-mint-form">
            {/* Patient Info */}
            <div className={styles['form-section']}>
              <h3>Patient Information</h3>
              <div className={styles['form-grid']}>
                <div className={styles['form-group']}>
                  <label htmlFor="patient-id">Patient Identifier</label>
                  <input type="text" id="patient-id" placeholder="Enter patient identifier" />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="patient-name">Patient Name</label>
                  <input type="text" id="patient-name" placeholder="Full name" />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="patient-dob">Date of Birth</label>
                  <input type="date" id="patient-dob" />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="patient-gender">Gender</label>
                  <select id="patient-gender">
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Encounter */}
            <div className={styles['form-section']}>
              <h3>Encounter Information</h3>
              <div className={styles['form-grid']}>
                <div className={styles['form-group']}>
                  <label htmlFor="encounter-date">Encounter Date</label>
                  <input type="datetime-local" id="encounter-date" />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="encounter-type">Encounter Type</label>
                  <select id="encounter-type">
                    <option value="">Select type</option>
                    <option value="ambulatory">Ambulatory</option>
                    <option value="emergency">Emergency</option>
                    <option value="inpatient">Inpatient</option>
                    <option value="virtual">Virtual</option>
                  </select>
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="provider-id">Provider Identifier</label>
                  <input type="text" id="provider-id" placeholder="Provider NPI" />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="location">Location</label>
                  <input type="text" id="location" placeholder="Facility name" />
                </div>
              </div>
            </div>

            {/* Clinical Data */}
            <div className={styles['form-section']}>
              <h3>Clinical Data</h3>
              <div className={styles['form-grid']}>
                <div className={styles['form-group']}>
                  <label htmlFor="condition">Condition/Diagnosis (SNOMED CT)</label>
                  <input type="text" id="condition" placeholder="SNOMED CT code" />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="condition-desc">Diagnosis Description</label>
                  <input type="text" id="condition-desc" placeholder="Condition description" />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="observation">Observation/Finding</label>
                  <input type="text" id="observation" placeholder="Observation code (LOINC)" />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="observation-value">Observation Value</label>
                  <input type="text" id="observation-value" placeholder="Value with units" />
                </div>
              </div>
            </div>

            {/* Medication */}
            <div className={styles['form-section']}>
              <h3>Medication & Procedures</h3>
              <div className={styles['form-grid']}>
                <div className={styles['form-group']}>
                  <label htmlFor="medication">Medication (RxNorm)</label>
                  <input type="text" id="medication" placeholder="RxNorm code" />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="medication-dose">Dosage Instructions</label>
                  <input type="text" id="medication-dose" placeholder="Dose, frequency, route" />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="procedure">Procedure (CPT/HCPCS)</label>
                  <input type="text" id="procedure" placeholder="Procedure code" />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="procedure-desc">Procedure Description</label>
                  <input type="text" id="procedure-desc" placeholder="Description" />
                </div>
              </div>
            </div>

            {/* Blockchain Settings */}
            <div className={styles['form-section']}>
              <h3>Blockchain Record Settings</h3>
              <div className={styles['form-grid']}>
                <div className={styles['form-group']}>
                  <label htmlFor="access-level">Access Level</label>
                  <select id="access-level">
                    <option value="patient-only">Patient Only</option>
                    <option value="treating-provider">Treating Providers</option>
                    <option value="research">Research (De-identified)</option>
                    <option value="emergency">Emergency Access</option>
                  </select>
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="consent-status">Consent Status</label>
                  <select id="consent-status">
                    <option value="granted">Consent Granted</option>
                    <option value="restricted">Restricted Consent</option>
                    <option value="denied">Consent Denied</option>
                  </select>
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="record-expiry">Record Expiry (Optional)</label>
                  <input type="date" id="record-expiry" />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="additional-notes">Additional Notes</label>
                  <textarea id="additional-notes" placeholder="Any additional information..." />
                </div>
              </div>
            </div>

            <div className={styles['btn-container']}>
              <button type="submit" className={styles['btn-mint']}>
                Mint Medical Record NFT
              </button>
            </div>
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
