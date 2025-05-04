"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, FileText, Unlock, RefreshCw, LockKeyhole } from "lucide-react"
import styles from "./adaapter.module.css"

interface Service {
  title: string
  desc: string
  alt: string
  link: string
  icon: React.ReactNode
  details: {
    title: string
    points: string[]
  }[]
}

const slideshowImages = [
  {
    src: "/b1.png",
    alt: "Medical data visualization",
  },
  {
    src: "/b2.png",
    alt: "Secure health records",
  },
  {
    src: "/b3.png",
    alt: "Doctor using tablet",
  },
]

const services: Service[] = [
  {
    title: "Mint Medical Records",
    desc: "Digitize medical records as NFTs, enabling unique ownership and permanent storage on the blockchain.",
    alt: "Medical Records",
    link: "/service/hoso",
    icon: <FileText className={styles.serviceIcon} />,
    details: [
      {
        title: "Key Features",
        points: [
          "Permanently stored on blockchain",
          "Personal information security",
          "Easy access from any device",
          "Controlled sharing with doctors",
        ],
      },
      {
        title: "Benefits",
        points: [
          "Reduces paperwork",
          "Prevents record loss",
          "Easy tracking of medical history",
          "Saves time during check-ups",
        ],
      },
    ],
  },
  {
    title: "Lock Medical Records",
    desc: "Secure your medical records with blockchain technology to ensure maximum information safety.",
    alt: "Lock medical record",
    link: "/service/lockhoso",
    icon: <LockKeyhole className={styles.serviceIcon} />,
    details: [
      {
        title: "Security Features",
        points: ["End-to-end encryption", "Multi-factor authentication", "Access control", "Decentralized storage"],
      },
      {
        title: "Use Cases",
        points: [
          "Protect sensitive information",
          "Prevent unauthorized access",
          "Comply with healthcare regulations",
          "Safeguard personal privacy",
        ],
      },
    ],
  },
  {
    title: "Unlock 1 Medical Record",
    desc: "Securely unlock medical records when needed, ensuring only authorized access through multi-layer authentication.",
    alt: "Unlock record",
    link: "/service/unlock",
    icon: <Unlock className={styles.serviceIcon} />,
    details: [
      {
        title: "Unlock Process",
        points: [
          "User identity verification",
          "Access permission check",
          "Access logs tracking",
          "Time-limited access",
        ],
      },
      {
        title: "Target Users",
        points: ["Patients sharing records", "Authorized doctors", "Partner medical facilities", "Emergency services"],
      },
    ],
  },
  {
    title: "Unlock 2 Medical Records",
    desc: "Securely unlock multiple records with detailed permission control and session-based access expiration.",
    alt: "Unlock record",
    link: "/service/unlock2-hoso",
    icon: <Unlock className={styles.serviceIcon} />,
    details: [
      {
        title: "Advanced Features",
        points: [
          "Unlock multiple records at once",
          "Granular section-level access control",
          "Access history tracking",
          "Auto-lock after defined duration",
        ],
      },
      {
        title: "Real-world Applications",
        points: [
          "Anonymous medical research",
          "Interdisciplinary treatments",
          "Expert consultations",
          "Hospital transfers",
        ],
      },
    ],
  },
  {
    title: "Update Medical Records",
    desc: "Continuously update health data to ensure the most accurate and current medical records.",
    alt: "Update record",
    link: "/service/update",
    icon: <RefreshCw className={styles.serviceIcon} />,
    details: [
      {
        title: "Types of Updates",
        points: [
          "Latest test results",
          "Prescriptions and treatment plans",
          "Health tracking indicators",
          "Appointments and follow-ups",
        ],
      },
      {
        title: "Update Process",
        points: [
          "Verify data source",
          "Ensure data accuracy",
          "Store older versions for reference",
          "Notify relevant stakeholders",
        ],
      },
    ],
  },
]

const ImageSlideshow = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.slideshowContainer}>
      {slideshowImages.map((image, index) => (
        <div key={index} className={`${styles.slideshowImage} ${index === currentImageIndex ? styles.active : ""}`}>
          <div className={styles.imageWrapper}>
            <img src={image.src || "/placeholder.svg"} alt={image.alt} className={styles.slideImage} />
          </div>
        </div>
      ))}
      <div className={styles.slideshowDots}>
        {slideshowImages.map((_, index) => (
          <span
            key={index}
            className={`${styles.slideshowDot} ${index === currentImageIndex ? styles.activeDot : ""}`}
            onClick={() => setCurrentImageIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  )
}

const ServicesSection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  console.log(hoveredIndex)
  return (
    <section className={styles.servicesSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Doctor Services</h2>

        <div className={styles.servicesGrid}>
          {services.map((service, index) => {
            
            return (
              <div
                key={index}
                className={`${styles.serviceWrapper}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Link href={service.link} className={styles.serviceLink}>
                  <div className={styles.serviceCard}>
                    <div className={styles.serviceContent}>
                      <div className={styles.serviceHeader}>
                        <div className={styles.serviceIconWrapper}>{service.icon}</div>
                        <h3 className={styles.serviceTitle}>{service.title}</h3>
                      </div>
                      <p className={styles.serviceDescription}>{service.desc}</p>

                      <div className={styles.viewDetails}>
                        <span>View Details</span>
                        <ArrowRight className={styles.arrowIcon} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const MedID: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
      <section className={styles.heroSection}>
        <div className={styles.heroBackground}></div>

        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Patient Service <span className={styles.highlight}>Information</span>
            </h1>
            <div className={styles.titleUnderline}></div>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroCard}>
              <ImageSlideshow />
              <h2 className={styles.heroCardTitle}>Secure Medical Records</h2>
              <p className={styles.heroCardDescription}>
                Protect your health information with advanced blockchain technology, ensuring complete privacy and security.
              </p>
              <Link href="/learn-more" className={styles.heroButton}>
                Learn more
                <ArrowRight className={styles.buttonIcon} />
              </Link>
            </div>

            <div className={styles.blockchainCard}>
              <h3 className={styles.blockchainTitle}>Blockchain Technology</h3>
              <div className={styles.blockchainVisual}>
                <div className={styles.blockchainBlocks}>
                  {[1, 2, 3, "n"].map((block, index) => (
                    <div key={index} className={styles.blockchainBlockWrapper}>
                      <div className={styles.blockchainBlock}>Block #{block}</div>
                      {index < 3 && <div className={styles.blockchainArrow}>→</div>}
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.blockchainInfo}>
                <div className={styles.infoPoint}>
                  <div className={styles.infoDot}></div>
                  <p>Medical records are encrypted and secure</p>
                </div>
                <div className={styles.infoPoint}>
                  <div className={styles.infoDot}></div>
                  <p>Data is securely stored and centrally accessible</p>
                </div>
                <div className={styles.infoPoint}>
                  <div className={styles.infoDot}></div>
                  <p>Immutable record keeping ensures data integrity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesSection />
    </div>
  )
}

export default MedID
