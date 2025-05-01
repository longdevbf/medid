import React, { useState } from 'react';
import styles from './blockchainHealth.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHospital, faSearch, faCopy } from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebookF, 
  faTwitter, 
  faLinkedinIn, 
  faInstagram 
} from '@fortawesome/free-brands-svg-icons';

const doctors = [
  {
    id: 1,
    name: 'PhD. MD. Tran Duc Long',
    specialty: 'Cardiology Department',
    image: 'https://img4.thuthuatphanmem.vn/uploads/2021/01/10/hinh-anh-bac-si-da-den-dien-trai_021526359.jpg',
    experience: '75+',
    patients: '30.2k',
    rating: '5.0',
    description: 'Leading cardiology expert with over 15 years of experience, successfully treating many complex cases. Graduated from Hanoi Medical University and trained in France.',
    walletAddress: 'addr_test1qrsv6r79uzuq0uwvj7jez8qy7pl308egptkvuf99p84n0rt7m2m2y4lpett6mh7pgv5lktq0ktcmgl87tufpstn5nxmqtyv065',
  },
  {
    id: 2,
    name: 'Assoc. Prof. PhD. Tran Thi Binh',
    specialty: 'Pediatrics Department',
    image: 'https://vnn-imgs-f.vgcloud.vn/2021/08/04/09/bac-si-xinh-dep-nganh-da-lieu-tham-my-o-tp-hcm.jpg',
    experience: '12',
    patients: '2.8k',
    rating: '4.8',
    description: 'Pediatric specialist with experience treating complex diseases in children. Worked at the National Children\'s Hospital and trained in Singapore.',
    walletAddress: '0x7A2bC4d1E9F8B25a3e5c91F7aD23e3Dc2d6E4F10',
  },
  {
    id: 3,
    name: 'Prof. PhD. Le Minh Cuong',
    specialty: 'Neurology Department',
    image: 'https://nguoinoitieng.tv/images/nnt/102/0/bga5.jpg',
    experience: '20+',
    patients: '5.1k',
    rating: '5.0',
    description: 'One of Vietnam\'s leading neurology experts. Has published numerous international research papers and successfully treated many difficult cases.',
    walletAddress: '0x3E9a8B1Df6C5D8a7E9F1b4B2F8E5c6D7e8F9a0B1',
  },
  {
    id: 4,
    name: 'MD. Specialist Level I Pham Thanh Ha',
    specialty: 'Dermatology Department',
    image: 'https://watermark.lovepik.com/photo/20211208/large/lovepik-young-female-doctor-image-picture_501673088.jpg',
    experience: '8',
    patients: '1.9k',
    rating: '4.7',
    description: 'Specialist in dermatology and skin aesthetics. Has experience treating complex skin diseases and performing non-invasive aesthetic procedures.',
    walletAddress: '0x4C2D3E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D',
  },
  {
    id: 5,
    name: 'PhD. MD. Vu Quang Dung',
    specialty: 'ENT Department',
    image: 'http://3.bp.blogspot.com/-vugJVgyECIM/VbAEw0OGrkI/AAAAAAAADls/5KKVlWo4dm8/s1600/doctor5.jpg',
    experience: '10',
    patients: '2.3k',
    rating: '4.8',
    description: 'Expert in ear, nose, and throat with deep expertise in ENT endoscopic surgery and treatment of complex laryngeal pathologies.',
    walletAddress: '0x9A8B7C6D5E4F3A2B1C0D9E8F7A6B5C4D3E2F1A0B',
  },
  {
    id: 6,
    name: 'Assoc. Prof. PhD. Do Thi Lan Anh',
    specialty: 'Obstetrics Department',
    image: 'https://benhvienbacha.vn/wp-content/uploads/2019/10/nhi-3.jpg',
    experience: '18',
    patients: '4.5k',
    rating: '4.9',
    description: 'Leading expert in obstetrics and gynecology, with many years of experience treating complex cases and safely delivering thousands of births.',
    walletAddress: '0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B',
  },
  {
    id: 7,
    name: 'Assoc. Prof. PhD. Tokuda',
    specialty: 'Obstetrics Department',
    image: 'https://acc.vn/wp-content/uploads/2021/04/bac-si-wade.png',
    experience: '18',
    patients: '4.5k',
    rating: '4.9',
    description: 'Leading expert in obstetrics and gynecology, with many years of experience treating complex cases and safely delivering thousands of births.',
    walletAddress: '0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B',
  },
  {
    id: 8,
    name: 'Assoc. Prof. PhD. Emi Fukuda',
    specialty: 'Obstetrics Department',
    image: 'https://media.hitekno.com/thumbs/2022/09/23/44739-eimi-fukada/730x480-img-44739-eimi-fukada.jpg',
    experience: '18',
    patients: '4.5k',
    rating: '4.9',
    description: 'Leading expert in obstetrics and gynecology, with many years of experience treating complex cases and safely delivering thousands of births.',
    walletAddress: '0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B',
  }
];

