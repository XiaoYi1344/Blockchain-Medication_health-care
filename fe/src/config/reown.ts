import { cookieStorage, createStorage } from "@wagmi/core";
import { http, Chain } from "viem";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

// ✅ Khởi tạo các chain trực tiếp
export const tbnbChain: Chain = {
  id: 97,
  name: "BNB Testnet",
  nativeCurrency: { name: "BNB", symbol: "tBNB", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://data-seed-prebsc-1-s1.binance.org:8545/"] },
    public: { http: ["https://data-seed-prebsc-1-s1.binance.org:8545/"] },
  },
  blockExplorers: {
    default: { name: "BscScan Testnet", url: "https://testnet.bscscan.com" },
  },
  testnet: true,
};

export const pzoChain: Chain = {
  id: 5080,
  name: "Pione Zero",
  nativeCurrency: { name: "PZO", symbol: "PZO", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.zeroscan.org"] },
    public: { http: ["https://rpc.zeroscan.org"] },
  },
  blockExplorers: {
    default: { name: "PZO Explorer", url: "https://zeroscan.org" },
  },
};

export const sepolia: Chain = {
  id: 11155111,
  name: "Sepolia",
  nativeCurrency: { name: "Ether", symbol: "SepoliaETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.sepolia.org"] },
    public: { http: ["https://rpc.sepolia.org"] },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://sepolia.etherscan.io" },
  },
  testnet: true,
};

// ✅ Project ID
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;
if (!projectId) throw new Error("NEXT_PUBLIC_PROJECT_ID is missing");

// ✅ Cấu hình WagmiAdapter
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [pzoChain, tbnbChain, sepolia],
  transports: {
    [pzoChain.id]: http("https://rpc.zeroscan.org"),
    [tbnbChain.id]: http("https://data-seed-prebsc-1-s1.binance.org:8545/"),
    [sepolia.id]: http("https://rpc.sepolia.org"),
  },
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
});

// ✅ Lấy wagmiConfig
export const wagmiConfig = wagmiAdapter.wagmiConfig;
