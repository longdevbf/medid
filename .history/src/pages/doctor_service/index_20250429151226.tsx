// JSX Component
import React from "react";
import Link from 'next/link';
import styles from '../../styles/adapter_doctor.module.css';

import lockIcon from './images/lock.png';
import unlockIcon from './images/unlock.png';
import updateIcon from './images/update.png';


const DoctorServices = () => {
  // Dịch vụ chính
  const mainServices = [
    {
      title: 'Lock Patient Record',
      desc: 'Securely lock patient medical records on the blockchain to ensure only authorized access.',
      alt: 'Lock record',
      link: '/doctor_service/lock',
      icon: lockIcon,
    },
    {
      title: 'Unlock Patient Record',
      desc: 'Safely unlock patient records with blockchain verification for viewing or updating.',
      alt: 'Unlock record',
      link: '/doctor_service/unlock',
      icon: unlockIcon,
    },
    {
      title: 'Update Patient Record',
      desc: 'Update patient medical history, diagnoses, or treatments with secure blockchain integration.',
      alt: 'Update record',
      link: '/doctor_service/update',
      icon: updateIcon,
    },
  ];

  // Dịch vụ bổ sung (không có link thực)
  const additionalServices = [
    {
      title: 'Patient Appointments',
      desc: 'Manage your daily schedule and upcoming patient appointments.',
      icon: '/images/calendar.png',
    },
    {
      title: 'Patient Registration',
      desc: 'Register new patients into the blockchain medical system.',
      icon: '/.git/hooks/',
    },
    {
      title: 'Medical Records',
      desc: 'View and manage all patient medical histories.',
      icon: folderIcon,
    },
    {
      title: 'Analytics Dashboard',
      desc: 'View statistics and reports about your medical practice.',
      icon: chartIcon,
    },
  ];

  return (
    <>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerLogo}>
            <div className={styles.logoIcon}>
              <span>M</span>
            </div>
            <span className={styles.logoText}>MedID</span>
          </div>
          <nav className={styles.mainNav}>
            <a href="#">Home</a>
            <a href="#" className={styles.active}>Services</a>
            <a href="#">Blockchain Health</a>
            <a href="#">Doctor Services</a>
          </nav>
          <button className={styles.connectBtn}>Connect Wallet</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1>Doctor Services Portal</h1>
          <p>Access all your medical practice tools securely on blockchain for enhanced patient care and efficient healthcare management</p>
          <div className={styles.heroBtns}>
            <button className={styles.primaryBtn}>View Dashboard</button>
            <button className={styles.secondaryBtn}>Learn More</button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>1,259</span>
              <span className={styles.statLabel}>Patient Records</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>987</span>
              <span className={styles.statLabel}>Records Secured</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>342</span>
              <span className={styles.statLabel}>Monthly Updates</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>99.8%</span>
              <span className={styles.statLabel}>Success Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Blockchain Visual */}
      <section className={styles.blockchainSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Blockchain Security</h2>
          
          <div className={styles.blockchainVisual}>
            <div className={styles.blockchainBlocks}>
              <div className={styles.blockWrapper}>
                <div className={styles.block}>
                  <div className={styles.blockHash}>HASH #4F2A...</div>
                  <div className={styles.blockTitle}>Block #1</div>
                  <div className={styles.blockData}>Patient Data</div>
                </div>
                <div className={styles.blockLabel}>Genesis</div>
              </div>
              
              <div className={styles.arrow}>→</div>
              
              <div className={styles.blockWrapper}>
                <div className={styles.block}>
                  <div className={styles.blockHash}>HASH #4F2A...</div>
                  <div className={styles.blockTitle}>Block #2</div>
                  <div className={styles.blockData}>Patient Data</div>
                </div>
              </div>
              
              <div className={styles.arrow}>→</div>
              
              <div className={styles.blockWrapper}>
                <div className={styles.block}>
                  <div className={styles.blockHash}>HASH #4F2A...</div>
                  <div className={styles.blockTitle}>Block #3</div>
                  <div className={styles.blockData}>Patient Data</div>
                </div>
              </div>
              
              <div className={styles.arrow}>→</div>
              
              <div className={styles.blockWrapper}>
                <div className={styles.block}>
                  <div className={styles.blockHash}>HASH #4F2A...</div>
                  <div className={styles.blockTitle}>Block #n</div>
                  <div className={styles.blockData}>Patient Data</div>
                </div>
                <div className={styles.blockLabel}>Latest</div>
              </div>
            </div>
            
            <div className={styles.blockchainInfo}>
              <div className={styles.infoBox}>
                <div className={styles.infoBoxTitle}>
                  <span className={styles.infoIcon}>🔒</span>
                  <span>End-to-End Encryption</span>
                </div>
                <p>Medical records are fully encrypted using advanced cryptographic algorithms</p>
              </div>
              
              <div className={styles.infoBox}>
                <div className={styles.infoBoxTitle}>
                  <span className={styles.infoIcon}>✓</span>
                  <span>Immutable & Secure Access</span>
                </div>
                <p>Data is tamper-proof and accessible only through secure authentication</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className={styles.services}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Primary Services</h2>
          <p className={styles.sectionDesc}>Access essential blockchain-integrated functions for managing patient medical records with the highest level of security and compliance</p>
          
          <div className={styles.servicesGrid}>
            {mainServices.map((service, index) => (
              <Link key={index} href={service.link}>
                <div className={styles.serviceCard}>
                  <div className={styles.serviceIcon}>
                    <img src={service.icon.src} alt={service.alt} />
                  </div>
                  <div className={styles.serviceContent}>
                    <h3>{service.title}</h3>
                    <p>{service.desc}</p>
                  </div>
                  <div className={styles.serviceAction}>
                    <span>Access Service</span>
                    <span className={styles.actionArrow}>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services Section */}
      <section className={styles.additionalServices}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Additional Services</h2>
          <p className={styles.sectionDesc}>Comprehensive tools to streamline your practice management and enhance patient care</p>
          
          <div className={styles.additionalServicesGrid}>
            {additionalServices.map((service, index) => (
              <div key={index} className={styles.additionalServiceCard}>
                <div className={styles.additionalServiceHeader}>
                  <div className={styles.additionalServiceIcon}>
                    <img src={service.icon.src} alt={service.title} />
                  </div>
                  <h3>{service.title}</h3>
                </div>
                <p>{service.desc}</p>
                <div className={styles.additionalServiceFooter}>
                  <span>Coming Soon</span>
                  <span className={styles.previewBadge}>Preview</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2>Ready to enhance your practice?</h2>
          <p>Join thousands of medical professionals using blockchain technology to secure patient data and streamline healthcare operations</p>
          <div className={styles.ctaBtns}>
            <button className={styles.primaryBtn}>Contact Support</button>
            <button className={styles.secondaryBtn}>Schedule Demo</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div className={styles.footerCol}>
              <div className={styles.footerLogo}>
                <div className={styles.footerLogoIcon}>M</div>
                <span>MedChain</span>
              </div>
              <p>Secure, transparent, and efficient blockchain solutions for healthcare professionals.</p>
            </div>
            
            <div className={styles.footerCol}>
              <h3>Services</h3>
              <ul>
                <li><a href="#">Patient Records</a></li>
                <li><a href="#">Security Solutions</a></li>
                <li><a href="#">Analytics</a></li>
                <li><a href="#">Integration</a></li>
              </ul>
            </div>
            
            <div className={styles.footerCol}>
              <h3>Resources</h3>
              <ul>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">API Reference</a></li>
                <li><a href="#">Compliance</a></li>
                <li><a href="#">Support</a></li>
              </ul>
            </div>
            
            <div className={styles.footerCol}>
              <h3>Contact</h3>
              <ul>
                <li>support@medchain.example.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Blockchain Ave, Suite 200</li>
                <li>San Francisco, CA 94103</li>
              </ul>
            </div>
          </div>
          
          <div className={styles.footerBottom}>
            <p>© 2025 MedChain. All rights reserved.</p>
            <div className={styles.footerLinks}>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">HIPAA Compliance</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default DoctorServices;