const BlockchainHealth: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [experience, setExperience] = useState('');
  const [availability, setAvailability] = useState('');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Wallet address copied!');
  };

  return (
    <div>
      
      
      <section className={styles.pageTitle}>
        <div className={styles.container}>
          <h1>Find Specialist Doctors</h1>
          <p>We proudly introduce our team of experienced, dedicated physicians who always put the health of patients first</p>
        </div>
      </section>
      
      <main className={styles.mainContent}>
        <section className={styles.filters}>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label htmlFor="specialty">Specialty</label>
              <select 
                id="specialty" 
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              >
                <option value="">All specialties</option>
                <option value="tim-mach">Cardiology</option>
                <option value="than-kinh">Neurology</option>
                <option value="da-lieu">Dermatology</option>
                <option value="nhi">Pediatrics</option>
                <option value="san">Obstetrics</option>
                <option value="mat">Ophthalmology</option>
                <option value="rang-ham-mat">Dentistry</option>
                <option value="tai-mui-hong">ENT</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label htmlFor="experience">Experience</label>
              <select 
                id="experience" 
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option value="">All</option>
                <option value="0-5">0-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10-15">10-15 years</option>
                <option value="15+">Over 15 years</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label htmlFor="availability">Availability</label>
              <select 
                id="availability"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                <option value="">All</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="weekend">Weekend</option>
              </select>
            </div>
          </div>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label htmlFor="search">Search by name</label>
              <input 
                type="text" 
                id="search" 
                placeholder="Enter doctor's name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className={styles.filterGroup} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button className={styles.searchBtn}>
                <FontAwesomeIcon icon={faSearch} /> Search
              </button>
            </div>
          </div>
        </section>
        
        <section className={styles.doctorGrid}>
          {doctors.map((doctor) => (
            <div key={doctor.id} className={styles.doctorCard}>
              <div className={styles.doctorImg}>
                <img src={doctor.image} alt={doctor.name} />
              </div>
              <div className={styles.doctorInfo}>
                <h3 className={styles.doctorName}>{doctor.name}</h3>
                <p className={styles.doctorSpecialty}>{doctor.specialty}</p>
                <div className={styles.doctorStats}>
                  <div className={styles.stat}>
                    <div className={styles.statNumber}>{doctor.experience}</div>
                    <div className={styles.statLabel}>Years exp.</div>
                  </div>
                  <div className={styles.stat}>
                    <div className={styles.statNumber}>{doctor.patients}</div>
                    <div className={styles.statLabel}>Patients</div>
                  </div>
                  <div className={styles.stat}>
                    <div className={styles.statNumber}>{doctor.rating}</div>
                    <div className={styles.statLabel}>Rating</div>
                  </div>
                </div>
                <p className={styles.doctorDesc}>{doctor.description}</p>
                <div className={styles.walletAddress}>
                  <span className={styles.walletText}>{doctor.walletAddress}</span>
                  <button 
                    className={styles.copyBtn} 
                    onClick={() => copyToClipboard(doctor.walletAddress)}
                  >
                    <FontAwesomeIcon icon={faCopy} />
                  </button>
                </div>
                <div className={styles.doctorActions}>
                  <button className={`${styles.actionBtn} ${styles.viewProfile}`}>View Profile</button>
                  <button className={`${styles.actionBtn} ${styles.bookAppointment}`}>Book Appointment</button>
                </div>
              </div>
            </div>
          ))}
        </section>
        
        <div className={styles.pagination}>
          <div className={`${styles.pageItem} ${styles.active}`}>1</div>
          <div className={styles.pageItem}>2</div>
          <div className={styles.pageItem}>3</div>
          <div className={styles.pageItem}>4</div>
          <div className={styles.pageItem}>5</div>
        </div>
      </main>
      
      
    </div>
  );
};

export default BlockchainHealth;