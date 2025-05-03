import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@meshsdk/react';
import Image from 'next/image';
import Link from 'next/link';
import defaultAvatar from '../../assets/default-avatar.jpg';
import styles from './User.module.css';
import { FaCalendarAlt, FaFileMedical, FaHistory, FaPrescriptionBottleAlt, 
  FaBell, FaCommentMedical, FaClipboardList, FaMedkit, FaCopy, FaUserMd } from 'react-icons/fa';

const UserProfile: React.FC = () => {
  const { connected, wallet } = useWallet();
  const router = useRouter();
  
  // User state
  const [userAvatar, setUserAvatar] = useState<string | any>(defaultAvatar);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [didNumber, setDidNumber] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState<string>('0');
  const [userAssets, setUserAssets] = useState<any[]>([]);
  const [message, setMessage] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<{from: string, message: string, time: string}[]>([
    {from: 'Dr. Smith', message: 'Chào bạn, bạn có cần hỗ trợ gì không?', time: '09:30 AM'},
    {from: 'You', message: 'Tôi muốn đặt lịch khám vào thứ 5', time: '09:32 AM'},
    {from: 'Dr. Smith', message: 'Vâng, tôi sẽ kiểm tra lịch trống và thông báo lại cho bạn', time: '09:35 AM'},
  ]);
  
  // Demo data
  const appointments = [
    { id: 1, date: '15/05/2025', time: '10:30 AM', doctor: 'Dr. Smith', department: 'Cardiology', status: 'Scheduled' },
    { id: 2, date: '28/05/2025', time: '02:15 PM', doctor: 'Dr. Johnson', department: 'Orthopedics', status: 'Pending' },
  ];
  
  const medicalHistory = [
    { id: 1, date: '10/01/2025', diagnosis: 'Hypertension', doctor: 'Dr. Smith', notes: 'Prescribed medication and lifestyle changes' },
    { id: 2, date: '05/12/2024', diagnosis: 'Influenza', doctor: 'Dr. Williams', notes: 'Bed rest and fluids recommended' },
  ];
  
  const prescriptions = [
    { id: 1, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', remaining: 14 },
    { id: 2, name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily with evening meal', remaining: 21 },
  ];
  
  const labResults = [
    { id: 1, name: 'Blood Test', date: '05/01/2025', status: 'Completed', result: 'Normal' },
    { id: 2, name: 'X-Ray', date: '05/01/2025', status: 'Completed', result: 'Available' },
  ];

  // Check authentication on page load
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const isAuthenticated = sessionStorage.getItem('medid_authenticated') === 'true';
        const storedAddress = sessionStorage.getItem('medid_wallet_address') || '';
        const storedDid = sessionStorage.getItem('medid_did_number') || '';
        
        setWalletAddress(storedAddress);
        setDidNumber(storedDid);
        
        if (!isAuthenticated) {
          router.push('/');
          return false;
        }
        return true;
      }
      return false;
    };
    
    const authenticated = checkAuth();
    if (!authenticated) return;
    
    // Load user data
    const fetchUserData = async () => {
      if (wallet && connected) {
        try {
          // Fetch wallet balance
          const lovelace = await wallet.getLovelace();
          const adaBalance = (parseInt(lovelace) / 1000000).toFixed(2);
          setWalletBalance(adaBalance);
          
          // Fetch assets
          const assets = await wallet.getAssets();
          setUserAssets(assets || []);
        } catch (error) {
          console.error("Error loading user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [wallet, connected, router]);

  // Handle avatar change
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setUserAvatar(reader.result);
          localStorage.setItem('userAvatar', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Copy wallet address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Đã sao chép vào clipboard!');
  };
  
  // Handle chat submit
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') return;
    
    const newMessage = {
      from: 'You',
      message: message,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setMessage('');
    
    // Simulate doctor response after 2 seconds
    setTimeout(() => {
      const doctorResponse = {
        from: 'Dr. Smith',
        message: 'Cảm ơn bạn đã liên hệ, tôi sẽ phản hồi sớm nhất có thể.',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      setChatMessages(prev => [...prev, doctorResponse]);
    }, 2000);
  };
  
  // Format wallet address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };
  
  if (loading) {
    return <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Đang tải thông tin bệnh nhân...</p>
    </div>;
  }

  return (
    <div className={styles.userProfileContainer}>
      <div className={styles.sidebar}>
        <div className={styles.profileSummary}>
          <div className={styles.avatarWrapper}>
            <Image 
              src={userAvatar} 
              alt="User Avatar" 
              width={100} 
              height={100}
              className={styles.profileAvatar} 
            />
            <div className={styles.avatarUpload}>
              <label htmlFor="avatar-upload" className={styles.uploadButton}>
                <FaUserMd />
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                className={styles.fileInput}
              />
            </div>
          </div>
          <h2>Bệnh nhân</h2>
          <p className={styles.userId}>ID: MED-{didNumber || '12345'}</p>
        </div>
        
        <nav className={styles.sidebarNav}>
          <Link href="#appointments" className={styles.navLink}>
            <FaCalendarAlt /> Lịch hẹn
          </Link>
          <Link href="#medical-history" className={styles.navLink}>
            <FaHistory /> Lịch sử khám
          </Link>
          <Link href="#prescriptions" className={styles.navLink}>
            <FaPrescriptionBottleAlt /> Đơn thuốc
          </Link>
          <Link href="#test-results" className={styles.navLink}>
            <FaFileMedical /> Kết quả xét nghiệm
          </Link>
          <Link href="#blockchain-assets" className={styles.navLink}>
            <FaClipboardList /> Tài sản y tế
          </Link>
          <Link href="#doctor-chat" className={styles.navLink}>
            <FaCommentMedical /> Tư vấn bác sĩ
          </Link>
        </nav>
      </div>
      
      <div className={styles.mainContent}>
        <div className={styles.welcomeBanner}>
          <div>
            <h1>Xin chào, Bệnh nhân</h1>
            <p>Chúc bạn một ngày tốt lành</p>
          </div>
          <div className={styles.walletInfo}>
            <div className={styles.walletBalance}>
              <strong>{walletBalance}</strong> <span>₳</span>
            </div>
            <div className={styles.walletAddress}>
              <span title={walletAddress}>{formatAddress(walletAddress)}</span>
              <button 
                onClick={() => copyToClipboard(walletAddress)}
                className={styles.copyButton}
              >
                <FaCopy />
              </button>
            </div>
          </div>
        </div>
        
        <div className={styles.reminderBanner}>
          <FaBell />
          <span>Nhắc nhở: Bạn có lịch hẹn khám với Dr. Smith vào ngày 15/05/2025</span>
        </div>
        
        <div className={styles.medicationReminder}>
          <h3><FaMedkit /> Nhắc nhở uống thuốc hôm nay</h3>
          <div className={styles.medicationList}>
            <div className={styles.medicationItem}>
              <div>
                <strong>Lisinopril 10mg</strong>
                <p>Uống 1 viên vào buổi sáng</p>
              </div>
              <div className={styles.medicationTimes}>
                <span className={styles.timeTaken}>8:00 AM ✓</span>
              </div>
            </div>
            <div className={styles.medicationItem}>
              <div>
                <strong>Atorvastatin 20mg</strong>
                <p>Uống 1 viên trước khi đi ngủ</p>
              </div>
              <div className={styles.medicationTimes}>
                <span>10:00 PM</span>
              </div>
            </div>
          </div>
        </div>
        
        <section id="appointments" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Lịch hẹn sắp tới</h2>
            <button className={styles.primaryButton}>+ Đặt lịch hẹn</button>
          </div>
          <div className={styles.appointmentList}>
            {appointments.map(appointment => (
              <div key={appointment.id} className={styles.appointmentCard}>
                <div className={styles.appointmentDate}>
                  <div className={styles.dateCircle}>
                    <span className={styles.day}>{appointment.date.split('/')[0]}</span>
                    <span className={styles.month}>Thg {appointment.date.split('/')[1]}</span>
                  </div>
                </div>
                <div className={styles.appointmentDetails}>
                  <h3>{appointment.time} - {appointment.doctor}</h3>
                  <p>Khoa: {appointment.department}</p>
                  <span className={`${styles.status} ${appointment.status === 'Scheduled' ? styles.scheduled : styles.pending}`}>
                    {appointment.status === 'Scheduled' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                  </span>
                </div>
                <div className={styles.appointmentActions}>
                  <button className={styles.actionButton}>Chi tiết</button>
                  <button className={styles.secondaryButton}>Hủy</button>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section id="medical-history" className={styles.section}>
          <h2>Lịch sử khám bệnh</h2>
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Chẩn đoán</th>
                  <th>Bác sĩ</th>
                  <th>Ghi chú</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {medicalHistory.map(record => (
                  <tr key={record.id}>
                    <td>{record.date}</td>
                    <td>{record.diagnosis}</td>
                    <td>{record.doctor}</td>
                    <td>{record.notes}</td>
                    <td><button className={styles.viewButton}>Xem chi tiết</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        
        <div className={styles.columnLayout}>
          <section id="prescriptions" className={styles.section}>
            <h2>Đơn thuốc hiện tại</h2>
            <div className={styles.prescriptionList}>
              {prescriptions.map(prescription => (
                <div key={prescription.id} className={styles.prescriptionCard}>
                  <h3>{prescription.name}</h3>
                  <div className={styles.prescriptionDetails}>
                    <p><strong>Liều lượng:</strong> {prescription.dosage}</p>
                    <p><strong>Tần suất:</strong> {prescription.frequency}</p>
                    <p><strong>Số ngày còn lại:</strong> {prescription.remaining}</p>
                  </div>
                  <button className={styles.refillButton}>Yêu cầu tái kê đơn</button>
                </div>
              ))}
            </div>
          </section>
          
          <section id="test-results" className={styles.section}>
            <h2>Kết quả xét nghiệm</h2>
            <div className={styles.labResultsList}>
              {labResults.map(result => (
                <div key={result.id} className={styles.labResultCard}>
                  <div className={styles.resultHeader}>
                    <h3>{result.name}</h3>
                    <span className={`${styles.resultStatus} ${result.result === 'Normal' ? styles.normalResult : ''}`}>
                      {result.result}
                    </span>
                  </div>
                  <p>Ngày: {result.date}</p>
                  <button className={styles.viewButton}>Xem báo cáo</button>
                </div>
              ))}
            </div>
          </section>
        </div>
        
        <section id="blockchain-assets" className={styles.section}>
          <h2>Tài sản y tế trên blockchain</h2>
          <div className={styles.assetsList}>
            {userAssets.length > 0 ? (
              <div className={styles.assetGrid}>
                {userAssets.slice(0, 4).map((asset, index) => (
                  <div key={index} className={styles.assetCard}>
                    <div className={styles.assetIcon}>🔐</div>
                    <div className={styles.assetInfo}>
                      <h3>Y tế #{index + 1}</h3>
                      <p className={styles.assetId} title={asset.unit}>
                        {asset.unit ? `${asset.unit.substring(0, 8)}...${asset.unit.substring(asset.unit.length - 4)}` : 'Unknown'}
                      </p>
                      <div className={styles.assetMeta}>
                        <span className={styles.assetQuantity}>Số lượng: {asset.quantity || 0}</span>
                        <button className={styles.smallButton}>Chi tiết</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noAssets}>Chưa có tài sản y tế nào được lưu trên blockchain</p>
            )}
            {userAssets.length > 4 && (
              <div className={styles.viewMoreContainer}>
                <button className={styles.viewMoreButton}>Xem thêm ({userAssets.length - 4})</button>
              </div>
            )}
          </div>
        </section>
        
        <section id="doctor-chat" className={styles.section}>
          <h2>Tư vấn bác sĩ</h2>
          <div className={styles.chatContainer}>
            <div className={styles.chatMessages}>
              {chatMessages.map((chat, index) => (
                <div 
                  key={index} 
                  className={`${styles.chatBubble} ${chat.from === 'You' ? styles.userBubble : styles.doctorBubble}`}
                >
                  <div className={styles.chatHeader}>
                    <span className={styles.chatSender}>{chat.from}</span>
                    <span className={styles.chatTime}>{chat.time}</span>
                  </div>
                  <p>{chat.message}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleChatSubmit} className={styles.chatForm}>
              <input 
                type="text" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Nhập tin nhắn để được hỗ trợ..." 
                className={styles.chatInput}
              />
              <button type="submit" className={styles.chatSubmit}>Gửi</button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserProfile;