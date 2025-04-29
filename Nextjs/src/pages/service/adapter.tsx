import React from 'react';
import Link from 'next/link';
import styles from '../../styles/adapter_service.module.css';

const ServicesSection: React.FC = () => {
  return (
    <div className={styles.servicesContainer}>
      <h2 className={styles.servicesTitle}>Dịch Vụ Bệnh Nhân</h2>
      <div className={styles.servicesGrid}>
        {[
          {
            title: 'Hồ Sơ',
            desc: 'Số hóa hồ sơ y tế dưới dạng NFT, tạo quyền sở hữu duy nhất và lưu trữ vĩnh viễn trên blockchain.',
            alt: 'Hồ sơ',
            link: '/service/hoso',
          },
          {
            title: 'Lock Hồ Sơ',
            desc: 'Bảo mật hồ sơ y tế của bạn trên công nghệ blockchain, đảm bảo an toàn thông tin tối đa.',
            alt: 'Lock hồ sơ',
            link: '/service/lockhoso',
          },
          {
            title: 'Unlock 1 Hồ Sơ',
            desc: 'Mở khóa hồ sơ y tế an toàn khi cần thiết, với xác thực đa lớp đảm bảo thông tin chỉ được truy cập bởi người có quyền.',
            alt: 'Unlock hồ sơ',
            link: '/service/unlock',
          },
          {
            title: 'Unlock 2 Hồ Sơ',
            desc: 'Mở khóa hồ sơ y tế an toàn khi cần thiết, với xác thực đa lớp đảm bảo thông tin chỉ được truy cập bởi người có quyền.',
            alt: 'Unlock hồ sơ',
            link: '/service/unlock2-hoso',
          },
          {
            title: 'Update Hồ Sơ',
            desc: 'Cập nhật thông tin sức khỏe liên tục, đảm bảo hồ sơ y tế luôn chính xác và cập nhật nhất.',
            alt: 'Update hồ sơ',
            link: '/service/update',
          },
        ].map((service, index) => (
          <Link key={index} href={service.link}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <img src="/api/placeholder/100/100" alt={service.alt} className={styles.serviceImg} />
              </div>
              <div className={styles.serviceContent}>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceText}>{service.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const MedID: React.FC = () => {
  return (
    <div className={styles.body}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Dịch Vụ Y Tế Thông Minh</h1>
        <p className={styles.heroText}>
          Chúng tôi cung cấp các dịch vụ y tế hiện đại với sự kết hợp công nghệ blockchain, giúp bảo mật dữ liệu y tế và trải nghiệm chăm sóc sức khỏe toàn diện.
        </p>
      </section>

      <ServicesSection />
    </div>
  );
};

export default MedID;