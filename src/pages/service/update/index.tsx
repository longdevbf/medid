import React, { useState } from "react";
import { useWallet } from '@meshsdk/react';
import styles from './Update.module.css';
import updatePortfolio from "../../../utils/PatientAction/utils/update";

interface ActionResult {
  message: string;
  type: "success" | "error" | "loading" | "";
  txHash?: string;
}

// Định nghĩa các lý do cập nhật
type UpdateReason = {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const Update: React.FC = () => {
  const { wallet, connected } = useWallet();
  const [txHash, setTxHash] = useState<string>("");
  const [doctorAddresses, setDoctorAddresses] = useState<string[]>([""]);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [actionResult, setActionResult] = useState<ActionResult>({
    message: "",
    type: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Danh sách các lý do cập nhật
  const updateReasons: UpdateReason[] = [
    {
      id: "change-doctor",
      title: "Thay Đổi Bác Sĩ Điều Trị",
      description: "Bạn muốn thay đổi bác sĩ điều trị chính hoặc bổ sung bác sĩ chuyên khoa mới",
      icon: "👨‍⚕️"
    },
    {
      id: "revoke-access",
      title: "Thu Hồi Quyền Truy Cập",
      description: "Bạn muốn hủy quyền truy cập của những bác sĩ không còn điều trị cho bạn",
      icon: "🔒"
    },
    {
      id: "second-opinion",
      title: "Tham Khảo Ý Kiến Khác",
      description: "Bạn muốn lấy ý kiến từ bác sĩ khác về tình trạng sức khỏe của mình",
      icon: "🔍"
    },
    {
      id: "moving-facility",
      title: "Chuyển Cơ Sở Y Tế",
      description: "Bạn đang chuyển đến cơ sở y tế mới và cần cập nhật quyền truy cập",
      icon: "🏥"
    },
    {
      id: "other",
      title: "Lý Do Khác",
      description: "Lý do khác không có trong danh sách",
      icon: "📝"
    }
  ];

  const handleDoctorChange = (index: number, value: string) => {
    const updated = [...doctorAddresses];
    updated[index] = value;
    setDoctorAddresses(updated);
  };

  const addDoctor = () => {
    setDoctorAddresses([...doctorAddresses, ""]);
  };

  const removeDoctor = (index: number) => {
    if (doctorAddresses.length > 1) {
      const updated = [...doctorAddresses];
      updated.splice(index, 1);
      setDoctorAddresses(updated);
    }
  };

  const resetForm = () => {
    setTxHash("");
    setDoctorAddresses([""]);
    setConfirmed(false);
    setSelectedReason("");
    setActionResult({ message: "", type: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Loại bỏ các địa chỉ trống
    const validDoctors = doctorAddresses.filter((addr) => addr.trim() !== "");

    if (!connected) {
      setActionResult({ 
        message: "Vui lòng kết nối ví Cardano trước khi cập nhật quyền truy cập", 
        type: "error" 
      });
      return;
    }

    if (txHash.trim() === "" || txHash.length < 64) {
      setActionResult({ 
        message: "Vui lòng nhập mã giao dịch (Transaction Hash) hợp lệ", 
        type: "error" 
      });
      return;
    }

    if (validDoctors.length === 0) {
      setActionResult({ 
        message: "Vui lòng nhập ít nhất một địa chỉ ví bác sĩ", 
        type: "error" 
      });
      return;
    }

    const invalidAddresses = validDoctors.filter(addr => !addr.startsWith('addr'));
    if (invalidAddresses.length > 0) {
      setActionResult({ 
        message: "Địa chỉ ví bác sĩ phải là địa chỉ Cardano hợp lệ (bắt đầu bằng 'addr')", 
        type: "error" 
      });
      return;
    }

    if (!selectedReason) {
      setActionResult({ 
        message: "Vui lòng chọn lý do cập nhật quyền truy cập", 
        type: "error" 
      });
      return;
    }

    if (!confirmed) {
      setActionResult({ 
        message: "Bạn phải xác nhận ủy quyền trước khi tiếp tục", 
        type: "error" 
      });
      return;
    }

    try {
      setIsLoading(true);
      setActionResult({
        message: "Đang xử lý giao dịch trên blockchain...",
        type: "loading",
      });

      // Gọi hàm updatePortfolio từ smart contract
      const result = await updatePortfolio(wallet, validDoctors, txHash);

      // Hiển thị kết quả thành công
      setActionResult({
        message: "Cập nhật quyền truy cập thành công! Giao dịch đã được ghi lên blockchain.",
        type: "success",
        txHash: result
      });

      // Log kết quả
      console.log({
        txHash,
        doctorAddresses: validDoctors,
        updateReason: selectedReason,
        resultTxHash: result
      });

    } catch (error) {
      console.error("Error updating access permissions:", error);
      
      setActionResult({
        message: `Lỗi khi cập nhật quyền truy cập: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles["main-content"]}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Cập Nhật Quyền Truy Cập Hồ Sơ Y Tế</h2>
          
          <div className={styles["info-text"]}>
            <div className={styles["info-icon"]}>ℹ️</div>
            <div>
              Trang này cho phép bạn cập nhật quyền truy cập cho hồ sơ y tế điện tử của bạn được lưu trữ trên blockchain.
              Nhập mã giao dịch (txHash) và địa chỉ ví của các bác sĩ mà bạn muốn cấp quyền truy cập.
            </div>
          </div>

          {!connected && (
            <div className={styles["wallet-warning"]}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>Vui lòng kết nối ví Cardano để cập nhật quyền truy cập hồ sơ y tế</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles["form-group"]}>
              <label className={styles.label} htmlFor="txHash">Mã Giao Dịch (Transaction Hash):</label>
              <input className={styles.input}
                type="text"
                id="txHash"
                name="txHash"
                placeholder="Nhập mã giao dịch khóa hồ sơ"
                required
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                disabled={isLoading}
              />
              <small className={styles.helpText}>
                Nhập mã giao dịch ban đầu khi bạn đã khóa hồ sơ y tế trên blockchain
              </small>
            </div>

            <div className={styles["form-group"]}>
              <label className={styles.label}>Địa Chỉ Ví Bác Sĩ:</label>
              <div id="doctorAddresses">
                {doctorAddresses.map((addr, index) => (
                  <div className={styles["doctor-entry"]} key={index}>
                    <input
                      className={styles.input}
                      type="text"
                      name="doctorAddress"
                      placeholder="Nhập địa chỉ ví Cardano của bác sĩ (bắt đầu bằng addr...)"
                      required
                      value={addr}
                      onChange={(e) => handleDoctorChange(index, e.target.value)}
                      disabled={isLoading}
                    />
                    <button 
                      type="button" 
                      className={styles.removeBtn} 
                      onClick={() => removeDoctor(index)}
                      disabled={doctorAddresses.length <= 1 || isLoading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <button 
                type="button" 
                className={styles["add-doctor-btn"]} 
                onClick={addDoctor}
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg> 
                Thêm Bác Sĩ
              </button>
            </div>

            {/* Phần chọn lý do cập nhật */}
            <div className={styles["form-group"]}>
              <label className={styles.label}>Lý Do Cập Nhật:</label>
              <div className={styles["reason-cards"]}>
                {updateReasons.map((reason) => (
                  <div 
                    key={reason.id} 
                    className={`${styles["reason-card"]} ${selectedReason === reason.id ? styles["reason-selected"] : ""}`}
                    onClick={() => !isLoading && setSelectedReason(reason.id)}
                  >
                    <div className={styles["reason-icon"]}>{reason.icon}</div>
                    <h4>{reason.title}</h4>
                    <p>{reason.description}</p>
                    {selectedReason === reason.id && (
                      <div className={styles["selected-indicator"]}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles["form-group"] + " " + styles["checkbox-group"]}>
              <input className={styles.checkbox}
                type="checkbox"
                id="confirmCheck"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                required
                disabled={isLoading}
              />
              <label htmlFor="confirmCheck" className={styles.checkboxLabel}>
                Tôi xác nhận rằng tôi đang ủy quyền cho các bác sĩ này truy cập hồ sơ y tế của tôi
              </label>
            </div>

            <div className={styles["btn-group"]}>
              <button 
                type="button" 
                className={styles["btn"] + " " + styles["btn-secondary"]} 
                onClick={resetForm}
                disabled={isLoading}
              >
                Làm Mới
              </button>
              <button 
                type="submit" 
                className={styles.btn + " " + styles["btn-primary"]}
                disabled={isLoading || !connected}
              >
                {isLoading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Đang Xử Lý...
                  </>
                ) : "Cập Nhật Quyền Truy Cập"}
              </button>
            </div>
          </form>

          {actionResult.message && (
            <div
              className={`${styles["action-result"]} ${styles[actionResult.type]}`}
              id="actionResult"
            >
              <div className={styles["result-content"]}>
                {actionResult.type === "loading" && <div className={styles.spinnerLarge}></div>}
                {actionResult.type === "success" && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                )}
                {actionResult.type === "error" && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                )}
                
                <div className={styles["result-message"]}>
                  {actionResult.message}
                  
                  {actionResult.txHash && (
                    <div className={styles["tx-details"]}>
                      <p><strong>Mã Giao Dịch:</strong></p>
                      <a 
                        href={`https://preprod.cardanoscan.io/transaction/${actionResult.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles["tx-link"]}
                      >
                        {actionResult.txHash}
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Update;