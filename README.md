MEDID: Ứng dụng định danh phi tập trung cho quản lý hồ sơ y tế

 __  __ _____ ____ ___ ____  
|  \/  | ____|  _ \_ _|  _ \
| |\/| |  _| | | | | || | | |
| |  | | |___| |_| | || |_| |
|_|  |_|_____|____/___|____/  

Giới thiệu

MEDID là một giải pháp định danh phi tập trung (Decentralized Identity) được xây dựng trên blockchain, nhằm đảm bảo an toàn, minh bạch và bảo mật cho hồ sơ y tế cá nhân. Người dùng sẽ sở hữu hoàn toàn quyền kiểm soát dữ liệu của mình thông qua việc cấp phép truy cập cho các cơ sở y tế hoặc các bên thứ ba theo từng giao dịch riêng biệt.

Tính năng chính

Quản lý danh tính phi tập trung: Người dùng có thể tự tạo và quản lý DID (Decentralized Identifier).

Lưu trữ hồ sơ y tế an toàn: Mỗi bản ghi y tế được mã hóa và lưu trữ phân tán trên mạng blockchain.

Cấp phép linh hoạt: Cho phép hoặc thu hồi quyền truy cập hồ sơ chi tiết theo thời gian và mục đích cụ thể.

Minh bạch và đáng tin cậy: Toàn bộ lịch sử truy cập và giao dịch được ghi lại công khai, không thể sửa đổi.

Tương tác qua ví điện tử: Kết nối ví blockchain để ký giao dịch, đảm bảo tính xác thực của mỗi thao tác.

Kiến trúc

Front-end: Ứng dụng web ReactJS kết nối với WalletProvider để ký giao dịch.

Back-end: Node.js / Spring Boot xử lý các request, tích hợp Mesh SDK và Lucid để tương tác với blockchain Cardano.

Smart Contract: Hợp đồng Aiken trên Cardano xác thực DID và lưu trữ đã được mã hóa.

Lưu trữ phi tập trung: IPFS hoặc các giải pháp lưu trữ phi tập trung khác cho dữ liệu y tế.

Cài đặt

Clone repository:

git clone https://github.com/yourorg/medid.git
cd medid

Cài đặt dependencies Front-end:

cd frontend
npm install

Cài đặt dependencies Back-end:

cd ../backend
npm install    # hoặc mvn install cho Spring Boot

Cấu hình environment variables:

BLOCKFROST_PROJECT_ID

DATABASE_URL

JWT_SECRET

Sử dụng

Chạy Front-end:

cd frontend
npm start

Chạy Back-end:

cd backend
npm run dev   # hoặc mvn spring-boot:run

Mở trình duyệt và truy cập http://localhost:3000 để tương tác với MEDID.

Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng thực hiện theo các bước:

Fork repository

Tạo branch feature hoặc fix: git checkout -b feature/tên-chi-tiet

Commit thay đổi: `git commit -m "Mô tả thay đổi"

Push lên fork: git push origin feature/tên-chi-tiet

Mở Pull Request

Giấy phép

MEDID được cấp phép theo MIT License.

