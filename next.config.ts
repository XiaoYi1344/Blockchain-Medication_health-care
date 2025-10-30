import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone", // 👈 Bắt buộc cho Netlify/Vercel
  // ⚙️ Nếu cần rewrite API sang ngrok hoặc backend riêng:
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: "https://aurelio-untoned-yadiel.ngrok-free.dev/api/:path*",
  //     },
  //   ];
  // },
};

export default nextConfig;
