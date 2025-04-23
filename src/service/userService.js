// Helper function to handle API responses
export async function fetchAPI(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    console.log(`Calling API: /api/${endpoint}`, options);
    const response = await fetch(`/api/${endpoint}`, options);
    
    if (!response.ok) {
      // Sửa lỗi: Chỉ lấy text khi cần và không dùng response.json() sau đó
      let errorMessage = `API error: ${response.status} ${response.statusText}`;
      try {
        // Cố gắng đọc nội dung lỗi nếu có
        const errorText = await response.text();
        if (errorText) {
          console.error(`API error (${response.status}):`, errorText);
          // Nếu errorText có dạng JSON, parse nó
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.message) {
              errorMessage = errorJson.message;
            }
          } catch  {
            // Nếu không phải JSON, sử dụng text gốc
            errorMessage = `${errorMessage}: ${errorText.substring(0, 100)}...`;
          }
        }
      } catch (readError) {
        console.error("Không thể đọc response body:", readError);
      }
      throw new Error(errorMessage);
    }
    
    try {
      const json = await response.json();
      return json;
    } catch (parseError) {
      console.error("Lỗi parse JSON:", parseError);
      throw new Error("API trả về dữ liệu không hợp lệ");
    }
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Kiểm tra xem người dùng đã tồn tại trong DB chưa
 */
export async function checkUserInDatabase(walletAddress, pubKey) {
  try {
    const response = await fetchAPI('users/check', 'POST', { walletAddress, pubKey });
    return response.exists ? response.didNumber : null;
  } catch (error) {
    console.error("Lỗi khi kiểm tra người dùng:", error);
    return null;
  }
}

/**
 * Lưu người dùng mới vào database
 */
export async function saveUserToDatabase(walletAddress, pubKey, didNumber) {
  try {
    const response = await fetchAPI('users/save', 'POST', { walletAddress, pubKey, didNumber });
    return response.id;
  } catch (error) {
    console.error("Lỗi khi lưu người dùng:", error);
    throw error;
  }
}

/**
 * Lấy thông tin người dùng theo địa chỉ ví
 */
export async function getUserByWallet(walletAddress) {
  try {
    // Sử dụng endpoint hiện có
    return await fetchAPI(`users?walletAddress=${encodeURIComponent(walletAddress)}`, 'GET');
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return null;
  }
}

export async function updateUser(userId, userData) {
  return await fetchAPI(`users/${userId}`, 'PUT', userData);
}
