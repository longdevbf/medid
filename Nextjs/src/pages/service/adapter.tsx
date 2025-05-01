"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, FileText, Unlock, RefreshCw, LockKeyhole } from "lucide-react"
import styles from "./adaapter.module.css"

// Define service type
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

// Define slideshow images
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
    title: "Hồ Sơ",
    desc: "Số hóa hồ sơ y tế dưới dạng NFT, tạo quyền sở hữu duy nhất và lưu trữ vĩnh viễn trên blockchain.",
    alt: "Hồ sơ",
    link: "/service/hoso",
    icon: <FileText className={styles.serviceIcon} />,
    details: [
      {
        title: "Tính năng chính",
        points: [
          "Lưu trữ vĩnh viễn trên blockchain",
          "Bảo mật thông tin cá nhân",
          "Truy cập dễ dàng từ mọi thiết bị",
          "Chia sẻ có kiểm soát với bác sĩ",
        ],
      },
      {
        title: "Lợi ích",
        points: [
          "Giảm thiểu thủ tục giấy tờ",
          "Tránh mất mát hồ sơ y tế",
          "Theo dõi lịch sử y tế dễ dàng",
          "Tiết kiệm thời gian khi khám bệnh",
        ],
      },
    ],
  },
  {
    title: "Lock Hồ Sơ",
    desc: "Bảo mật hồ sơ y tế của bạn trên công nghệ blockchain, đảm bảo an toàn thông tin tối đa.",
    alt: "Lock hồ sơ",
    link: "/service/lockhoso",
    icon: <LockKeyhole className={styles.serviceIcon} />,
    details: [
      {
        title: "Tính năng bảo mật",
        points: ["Mã hóa end-to-end", "Xác thực đa yếu tố", "Kiểm soát quyền truy cập", "Lưu trữ phi tập trung"],
      },
      {
        title: "Ứng dụng",
        points: [
          "Bảo vệ thông tin nhạy cảm",
          "Ngăn chặn truy cập trái phép",
          "Tuân thủ quy định bảo mật y tế",
          "Bảo vệ quyền riêng tư cá nhân",
        ],
      },
    ],
  },
  {
    title: "Unlock 1 Hồ Sơ",
    desc: "Mở khóa hồ sơ y tế an toàn khi cần thiết, với xác thực đa lớp đảm bảo thông tin chỉ được truy cập bởi người có quyền.",
    alt: "Unlock hồ sơ",
    link: "/service/unlock",
    icon: <Unlock className={styles.serviceIcon} />,
    details: [
      {
        title: "Quy trình mở khóa",
        points: [
          "Xác thực danh tính người dùng",
          "Kiểm tra quyền truy cập",
          "Ghi lại nhật ký truy cập",
          "Giới hạn thời gian truy cập",
        ],
      },
      {
        title: "Đối tượng sử dụng",
        points: ["Bệnh nhân cần chia sẻ hồ sơ", "Bác sĩ được ủy quyền", "Cơ sở y tế đối tác", "Dịch vụ cấp cứu y tế"],
      },
    ],
  },
  {
    title: "Unlock 2 Hồ Sơ",
    desc: "Mở khóa hồ sơ y tế an toàn khi cần thiết, với xác thực đa lớp đảm bảo thông tin chỉ được truy cập bởi người có quyền.",
    alt: "Unlock hồ sơ",
    link: "/service/unlock2-hoso",
    icon: <Unlock className={styles.serviceIcon} />,
    details: [
      {
        title: "Tính năng nâng cao",
        points: [
          "Mở khóa nhiều hồ sơ cùng lúc",
          "Phân quyền chi tiết theo mục",
          "Theo dõi lịch sử truy cập",
          "Tự động khóa sau thời gian quy định",
        ],
      },
      {
        title: "Ứng dụng thực tế",
        points: [
          "Nghiên cứu y khoa (ẩn danh)",
          "Điều trị liên chuyên khoa",
          "Tham vấn ý kiến chuyên gia",
          "Chuyển viện điều trị",
        ],
      },
    ],
  },
  {
    title: "Update Hồ Sơ",
    desc: "Cập nhật thông tin sức khỏe liên tục, đảm bảo hồ sơ y tế luôn chính xác và cập nhật nhất.",
    alt: "Update hồ sơ",
    link: "/service/update",
    icon: <RefreshCw className={styles.serviceIcon} />,
    details: [
      {
        title: "Loại thông tin cập nhật",
        points: [
          "Kết quả xét nghiệm mới",
          "Đơn thuốc và liệu trình điều trị",
          "Chỉ số sức khỏe theo dõi",
          "Lịch hẹn và tái khám",
        ],
      },
      {
        title: "Quy trình cập nhật",
        points: [
          "Xác minh nguồn thông tin",
          "Kiểm tra tính chính xác",
          "Lưu trữ phiên bản cũ để tham chiếu",
          "Thông báo cho các bên liên quan",
        ],
      },
    ],
  },
]

// Image Slideshow Component
const ImageSlideshow = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length)
    }, 5000) // Change image every 5 seconds

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
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section className={styles.servicesSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Doctor Services</h2>

        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <div
              key={index}
              className={styles.serviceWrapper}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <Link href={service.link} className={styles.serviceLink}>
                <div className={`${styles.serviceCard} ${activeIndex === index ? styles.serviceCardActive : ""}`}>
                  <div className={styles.serviceContent}>
                    <div className={styles.serviceHeader}>
                      <div className={styles.serviceIconWrapper}>{service.icon}</div>
                      <h3 className={styles.serviceTitle}>{service.title}</h3>
                    </div>
                    <p className={styles.serviceDescription}>{service.desc}</p>

                    {activeIndex === index && (
                      <div className={styles.serviceDetails}>
                        {service.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className={styles.detailSection}>
                            <h4 className={styles.detailTitle}>{detail.title}</h4>
                            <ul className={styles.detailList}>
                              {detail.points.map((point, pointIndex) => (
                                <li key={pointIndex} className={styles.detailPoint}>
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className={styles.viewDetails}>
                      <span>Xem chi tiết</span>
                      <ArrowRight className={styles.arrowIcon} />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
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
              {/* Replace static image with slideshow */}
              <ImageSlideshow />
              <h2 className={styles.heroCardTitle}>Secure Medical Records</h2>
              <p className={styles.heroCardDescription}>
                Bảo vệ thông tin y tế của bạn với công nghệ blockchain tiên tiến, đảm bảo tính riêng tư và an toàn tuyệt
                đối.
              </p>
              <Link href="/learn-more" className={styles.heroButton}>
                Tìm hiểu thêm
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
