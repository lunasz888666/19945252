import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // ✅ 禁用构建时的 ESLint 检查
  },
  images: {
    domains: ['image.maimn.com'], // ✅ 添加你的图片域名}
  }
};

export default nextConfig;
