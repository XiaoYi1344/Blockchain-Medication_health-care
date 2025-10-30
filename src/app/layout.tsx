import type { Metadata } from "next";
import "./globals.css";
import RootLayoutClient from "./RootLayoutClient";
import EmotionRegistry from "@/components/EmotionRegistry";

export const metadata: Metadata = {
  title: "DApp Checkout",
  description: "Thanh toán bằng MetaMask với Web3.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"> {/* hardcode default lang or detect from cookie/header */}
      <body>
        <EmotionRegistry>
          <RootLayoutClient>{children}</RootLayoutClient>
        </EmotionRegistry>
      </body>
    </html>
  );
}
