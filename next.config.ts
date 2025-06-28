import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tắt React Strict Mode để tránh useEffect bị gọi 2 lần ở dev
  reactStrictMode: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
