import { fetchAPI } from './userService';

/**
 * Lưu transaction vào database
 * @param {Object} transaction Thông tin giao dịch
 * @returns {Promise<Object>} Kết quả từ API
 */
export async function saveTransaction(transaction) {
  try {
    const response = await fetchAPI('transactions/save', 'POST', transaction);
    return response;
  } catch (error) {
    console.error("Lỗi khi lưu transaction:", error);
    throw error;
  }
}

/**
 * Lấy danh sách giao dịch của user
 * @param {number} userId ID của người dùng
 * @returns {Promise<Array>} Danh sách giao dịch
 */
export async function getUserTransactions(userId) {
  try {
    const response = await fetchAPI(`transactions?userId=${userId}`);
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy transactions:", error);
    return [];
  }
}

export async function getTransactionsByAddress(fromAddress, transactionType) {
  try {
    return await fetchAPI(`transactions/address?fromAddress=${encodeURIComponent(fromAddress)}&type=${encodeURIComponent(transactionType)}`);
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử giao dịch:", error);
    return [];
  }
}

/**
 * Lấy danh sách giao dịch mà bác sĩ có quyền unlock
 * @param {string} doctorAddress Địa chỉ ví của bác sĩ
 * @returns {Promise<Array>} Danh sách giao dịch
 */
export async function getDoctorTransactions(doctorAddress) {
  try {
    return await fetchAPI(`transactions/doctor?doctorAddress=${encodeURIComponent(doctorAddress)}`);
  } catch (error) {
    console.error("Lỗi khi lấy giao dịch cho bác sĩ:", error);
    return [];
  }
}

/**
 * Lấy danh sách giao dịch mà bệnh nhân có thể unlock
 * @param {string} patientAddress Địa chỉ ví của bệnh nhân
 * @returns {Promise<Array>} Danh sách giao dịch
 */
export async function getPatientUnlockTransactions(patientAddress) {
  try {
    return await fetchAPI(`transactions/patient?patientAddress=${encodeURIComponent(patientAddress)}`);
  } catch (error) {
    console.error("Lỗi khi lấy giao dịch cho bệnh nhân:", error);
    return [];
  }
}

/**
 * Cập nhật trạng thái của giao dịch
 * @param {number} id ID của giao dịch
 * @param {string} currentType Trạng thái mới
 * @returns {Promise<Object>} Kết quả từ API
 */
export async function updateTransaction(id, currentType) {
  try {
    return await fetchAPI(`transactions/updatetx`, 'PUT', { id, currentType });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái giao dịch:", error);
    throw error;
  }
}

/**
 * Lấy danh sách giao dịch hợp lệ có thể cập nhật quyền truy cập
 * @param {string} patientAddress Địa chỉ ví của bệnh nhân
 * @returns {Promise<Array>} Danh sách giao dịch
 */
export async function getUpdateEligibleTransactions(patientAddress) {
  try {
    return await fetchAPI(`transactions/addresses?fromAddress=${encodeURIComponent(patientAddress)}&type=patient_lock&currentTypes=lock,updated`);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách giao dịch hợp lệ:", error);
    return [];
  }
}


/**
 * Cập nhật danh sách bác sĩ và txHash cho một giao dịch
 * @param {number} transactionId ID của giao dịch
 * @param {string[]} doctorAddresses Danh sách địa chỉ bác sĩ mới
 * @param {string} newTxHash Mã giao dịch mới
 * @returns {Promise<Object>} Kết quả từ API
 */
export async function updateTransactionPermissions(transactionId, doctorAddresses, newTxHash) {
  try {
    return await fetchAPI(`transactions/update_permission`, 'PUT', {
      id: transactionId,
      toAddress: doctorAddresses,
      newTxHash: newTxHash
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin giao dịch:", error);
    throw error;
  }
}
export async function getAccessibleTransactions(currentAddress) {
  try {
    return await fetchAPI(`transactions/doctor?doctorAddress=${encodeURIComponent(currentAddress)}`);
  } catch (error) {
    console.error("Lỗi khi lấy giao dịch cho địa chỉ:", error);
    return [];
  }
}