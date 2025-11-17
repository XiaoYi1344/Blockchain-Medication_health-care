// import { Eip1193Provider, ethers } from "ethers";
// import type { ContractProduct } from "@/types/drug";

// // ================================
// // TYPE KHAI BÁO TOÀN CỤC CHO window.ethereum
// // ================================
// declare global {
//   interface Window {
//     ethereum?: Eip1193Provider;
//   }
// }

// // ================================
// // CONFIG
// // ================================
// const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
// if (!CONTRACT_ADDRESS)
//   console.warn("⚠️ Thiếu biến NEXT_PUBLIC_CONTRACT_ADDRESS trong .env.local");

// const CONTRACT_ABI = [
//   // 🔹 Hàm đọc dữ liệu
//   "function getProduct(uint256 id) view returns (tuple(string name,string uom,uint256 uomQuantity,string companyCode,string productType,string gtin,string origin,string description))",
//   "function getAllProducts() view returns (tuple(uint256 id,string name,string uom,uint256 uomQuantity,string companyCode,string productType,string gtin,string origin,string description,uint256 createdAt,uint256 updatedAt,address createdBy,bool isDeleted)[])",

//   // 🔹 Các hàm ghi dữ liệu
//   "function createProduct(string name,string uom,uint256 uomQuantity,string companyCode,string productType,string gtin,string origin,string description, txHash string)",
//   "function updateProduct(uint256 id,string name,string uom,uint256 uomQuantity,string companyCode,string productType,string gtin,string origin,string description)",
//   "function deleteProduct(uint256 id)",
// ];

// // ================================
// // TYPES
// // ================================
// interface RawContractProductFull {
//   id: bigint;
//   name: string;
//   uom: string;
//   uomQuantity: bigint;
//   companyCode: string;
//   productType: string;
//   gtin: string;
//   origin: string;
//   description: string;
//   createdAt: bigint;
//   updatedAt: bigint;
//   createdBy: string;
//   isDeleted: boolean;
//   txHash: string;
// }

// // ================================
// // PROVIDER + CONTRACT HELPERS
// // ================================
// function getProvider(): ethers.BrowserProvider | ethers.JsonRpcProvider {
//   if (typeof window !== "undefined" && window.ethereum) {
//     return new ethers.BrowserProvider(window.ethereum);
//   }

//   const rpc = "https://rpc.zeroscan.org";
//   const chainId = 5080;
//   console.log("🛰️ Dùng RPC fallback:", rpc);

//   return new ethers.JsonRpcProvider(rpc, { name: "PZO", chainId });
// }

// function getContract(signerOrProvider?: ethers.Signer | ethers.Provider) {
//   const provider = signerOrProvider || getProvider();
//   return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
// }

// // ================================
// // MAIN SERVICE
// // ================================
// export const contractService = {
//   /** 🔹 Lấy toàn bộ sản phẩm */
//   // getAllProducts: async (): Promise<ContractProduct[]> => {
//   //   const c = getContract();
//   //   const arr: RawContractProduct[] = await c.getAllProducts();

//   //   return arr.map((raw) => ({
//   //     productCode: String(raw.id),
//   //     gtin: raw.gtin,
//   //     companyCode: raw.companyCode,
//   //     name: raw.name,
//   //     uom: raw.uom,
//   //     description: raw.description,
//   //     activeIngredient: [],
//   //     storageConditions: [],
//   //     type: raw.productType as ContractProduct["type"],
//   //   }));
//   // },

//   /** Lấy tất cả sản phẩm, map về ContractProduct[] */
//   getAllProducts: async (): Promise<ContractProduct[]> => {
//     const c = getContract();
//     const arr: RawContractProductFull[] = await c.getAllProducts();

//     console.log("🧩 Raw data from contract:", arr);

//     // map ra ContractProduct[]
//     return arr
//       .filter((p) => !p.isDeleted) // loại bỏ sản phẩm đã xóa
//       .map((raw) => ({
//         productCode: String(raw.id),
//         gtin: raw.gtin,
//         companyCode: raw.companyCode,
//         name: raw.name,
//         uom: raw.uom,
//         description: raw.description,
//         activeIngredient: [],
//         storageConditions: [],
//         type: raw.productType as ContractProduct["type"],
//         txHash: raw.txHash,
//       }));
//   },

//   /** 🔹 Tạo sản phẩm mới trên blockchain */
//   createProduct: async (
//     signer: ethers.Signer,
//     args: {
//       name: string;
//       uom: string;
//       uomQuantity: number;
//       companyCode: string;
//       productType: string;
//       gtin: string;
//       origin: string;
//       description: string;
//       txHash: string;
//     }
//   ) => {
//     console.log("🚀 Gọi createProduct với:", args);
//     const c = getContract(signer);
//     const tx = await c.createProduct(
//       args.name,
//       args.uom,
//       args.uomQuantity,
//       args.companyCode,
//       args.productType,
//       args.gtin,
//       args.origin,
//       args.description,
//       args.txHash,
//     );
//     return tx.wait();
//   },
// };

import { Eip1193Provider, ethers } from "ethers";
import type { ContractProduct } from "@/types/drug";

