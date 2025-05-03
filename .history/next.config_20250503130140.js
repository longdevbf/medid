/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Socket.IO hoạt động tốt hơn khi tắt chế độ này
  webpack: (config) => {
    config.externals.push({
      bufferutil: "bufferutil",
      "utf-8-validate": "utf-8-validate",
    });
    return config;
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB
  },
};

module.exports = nextConfig;