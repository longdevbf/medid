import React from "react";
import styles from '../styles/adapter.module.css'; 


const DoctorServices: React.FC = () => {
  return (
    <>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1>Doctor Services Portal</h1>
          <p>Access all your medical practice tools securely on blockchain for enhanced patient care and efficient healthcare management</p>
        </div>
      </section>

      {/* Blockchain Visual */}
      <div className={styles.container}>
        <div className={styles.blockchainVisual}>
          <div className={styles.blockchainBlocks}>
            <div className={styles.block}>Block #1</div>
            <div className={styles.arrow}>→</div>
            <div className={styles.block}>Block #2</div>
            <div className={styles.arrow}>→</div>
            <div className={styles.block}>Block #3</div>
            <div className={styles.arrow}>→</div>
            <div className={styles.block}>Block #n</div>
          </div>
          <div className={styles.blockchainInfo}>
            <p>Medical records are encrypted</p>
            <p>Data is securely stored and centrally accessible</p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className={styles.services}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Doctor Services</h2>
          <div className={styles.servicesGrid}>
            {[
              {
                title: 'Appointment Management',
                text: 'Schedule, view and manage your patient appointments efficiently. Get notifications and sync with your personal calendar.',
                btn: 'Access Calendar',
              },
              {
                title: 'Telemedicine Services',
                text: 'Conduct secure video consultations with patients from anywhere. Access medical records during the session.',
                btn: 'Start Consultation',
              },
              {
                title: 'Patient Record Access',
                text: 'View complete patient medical history, test results, and previous treatments with secure blockchain verification.',
                btn: 'View Records',
              },
              {
                title: 'Lock Medical Records',
                text: 'Securely lock patient medical records after completion to prevent unauthorized alterations and ensure data integrity.',
                btn: 'Lock Records',
                extraClass: styles.lockBtn,
              },
              {
                title: 'Unlock Medical Records',
                text: 'Temporarily unlock patient records for authorized modifications. Contains verification and audit trail functionality.',
                btn: 'Unlock Records',
                extraClass: styles.unlockBtn,
              },
              {
                title: 'Update Medical Records',
                text: 'Make changes to patient records with complete version history. All updates are securely timestamped on the blockchain.',
                btn: 'Update Records',
              },
              {
                title: 'Billing & Payments',
                text: 'Generate and send medical bills with payment instructions securely through blockchain transactions.',
                btn: 'Billing Center',
              },
              {
                title: 'Prescriptions & Lab Orders',
                text: 'Write prescriptions and order lab tests digitally with secure verification and pharmacy integration.',
                btn: 'Write Prescription',
              },
              {
                title: 'Preventive Care',
                text: 'Schedule and manage preventive screenings and early disease detection programs for your patients.',
                btn: 'Screening Tools',
              },
              {
                title: 'Remote Patient Monitoring',
                text: 'Track patient vitals and health metrics remotely for continuous care between appointments.',
                btn: 'Monitor Patients',
              },
              {
                title: 'Reports & Analytics',
                text: 'Generate performance reports, patient statistics, and practice analytics to optimize your medical services.',
                btn: 'View Reports',
              },
            ].map((service, index) => (
              <div className={styles.serviceCard} key={index}>
                <div className={styles.serviceIcon}>
                  <img src="/api/placeholder/100/80" alt={service.title} />
                </div>
                <div className={styles.serviceContent}>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <a href="#" className={`${styles.btn} ${service.extraClass || ''}`}>{service.btn}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
    </>
  );
};

export default DoctorServices;
