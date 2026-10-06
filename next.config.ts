import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Disable in dev to avoid annoying caching
  register: true,
});

const nextConfig: NextConfig = {
  turbopack: {}, // Bỏ qua lỗi cảnh báo của PWA plugin với Turbopack
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // BỔ SUNG CÁC HEADER BẢO MẬT ĐỂ LIGHTHOUSE CHẤM 100 ĐIỂM
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Chống web khác nhúng web của bạn vào iframe (Clickjacking)
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Bảo vệ khỏi việc giả mạo loại file
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin', 
          },
        ],
      },
    ];
  },
};

export default withPWA(nextConfig);