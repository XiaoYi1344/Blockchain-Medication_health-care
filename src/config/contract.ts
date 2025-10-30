import type { Abi } from "abitype";

// --- Địa chỉ contract trên blockchain ---
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

// --- ABI contract (chỉ lấy những function cần thôi) ---
export const CONTRACT_ABI: Abi = [
  {
    inputs: [
      { internalType: "string", name: "fromCompanyId", type: "string" },
      { internalType: "string", name: "toCompanyId", type: "string" },
      { internalType: "string", name: "orderCode", type: "string" },
      { internalType: "string[]", name: "batchCode", type: "string[]" },
      { internalType: "uint256", name: "quantity", type: "uint256" },
    ],
    name: "createOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// --- Export cấu hình Wagmi ---
export const contractConfig = {
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
};
