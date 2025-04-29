import React from "react";
import Link from 'next/link';
import styles from '../../styles/adapter_doctor.module.css';

import lockIcon from './images/lock.png';
import unlockIcon from './images/unlock.png';
import updateIcon from './images/update.png';

const DoctorServices: React.FC = () => {
  const services = [
    {
      title: 'Lock Patient Record',
      desc: 'Securely lock patient medical records on the blockchain to ensure only authorized access.',
      alt: 'Lock record',
      link: '/service_doctor/doctor_lock',
      icon: lockIcon,
    },
    {
      title: 'Unlock Patient Record',
      desc: 'Safely unlock patient records with blockchain verification for viewing or updating.',
      alt: 'Unlock record',
      link: '/service_doctor/doctor_update',
      icon: unlockIcon,
    },
    {
      title: 'Update Patient Record',
      desc: 'Update patient medical history, diagnoses, or treatments with secure blockchain integration.',
      alt: 'Update record',
      link: '/service_doctor/doctor_unlock',
      icon: updateIcon,
    },
  ];

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
            {services.map((service, index) => (
              <Link key={index} href={service.link}>
                <div className={styles.serviceCard}>
                  <div className={styles.serviceIcon}>
                    {}
                    <img src={service.icon.src} alt={service.alt} />
                  </div>
                  <div className={styles.serviceContent}>
                    <h3 className={styles.sectionTitle}>{service.title}</h3>
                    <p className={styles.serviceText}>{service.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default DoctorServices;
