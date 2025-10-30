import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // 👈 Cần cho Netlify và Vercel build đúng
  turbopack: {
    root: "D:/ThucTapFrontEnd/DoAnNongNghiep",
  },
  // Nếu cần rewrite API:
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