// ================================
// TYPE KHAI BÁO TOÀN CỤC CHO window.ethereum
// ================================
declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

// ================================
// CONFIG
// ================================
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
if (!CONTRACT_ADDRESS)
  console.warn("⚠️ Thiếu biến NEXT_PUBLIC_CONTRACT_ADDRESS trong .env.local");

const CONTRACT_ABI = [
  // --- READ ---
  "function getProduct(uint256 productId) view returns (tuple(uint256 id,string name,string uom,uint256 uomQuantity,string companyCode,string productType,string gtin,string origin,string description,string txHash,uint256 createdAt,uint256 updatedAt,address createdBy,bool isDeleted))",
  "function getAllProducts() view returns (tuple(uint256 id,string name,string uom,uint256 uomQuantity,string companyCode,string productType,string gtin,string origin,string description,string txHash,uint256 createdAt,uint256 updatedAt,address createdBy,bool isDeleted)[])",

  // --- WRITE ---
  "function createProduct(string name,string uom,uint256 uomQuantity,string companyCode,string productType,string gtin,string origin,string description,string txHash)",
  "function updateProduct(uint256 productId,string name,string uom,uint256 uomQuantity,string companyCode,string productType,string gtin,string origin,string description)",
  "function deleteProduct(uint256 productId)",
];


// ================================
// TYPES
// ================================
interface RawContractProductFull {
  id: bigint;
  name: string;
  uom: string;
  uomQuantity: bigint;
  companyCode: string;
  productType: string;
  gtin: string;
  origin: string;
  description: string;
  txHash: string;
  createdAt: bigint;
  updatedAt: bigint;
  createdBy: string;
  isDeleted: boolean;
}

// ================================
// PROVIDER + CONTRACT HELPERS
// ================================
function getProvider(): ethers.BrowserProvider | ethers.JsonRpcProvider {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }

  const rpc = "https://rpc.zeroscan.org";
  const chainId = 5080;
  console.log("🛰️ Dùng RPC fallback:", rpc);

  return new ethers.JsonRpcProvider(rpc, { name: "PZO", chainId });
}

function getContract(signerOrProvider?: ethers.Signer | ethers.Provider) {
  const provider = signerOrProvider || getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

// ================================
// MAIN SERVICE
// ================================
export const contractService = {
  /** 🔹 Lấy tất cả sản phẩm, map về ContractProduct[] */
  getAllProducts: async (): Promise<ContractProduct[]> => {
    const c = getContract();
    const arr: RawContractProductFull[] = await c.getAllProducts();

    console.log("🧩 Raw data from contract:", arr);

    return arr.map((raw) => ({
      productCode: String(raw.id),
      gtin: raw.gtin,
      companyCode: raw.companyCode,
      name: raw.name,
      uom: raw.uom,
      description: raw.description,
      activeIngredient: [],
      storageConditions: [],
      type: raw.productType as ContractProduct["type"],
      txHash: raw.txHash, // ✅ Thêm txHash
    }));
  },

  /** 🔹 Lấy 1 sản phẩm theo id */
  getProduct: async (id: number | string): Promise<ContractProduct> => {
    const c = getContract();
    const raw: RawContractProductFull = await c.getProduct(id);

    return {
      productCode: String(raw.id),
      gtin: raw.gtin,
      companyCode: raw.companyCode,
      name: raw.name,
      uom: raw.uom,
      description: raw.description,
      activeIngredient: [],
      storageConditions: [],
      type: raw.productType as ContractProduct["type"],
      txHash: raw.txHash,
    };
  },

  /** 🔹 Tạo sản phẩm mới trên blockchain */
  createProduct: async (
    signer: ethers.Signer,
    args: {
      name: string;
      uom: string;
      uomQuantity: number;
      companyCode: string;
      productType: string;
      gtin: string;
      origin: string;
      description: string;
      txHash: string; // ✅ Truyền txHash
    }
  ) => {
    console.log("🚀 Gọi createProduct với:", args);
    const c = getContract(signer);
    const tx = await c.createProduct(
      args.name,
      args.uom,
      args.uomQuantity,
      args.companyCode,
      args.productType,
      args.gtin,
      args.origin,
      args.description,
      args.txHash
    );
    return tx.wait();
  },

  /** 🔹 Cập nhật sản phẩm */
  updateProduct: async (
    signer: ethers.Signer,
    args: {
      id: number;
      name?: string;
      uom?: string;
      uomQuantity?: number;
      companyCode?: string;
      productType?: string;
      gtin?: string;
      origin?: string;
      description?: string;
    }
  ) => {
    const c = getContract(signer);
    const tx = await c.updateProduct(
      args.id,
      args.name || "",
      args.uom || "",
      args.uomQuantity || 0,
      args.companyCode || "",
      args.productType || "",
      args.gtin || "",
      args.origin || "",
      args.description || ""
    );
    return tx.wait();
  },

  /** 🔹 Xóa sản phẩm */
  deleteProduct: async (signer: ethers.Signer, id: number) => {
    const c = getContract(signer);
    const tx = await c.deleteProduct(id);
    return tx.wait();
  },
};
