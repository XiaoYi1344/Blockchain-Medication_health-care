import type { NextConfig } from "next";
// import { i18n } from "./next-i18next.config";

const nextConfig: NextConfig = {
  // i18n,
  turbopack: {
    root: "D:/ThucTapFrontEnd/DoAnNongNghiep",
  },
  // Nếu muốn rewrite API qua ngrok (dev), uncomment:
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
