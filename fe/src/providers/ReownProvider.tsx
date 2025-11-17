"use client";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppKitProvider } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi"; // ✅ thêm dòng này
import { wagmiConfig, wagmiAdapter, tbnbChain, pzoChain, sepolia } from "@/config/reown";

const queryClient = new QueryClient();

export default function ReownRootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={wagmiConfig}>  {/* ✅ Bọc ngoài cùng */}
      <AppKitProvider
        adapters={[wagmiAdapter]}
        projectId={process.env.NEXT_PUBLIC_PROJECT_ID!}
        networks={[pzoChain, tbnbChain, sepolia]}
        metadata={{
          name: "MedixCare",
          description: "Kết nối ví MetaMask hoặc AppKit Flutter",
          url: "https://medixcare.vn",
          icons: ["https://medixcare.vn/logo.png"],
        }}
      >
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </AppKitProvider>
    </WagmiProvider>
  );
}
