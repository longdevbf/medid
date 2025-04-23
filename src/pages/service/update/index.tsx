import React, { useState, useEffect } from "react";
import { useWallet } from '@meshsdk/react';
import styles from './update.module.css';
import updatePortfolio from "../../../utils/PatientAction/utils/update";
import { getUpdateEligibleTransactions,getTransactionsByAddress, updateTransactionPermissions, updateTransaction } from "../../../service/transactionService";
import { getUserByWallet } from "../../../service/userService";

interface ActionResult {
  message: string;
  type: "success" | "error" | "loading" | "";
  txhash?: string;
}

interface Transaction {
  id: number;
  txhash: string;
  amount: number;
  from_address: string;
  to_address: string[];
  unit: string;
  transaction_type: string;
  current_type: string;
  create_at: string;
}

// Định nghĩa các lý do cập nhật
type UpdateReason = {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// First, add a proper User interface at the top of your file
interface User {
  id: number;
  name?: string;
  email?: string;
  wallet_address?: string;
  public_key?: string;
  did_number?: string;
  role?: string;
  created_at?: string;
  // Add any other properties that might be returned by getUserByWallet
}

const Update: React.FC = () => {
  const { wallet, connected } = useWallet();
  const [doctorAddresses, setDoctorAddresses] = useState<string[]>([""]);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [actionResult, setActionResult] = useState<ActionResult>({
    message: "",
    type: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [updateHistory, setUpdateHistory] = useState<Transaction[]>([]);
  const [loadingTx, setLoadingTx] = useState<boolean>(false);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  console.log("User info:", userInfo);
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

  // Lấy danh sách giao dịch hợp lệ khi kết nối ví
  useEffect(() => {
    async function fetchData() {
      if (!connected || !wallet) return;
      
      try {
        setLoadingTx(true);
        setLoadingHistory(true);
        setError("");
        const currentAddress = await wallet.getChangeAddress();
        console.log("Current address:", currentAddress);
        
        // Lấy thông tin người dùng
        const user = await getUserByWallet(currentAddress);
        if (user) {
          setUserInfo(user);
          console.log("User info loaded:", user.id);
        }
        
        // CORRECTED: Lấy danh sách giao dịch mà người dùng hiện tại tạo ra (from_address)
        // thay vì giao dịch mà người dùng có trong to_address
        const txs = await getUpdateEligibleTransactions(currentAddress);
        console.log("Found eligible transactions:", txs.length);
        setTransactions(txs);

        // Lấy lịch sử cập nhật
        const history = await getTransactionsByAddress(currentAddress, 'patient_update');
        console.log("Found update history:", history.length);
        setUpdateHistory(history);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transaction data. Please try again.');
      } finally {
        setLoadingTx(false);
        setLoadingHistory(false);
      }
    }
    
    fetchData();
  }, [connected, wallet]);

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
    setDoctorAddresses([""]);
    setConfirmed(false);
    setSelectedReason("");
    setActionResult({ message: "", type: "" });
    setSelectedTransaction(null);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Xử lý chọn một giao dịch để cập nhật
  const handleSelectTransaction = (tx: Transaction) => {
    setSelectedTransaction(tx);
    // Nạp danh sách bác sĩ hiện tại từ to_address của giao dịch
    setDoctorAddresses(tx.to_address.length > 0 ? [...tx.to_address] : [""]);
    setError("");
  };

  // Thiết lập state lỗi
  const [error, setError] = useState<string>("");

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

    if (!selectedTransaction) {
      setActionResult({ 
        message: "Vui lòng chọn một giao dịch để cập nhật", 
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

      // 1. Gọi hàm updatePortfolio từ smart contract
      const result = await updatePortfolio(wallet, validDoctors, selectedTransaction.txhash);

      // 2. Cập nhật to_address của giao dịch gốc và cập nhật txHash mới
      await updateTransactionPermissions(selectedTransaction.id, validDoctors, result);

      // 3. Lấy địa chỉ ví hiện tại
      const currentAddress = await wallet.getChangeAddress();

      // 4. CHANGED: Cập nhật current_type của giao dịch gốc thành "updated"
      await updateTransaction(selectedTransaction.id, "updated");

      // 5. REMOVED: No longer creating a new transaction record for updates
      // We're only updating the existing record as done in steps 2 and 4

      // 6. Success message
      setActionResult({
        message: "Cập nhật quyền truy cập thành công! Giao dịch đã được ghi lên blockchain.",
        type: "success",
        txhash: result
      });

      // 7. Update the UI with the new transaction for display purposes only
      // This doesn't touch the database
      setUpdateHistory(prevHistory => [{
        id: Date.now(),
        txhash: result,
        amount: selectedTransaction.amount || 1,
        from_address: currentAddress,
        to_address: validDoctors,
        unit: selectedTransaction.unit,
        transaction_type: 'patient_update',
        current_type: 'update',
        create_at: new Date().toISOString()
      }, ...prevHistory]);

      // 8. Refresh transactions list
      const updatedTxs = await getUpdateEligibleTransactions(currentAddress);
      setTransactions(updatedTxs);

      // 9. Reset form
      resetForm();

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
              Chọn một hồ sơ y tế đã khóa từ danh sách và cập nhật quyền truy cập cho các bác sĩ bạn muốn.
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

          {connected && (
            <>
              {/* Phần lựa chọn giao dịch để cập nhật */}
              <div className={styles["transactions-section"]}>
                <h3>Chọn Hồ Sơ Y Tế để Cập Nhật</h3>
                
                {loadingTx ? (
                  <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Đang tải danh sách giao dịch...</p>
                  </div>
                ) : transactions.length > 0 ? (
                  <div className={styles["transactions-list"]}>
                    <table className={styles["transactions-table"]}>
                      <thead>
                        <tr>
                          <th>Ngày Tạo</th>
                          <th>ID Giao Dịch</th>
                          <th>Số Lượng Bác Sĩ</th>
                          <th>Mã Hồ Sơ</th>
                          <th>Hành Động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map(tx => (
                          <tr key={tx.id} className={`${styles["transaction-item"]} ${selectedTransaction?.id === tx.id ? styles["selected-tx"] : ""}`}>
                            <td>{formatDate(tx.create_at)}</td>
                            <td className={styles.txhash}>
                              {tx.txhash}...{tx.txhash}
                            </td>
                            <td>{tx.to_address.length}</td>
                            <td className={styles.unitId}>
                              {tx.unit.substring(0, 10)}...
                            </td>
                            <td>
                              <button
                                onClick={() => handleSelectTransaction(tx)}
                                disabled={isLoading}
                                className={styles["select-tx-btn"]}
                              >
                                {selectedTransaction?.id === tx.id ? 'Đã chọn' : 'Chọn để cập nhật'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className={styles["no-records"]}>
                    <p>Không tìm thấy giao dịch nào có thể cập nhật. Bạn cần khóa hồ sơ y tế trước khi có thể cập nhật quyền truy cập.</p>
                  </div>
                )}
              </div>

              {selectedTransaction && (
                <form onSubmit={handleSubmit}>
                  <div className={styles["selected-transaction-info"]}>
                    <h3>Thông Tin Giao Dịch Đã Chọn</h3>
                    <div className={styles["tx-details-grid"]}>
                      <div className={styles["tx-detail-item"]}>
                        <span className={styles["tx-detail-label"]}>Mã giao dịch:</span>
                        <span className={styles["tx-detail-value"]}>
                          <a 
                            href={`https://preprod.cardanoscan.io/transaction/${selectedTransaction.txhash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles["tx-link"]}
                          >
                            {selectedTransaction.txhash}...{selectedTransaction.txhash}
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                              <polyline points="15 3 21 3 21 9"></polyline>
                              <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                          </a>
                        </span>
                      </div>
                      <div className={styles["tx-detail-item"]}>
                        <span className={styles["tx-detail-label"]}>Ngày tạo:</span>
                        <span className={styles["tx-detail-value"]}>{formatDate(selectedTransaction.create_at)}</span>
                      </div>
                      <div className={styles["tx-detail-item"]}>
                        <span className={styles["tx-detail-label"]}>Mã hồ sơ:</span>
                        <span className={styles["tx-detail-value"]} title={selectedTransaction.unit}>{selectedTransaction.unit.substring(0, 15)}...</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles["form-group"]}>
                    <label className={styles.label}>Danh Sách Bác Sĩ Hiện Tại:</label>
                    {selectedTransaction.to_address.length > 0 ? (
                      <div className={styles["current-doctors"]}>
                        {selectedTransaction.to_address.map((addr, idx) => (
                          <div key={idx} className={styles["current-doctor-item"]}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span title={addr}>{addr.substring(0, 8)}...{addr.substring(addr.length - 8)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className={styles["no-doctors"]}>Không có bác sĩ nào được cấp quyền truy cập</p>
                    )}
                  </div>

                  <div className={styles["form-group"]}>
                    <label className={styles.label}>Danh Sách Bác Sĩ Mới:</label>
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
                      Tôi xác nhận rằng tôi đang cập nhật quyền truy cập cho các bác sĩ được liệt kê
                    </label>
                  </div>

                  <div className={styles["btn-group"]}>
                    <button 
                      type="button" 
                      className={styles["btn"] + " " + styles["btn-secondary"]} 
                      onClick={resetForm}
                      disabled={isLoading}
                    >
                      Hủy
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
              )}

              {/* Phần hiển thị lịch sử cập nhật */}
              <div className={styles["history-section"]}>
                <h3>Lịch Sử Cập Nhật Quyền Truy Cập</h3>
                
                {loadingHistory ? (
                  <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Đang tải lịch sử cập nhật...</p>
                  </div>
                ) : updateHistory.length > 0 ? (
                  <div className={styles["history-list"]}>
                    <table className={styles["transactions-table"]}>
                      <thead>
                        <tr>
                          <th>Ngày Cập Nhật</th>
                          <th>Mã Giao Dịch</th>
                          <th>Số Lượng Bác Sĩ</th>
                          <th>Mã Hồ Sơ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {updateHistory.map(tx => (
                          <tr key={tx.id} className={styles["history-item"]}>
                            <td>{formatDate(tx.create_at)}</td>
                            <td className={styles.txHash}>
                              <a 
                                href={`https://preprod.cardanoscan.io/transaction/${tx.txhash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles["tx-link"]}
                              >
                                {tx.txhash}...{tx.txhash}
                              </a>
                            </td>
                            <td>{tx.to_address.length}</td>
                            <td className={styles.unitId} title={tx.unit}>
                              {tx.unit.substring(0, 10)}...
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className={styles["no-records"]}>
                    <p>Không có lịch sử cập nhật. Sau khi bạn cập nhật quyền truy cập, các giao dịch sẽ hiển thị ở đây.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {error && (
            <div className={styles["error-message"]}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

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
                  
                  {actionResult.txhash && (
                    <div className={styles["tx-details"]}>
                      <p><strong>Mã Giao Dịch:</strong></p>
                      <a 
                        href={`https://preprod.cardanoscan.io/transaction/${actionResult.txhash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles["tx-link"]}
                      >
                        {actionResult.txhash}
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