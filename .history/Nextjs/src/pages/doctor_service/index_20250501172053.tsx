"use client"

import Link from "next/link"
import { ShieldIcon, LockIcon, UnlockIcon, FileTextIcon, DatabaseIcon, KeyIcon } from "lucide-react"
import styles from "../../styles/adapter_doctor.module.css"

export default function DoctorServices() {
  const services = [
    {
      title: "Medical Records",
      desc: "Digitize medical records as NFTs, creating unique ownership and permanent storage.",
      alt: "Medical records",
      link: "/doctor_service/records",
      icon: <FileTextIcon className={styles.serviceIcon} />,
    },
    {
<<<<<<< HEAD
      title: "Lock Patient Record",
      desc: "Securely lock patient medical records on the blockchain to ensure only authorized access.",
      alt: "Lock record",
      link: "/doctor_service/lock",
      icon: <LockIcon className={styles.serviceIcon} />,
    },
    {
      title: "Unlock Patient Record",
      desc: "Safely unlock patient records with blockchain verification for viewing or updating when needed.",
      alt: "Unlock record",
      link: "/doctor_service/unlock",
      icon: <UnlockIcon className={styles.serviceIcon} />,
=======
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
>>>>>>> a7bce92898d7651c70743807b60b1d1004598c91
    },
  ]

  return (
    <div className={styles.container}>


      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroGrid}>
            <div className={styles.heroText}>
              <span className={styles.badge}>Blockchain Powered</span>
              <h1 className={styles.heroTitle}>
                Secure Medical <span className={styles.gradientText}>Records</span> Management
              </h1>
              <p className={styles.heroDescription}>
                Access all your medical practice tools securely on blockchain for enhanced patient care and efficient
                healthcare management.
              </p>
              <div className={styles.buttonGroup}>
                <button className={styles.primaryButton}>Get Started</button>
                <button className={styles.outlineButton}>Learn More</button>
              </div>
            </div>
            <div className={styles.heroVisual}>
              {/* Abstract Blockchain Visualization */}
              <div className={styles.blockchainCard}>
                <div className={styles.circleDecorTop}></div>
                <div className={styles.circleDecorBottom}></div>

                <h3 className={styles.blockchainTitle}>Blockchain Security</h3>

                {/* New Blockchain Visualization */}
                <div className={styles.blockchainVisual}>
                  <div className={styles.blockchainBlocks}>
                    {[1, 2, 3].map((num) => (
                      <div key={num} className={styles.blockRow}>
                        <div className={styles.blockNumber}>{num}</div>
                        <div className={styles.blockContent}>
                          <div className={styles.blockInfo}>
                            <div className={styles.hashContainer}>
                              <KeyIcon className={styles.keyIcon} />
                              <span className={styles.hashText}>
                                Hash: 0x{Math.random().toString(16).substring(2, 10)}
                              </span>
                            </div>
                            <span className={styles.verifiedBadge}>Verified</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.blockRow}>
                    <div className={styles.blockNumber}>+</div>
                    <div className={styles.newBlockContent}>
                      <span className={styles.newBlockText}>New blocks added securely</span>
                    </div>
                  </div>
                </div>

                <div className={styles.securityFeatures}>
                  <div className={styles.featureItem}>
                    <div className={styles.featureDot} style={{ backgroundColor: "var(--teal-500)" }}></div>
                    <p className={styles.featureText}>End-to-end encryption</p>
                  </div>
                  <div className={styles.featureItem}>
                    <div className={styles.featureDot} style={{ backgroundColor: "var(--cyan-500)" }}></div>
                    <p className={styles.featureText}>Immutable record keeping</p>
                  </div>
                  <div className={styles.featureItem}>
                    <div className={styles.featureDot} style={{ backgroundColor: "var(--emerald-500)" }}></div>
                    <p className={styles.featureText}>Decentralized storage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className={styles.bgDecorRight}></div>
        <div className={styles.bgDecorLeft}></div>
      </section>

      {/* Services Section */}
      <section className={styles.servicesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Doctor Services</h2>
          <div className={styles.titleUnderline}></div>
          <p className={styles.sectionDescription}>
            Our platform provides secure and efficient tools for healthcare professionals
          </p>
        </div>

        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <div key={index} className={styles.serviceGroup}>
              <div className={styles.serviceCard}>
                <div className={styles.cardTopBar}></div>
                <div className={styles.cardContent}>
                  <div className={styles.iconContainer}>{service.icon}</div>
                  <h3 className={styles.cardTitle}>{service.title}</h3>
                  <p className={styles.cardDescription}>{service.desc}</p>
                </div>
                <div className={styles.cardFooter}>
                  <Link href={service.link} className={styles.cardLink}>
                    Access Records
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={styles.arrowIcon}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresGrid}>
          <div className={styles.featuresText}>
            <h2 className={styles.featuresTitle}>Why Choose Blockchain for Healthcare?</h2>
            <div className={styles.featuresList}>
              <div className={styles.featureRow}>
                <div className={styles.featureIconBox}>
                  <ShieldIcon className={styles.featureIcon} />
                </div>
                <div className={styles.featureContent}>
                  <h3 className={styles.featureTitle}>Enhanced Security</h3>
                  <p className={styles.featureDescription}>
                    Medical data is encrypted and secured using advanced blockchain technology, preventing unauthorized
                    access.
                  </p>
                </div>
              </div>

              <div className={styles.featureRow}>
                <div className={styles.featureIconBox}>
                  <DatabaseIcon className={styles.featureIcon} />
                </div>
                <div className={styles.featureContent}>
                  <h3 className={styles.featureTitle}>Immutable Records</h3>
                  <p className={styles.featureDescription}>
                    Once data is recorded, it cannot be altered or deleted, ensuring the integrity of medical records.
                  </p>
                </div>
              </div>

              <div className={styles.featureRow}>
                <div className={styles.featureIconBox}>
                  <KeyIcon className={styles.featureIcon} />
                </div>
                <div className={styles.featureContent}>
                  <h3 className={styles.featureTitle}>Controlled Access</h3>
                  <p className={styles.featureDescription}>
                    Patients and doctors have granular control over who can access specific medical information.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.featuresVisual}>
            <div className={styles.visualContainer}>
              <div className={styles.visualContent}>
                <div className={styles.blockchainAnimation}>
                  <div className={styles.outerRing}></div>
                  <div className={styles.innerRing}></div>
                  <div className={styles.centerIcon}>
                    <ShieldIcon className={styles.animationIcon} />
                  </div>

                  {/* Nodes */}
                  <div className={`${styles.node} ${styles.node1}`}></div>
                  <div className={`${styles.node} ${styles.node2}`}></div>
                  <div className={`${styles.node} ${styles.node3}`}></div>
                  <div className={`${styles.node} ${styles.node4}`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}