<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MEDID - Quản lý hồ sơ y tế phi tập trung</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f0f4f8;
            color: #333;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            background-color: #fff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            text-align: center;
        }
        h1 {
            font-size: 2.5em;
            color: #007bff;
            margin-bottom: 20px;
            transition: color 0.3s ease;
        }
        h1:hover {
            color: #0056b3;
        }
        p {
            font-size: 1.2em;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        img {
            width: 100px;
            height: 100px;
            margin-bottom: 20px;
        }
        .icon {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
        }
        .icon img {
            width: 50px;
            height: 50px;
            transition: transform 0.3s ease;
        }
        .icon img:hover {
            transform: scale(1.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>M E D I D</h1>
        <img src="https://img.icons8.com/color/100/000000/medical-record.png" alt="MEDID Icon">
        <p>
            <strong>MEDID</strong> là một dự án ứng dụng <em>định danh phi tập trung</em> (Decentralized Identity) trong lĩnh vực quản lý hồ sơ y tế. 
            Dự án hướng tới việc cung cấp một giải pháp <strong>an toàn</strong>, <strong>bảo mật</strong> và <strong>minh bạch</strong> 
            để quản lý và chia sẻ dữ liệu y tế giữa bệnh nhân, bác sĩ và các cơ sở y tế.
        </p>
        <p>
            MEDID tận dụng công nghệ <strong>blockchain</strong> để xây dựng một hệ thống định danh phi tập trung, 
            trao quyền kiểm soát hoàn toàn dữ liệu y tế cho bệnh nhân. Dự án giúp:
        </p>
        <ul>
            <li><strong>Lưu trữ an toàn</strong>: Hồ sơ y tế được mã hóa và lưu trữ trên blockchain.</li>
            <li><strong>Chia sẻ dễ dàng</strong>: Bệnh nhân có thể cấp quyền truy cập cho bác sĩ hoặc tổ chức y tế.</li>
            <li><strong>Tính minh bạch</strong>: Mọi thay đổi đều được ghi nhận, không thể xóa sửa.</li>
        </ul>
        <div class="icon">
            <img src="https://img.icons8.com/color/50/000000/security-checked.png" alt="Security">
            <img src="https://img.icons8.com/color/50/000000/share.png" alt="Share">
            <img src="https://img.icons8.com/color/50/000000/blockchain-technology.png" alt="Blockchain">
        </div>
    </div>
</body>
</html>
