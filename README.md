<h3>Hackathon</h3>..
Ứng dụng định danh phi tập trung vào quản lí hồ sơ y tế được xây dựng trên chain Cardano<br>
Ngôn ngữ sử dụng : Typescript, Javascript<br>
FrameWork: Nextjs, React, Meshjs<br>
DataBase: Porsgresql <br>
Ứng dụng định danh phi tập trung vào quản lí hồ sơ y tế được xây dựng trên chain Cardano<br>
Ngôn ngữ sử dụng : Typescript, Javascript<br>
SmartContract: Aiken<br>x
FrameWork: Nextjs, React, Meshjs, Pinata<br>
DataBase: Postgresql<br>
SmartContract: Aiken, 3 smartcontract <=> 3 plutus tương tác<br>
Cách dùng: Người dùng phải sign Data khi kết nối ví để chứng minh quyền sở hữu ví để tiếp tục sử dụng dịch vụ<br>
           Người dùng kết nối ví xong phải xác thực DID mới có quyền sử dụng các dịch vụ liên quan đến y tế nếu fail thì phải<br>
           mint NFT định danh để xác minh lại.<br>
Dịch vụ Y Tế: Ngưới dùng có thể tạo hồ sơ bệnh nhân bằng cách mint NFT hồ sơ (theo chuẩn CIP68 của Cardano), với những thông tin và <br>
           dữ liệu được mã hóa AES được lưu trữ trong metadata.<br>
           Người dùng còn có thể đặt lịch hẹn với những bác sĩ được đề xuất trên app và có thể ủy quyền những bác sĩ có thể truy cập vào được <br>
           NFT hồ sơ của bệnh nhân và có thể update dữ liệu NFT.<br>
           Người dùng còn có thể update dữ liệu (bác sĩ ủy quyền truy cập NFT của mình) - update trực tiếp vào datum smartcontract<br>
           Bác sĩ sau khi update xong dữ liệu mới có thể chuyển NFT tới bệnh nhân với số tiền được setup -> Người bệnh nhân chỉ có thể <br>
           unlock được tài sản khi có đủ tiền trong ví <br>
           
           
           
           .
           
           
           
Dowload :<br>
pinata<br>
pinata<br>
next: npm i next <br>
meshjs: npm install @meshsdk/core @meshsdk/react<br>
pinata: npm i pinata<br>
lodash
.

..
.
.
.
.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
