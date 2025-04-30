"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import styles from "./adaapter.module.css"


// Define service type
interface Service {
  title: string
  desc: string
  alt: string
  link: string
  image: string
  details: {
    title: string
    points: string[]
  }[]
}

const services: Service[] = [
  {
    title: "Hồ Sơ",
    desc: "Số hóa hồ sơ y tế dưới dạng NFT, tạo quyền sở hữu duy nhất và lưu trữ vĩnh viễn trên blockchain.",
    alt: "Hồ sơ",
    link: "/service/hoso",
    image: "/a1.jpg",
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
    image: "/25496.jpg",
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
    image: "/25497.jpg",
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
    image: "/25497.jpg",
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
    image: "/a2.jpg",
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

const ServicesSection: React.FC = () => {
  const [activeService, setActiveService] = useState<Service | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Xử lý hover vào thẻ dịch vụ
  const handleServiceHover = (service: Service) => {
    // Xóa timeout hiện tại nếu có
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Thêm hiệu ứng mượt mà khi mở rộng
    document.body.style.overflow = "hidden"
    setActiveService(service)

    // Thêm timeout nhỏ để tạo hiệu ứng mượt mà
    setTimeout(() => {
      setIsExpanded(true)
      // Thêm class để ngăn cuộn trang
      document.body.classList.add(styles.noScroll)
    }, 50)
  }

  // Xử lý mouse leave
  const handleServiceLeave = () => {
    // Thêm timeout để tránh đóng ngay lập tức khi di chuyển chuột
    timeoutRef.current = setTimeout(() => {
      handleClose()
    }, 300)
  }

  // Xử lý khi hover vào phần mở rộng
  const handleExpandedHover = () => {
    // Xóa timeout nếu có để ngăn đóng khi đang hover trên phần mở rộng
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  // Xử lý đóng phần mở rộng
  const handleClose = () => {
    setIsExpanded(false)
    // Xóa class để cho phép cuộn trang trở lại
    document.body.classList.remove(styles.noScroll)

    // Thêm timeout để đảm bảo animation hoàn tất trước khi xóa activeService
    setTimeout(() => {
      setActiveService(null)
      document.body.style.overflow = ""
    }, 500)
  }

  // Xử lý phím Escape để đóng phần mở rộng
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose()
      }
    }

    if (isExpanded) {
      window.addEventListener("keydown", handleEscKey)
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey)
      // Xóa timeout khi component unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isExpanded])

  return (
    <div className={styles.servicesContainer}>
      <h2 className={styles.servicesTitle}>Dịch Vụ Bệnh Nhân</h2>
      <div className={styles.servicesGrid}>
        {services.map((service, index) => (
          <div
            key={index}
            className={styles.serviceCard}
            onMouseEnter={() => handleServiceHover(service)}
            onMouseLeave={handleServiceLeave}
          >
            <div className={styles.serviceIcon}>
              <img src={service.image} alt={service.alt} className={styles.serviceImg} />
            </div>
            <div className={styles.serviceContent}>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceText}>{service.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Phần mở rộng toàn màn hình */}
      {isExpanded && activeService && (
        <div
          className={`${styles.fullscreenOverlay} ${isExpanded ? styles.active : ""}`}
          onMouseEnter={handleExpandedHover}
          onMouseLeave={handleServiceLeave}
        >
          <button className={styles.closeButton} onClick={handleClose} aria-label="Đóng">
            <X size={24} />
          </button>

          <div className={styles.serviceCardExpanded}>
            <div className={styles.serviceCardExpandedContent}>
              <h2 className={styles.expandedServiceTitle}>{activeService.title}</h2>
              <div className={styles.expandedServiceIcon}>
                <img
                  src={activeService.image}
                  alt={activeService.alt}
                  className={styles.expandedServiceImg}
                />
              </div>
              <p className={styles.expandedServiceText}>{activeService.desc}</p>
              <Link href={activeService.link} className={styles.actionButton}>
                Tìm hiểu thêm
              </Link>
            </div>

            <div className={styles.serviceCardExpandedDetails}>
              {activeService.details.map((detail, index) => (
                <div key={index} className={styles.detailSection}>
                  <h4 className={styles.detailTitle}>{detail.title}</h4>
                  <ul className={styles.detailList}>
                    {detail.points.map((point, pointIndex) => (
                      <li key={pointIndex} className={styles.detailItem}>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const MedID: React.FC = () => {
  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.title}>Smart Healthcare on Blockchain</h1>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <p>Combining cutting-edge technology with blockchain to deliver secure and intelligent healthcare services</p>
              <div className={styles.buttons}>
                <button className={styles.primaryBtn}>Schedule Appointment</button>
                <button className={styles.secondaryBtn}>Blockchain Consultation</button>
              </div>
            </div>
            <div className={styles.heroImage}>
              <section className={styles.hero_1}>
                <div className={styles.hero_content}>
                 
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <ServicesSection />
    </div>
  );
}

export default MedID
