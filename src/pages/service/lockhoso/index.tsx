import React, { useState } from 'react';
import { useWallet } from '@meshsdk/react';
import styles from './Lockhoso.module.css';
import lockPortfolio from '../../../utils/PatientAction/utils/lock';
import { Asset } from '@meshsdk/core';

interface Doctor {
  name: string;
  address: string;
}

interface StatusMessage {
  title: string;
  message: string;
  type: 'success' | 'error';
  txHash?: string;
}

const Lockhoso: React.FC = () => {
  const { wallet, connected } = useWallet();
  const [doctors, setDoctors] = useState<Doctor[]>([
    
  ]);
  const [policyId, setPolicyId] = useState<string>('');
  const [assetName, setAssetName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

  const handleAddDoctor = () => {
    const nameInput = document.getElementById('doctor-name') as HTMLInputElement;
    const addressInput = document.getElementById('doctor-wallet') as HTMLInputElement;
    const name = nameInput?.value.trim();
    const address = addressInput?.value.trim();

    if (!name || !address) {
      setStatusMessage({
        title: 'Thông tin không đầy đủ',
        message: 'Vui lòng nhập cả tên bác sĩ và địa chỉ ví.',
        type: 'error'
      });
      return;
    }

    // Kiểm tra địa chỉ có đúng định dạng không
    if (!address.startsWith('addr')) {
      setStatusMessage({
        title: 'Địa chỉ không hợp lệ',
        message: 'Địa chỉ ví Cardano phải bắt đầu bằng "addr".',
        type: 'error'
      });
      return;
    }

    setDoctors([...doctors, { name, address }]);
    nameInput.value = '';
    addressInput.value = '';
    
    // Xóa thông báo lỗi nếu có
    if (statusMessage?.type === 'error') {
      setStatusMessage(null);
    }
  };

  const handleRemoveDoctor = (index: number) => {
    const newList = [...doctors];
    newList.splice(index, 1);
    setDoctors(newList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      setStatusMessage({
        title: 'Lỗi Kết Nối',
        message: 'Vui lòng kết nối ví Cardano trước khi thực hiện giao dịch.',
        type: 'error'
      });
      return;
    }

    if (!policyId || !assetName) {
      setStatusMessage({
        title: 'Thông tin không đầy đủ',
        message: 'Vui lòng nhập đầy đủ Policy ID và Asset Name.',
        type: 'error'
      });
      return;
    }

    if (doctors.length === 0) {
      setStatusMessage({
        title: 'Danh sách trống',
        message: 'Vui lòng thêm ít nhất một bác sĩ được ủy quyền.',
        type: 'error'
      });
      return;
    }

    try {
      setLoading(true);
      
      // Validate các địa chỉ bác sĩ trước khi gửi
      const invalidAddresses = doctors.filter(doc => !doc.address.startsWith('addr'));
      
      if (invalidAddresses.length > 0) {
        setStatusMessage({
          title: 'Địa chỉ không hợp lệ',
          message: `Các địa chỉ sau không đúng định dạng Cardano: ${invalidAddresses.map(doc => doc.name).join(', ')}`,
          type: 'error'
        });
        setLoading(false);
        return;
      }
      
      // Tạo unit từ policyId và assetName
      const unit = `${policyId}${assetName}`;
      
      // Tạo asset object cho giao dịch
      const assets: Asset[] = [
        {
          unit: unit,
          quantity: '1'
        }
      ];
      
      // Trích xuất danh sách địa chỉ bác sĩ
      const doctorAddresses = doctors.map(doc => doc.address);
      console.log("Addresses Doctor : ", doctorAddresses);
      // Hiển thị thông báo đang xử lý
      setStatusMessage({
        title: 'Đang xử lý',
        message: 'Đang thực hiện giao dịch, vui lòng không đóng cửa sổ...',
        type: 'success'
      });
      
      // Gọi hàm lockPortfolio để thực hiện khóa NFT
      const txHash = await lockPortfolio(wallet, assets, doctorAddresses, unit);
      
      // Hiển thị thông báo thành công
      setStatusMessage({
        title: 'Giao Dịch Thành Công',
        message: `NFT của bạn đã được khóa thành công trong smart contract với ${doctors.length} nhà cung cấp được ủy quyền.`,
        type: 'success',
        txHash: txHash
      });
      
      // Cuộn đến thông báo
      document.getElementById('status-message')?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Lỗi khi khóa NFT:', error);
      setStatusMessage({
        title: 'Giao Dịch Thất Bại',
        message: `Đã xảy ra lỗi khi khóa NFT: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles['section-header']}>
        <h2>Khóa Hồ Sơ Y Tế NFT</h2>
        <p>
          Khóa hồ sơ y tế của bạn vào smart contract để chia sẻ với các bác sĩ được ủy quyền
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.content}>
        <div className={styles['form-section']}>
          <h3>Thông Tin NFT</h3>
          <div className={styles['form-group']}>
            <label htmlFor="policy-id">Policy ID</label>
            <input
              type="text"
              id="policy-id"
              value={policyId}
              onChange={(e) => setPolicyId(e.target.value)}
              required
              placeholder="Nhập Policy ID của NFT hồ sơ y tế"
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="asset-name">Asset Name</label>
            <input
              type="text"
              id="asset-name"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              required
              placeholder="Nhập Asset Name của NFT hồ sơ y tế"
            />
          </div>
        </div>

        <div className={styles['form-section']}>
          <h3>Nhà Cung Cấp Dịch Vụ Y Tế</h3>
          <div className={styles['info-box']}>
            <h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Thông Tin Quan Trọng
            </h3>
            <p>Chỉ những bác sĩ/nhà cung cấp được thêm vào danh sách này mới có thể truy cập hồ sơ y tế của bạn. Đảm bảo địa chỉ ví của họ chính xác.</p>
          </div>
          
          <div className={styles['form-group']}>
            <label>Tên Bác Sĩ/Nhà Cung Cấp</label>
            <input type="text" id="doctor-name" placeholder="Nhập tên bác sĩ hoặc nhà cung cấp" />
          </div>
          <div className={styles['form-group']}>
            <label>Địa Chỉ Ví</label>
            <input type="text" id="doctor-wallet" placeholder="Nhập địa chỉ ví Cardano của bác sĩ" />
          </div>

          <button
            type="button"
            id="add-doctor"
            onClick={handleAddDoctor}
            className={styles['add-doctor-btn']}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Thêm Nhà Cung Cấp
          </button>

          <div className={styles['doctor-list']}>
            {doctors.length > 0 ? (
              doctors.map((doc, index) => (
                <div key={index} className={styles['doctor-item']}>
                  <div className={styles['doctor-info']}>
                    <div className={styles['doctor-name']}>{doc.name}</div>
                    <div className={styles['doctor-address']}>{doc.address}</div>
                  </div>
                  <button
                    type="button"
                    className={styles['remove-btn']}
                    onClick={() => handleRemoveDoctor(index)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className={styles['empty-list']}>
                <p>Chưa có bác sĩ nào được thêm vào danh sách. Vui lòng thêm ít nhất một bác sĩ.</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles['btn-container']}>
          <button 
            type="submit" 
            className={styles['btn-lock']}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className={styles.spinner} viewBox="0 0 50 50">
                  <circle className={styles.path} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                </svg>
                Đang Xử Lý...
              </>
            ) : (
              'Khóa NFT Trong Smart Contract'
            )}
          </button>
        </div>

        {statusMessage && (
          <div 
            id="status-message" 
            className={`${styles['status-bar']} ${styles[statusMessage.type]}`}
          >
            <h3>{statusMessage.title}</h3>
            <p>{statusMessage.message}</p>
            {statusMessage.txHash && (
              <div className={styles['tx-details']}>
                <p><strong>Mã Giao Dịch:</strong></p>
                <a 
                  href={`https://preprod.cardanoscan.io/transaction/${statusMessage.txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles['tx-link']}
                >
                  {statusMessage.txHash}
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default Lockhoso;