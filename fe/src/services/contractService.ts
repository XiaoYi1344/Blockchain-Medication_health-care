// // services/contractService.ts
// // Responsibilities: set up ethers provider + signer + contract instance, and helpers for write/read.

// import { ethers } from "ethers";

// const RPC_URL = process.env.ETH_RPC_URL || "http://localhost:8545";
// const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
// const CONTRACT_ADDRESS = process.env.MEDICATE_CONTRACT_ADDRESS || "";

// // Replace with your real contract ABI (this is just a minimal interface subset)
// const CONTRACT_ABI = [
//   "event CategoryCreated(uint256 indexed id, string name, string description)",
//   "event CategoryUpdated(uint256 indexed id, string name, string description)",
//   "event CategoryDeleted(uint256 indexed id)",
//   "event ProductCreated(uint256 indexed id, string productCode, uint256 companyCode, string txHash)",
//   "event ProductUpdated(uint256 indexed id)",

//   "function createCategory(string name, string description) public returns (uint256)",
//   "function createProduct(string productCode, uint256 companyCode, uint256[] categoryIds, string txHash) public returns (uint256)",
//   "function verifyProduct(uint256 productId, bool status) public",
// ];

// let provider: ethers.JsonRpcProvider | undefined;
// let signer: ethers.Wallet | undefined;
// let contract: ethers.Contract | undefined;

// export function initContractService() {
//   if (!provider) {
//     provider = new ethers.JsonRpcProvider(RPC_URL);
//   }

//   if (PRIVATE_KEY && !signer) {
//     signer = new ethers.Wallet(PRIVATE_KEY, provider);
//   }

//   if (CONTRACT_ADDRESS && !contract) {
//     contract = new ethers.Contract(
//       CONTRACT_ADDRESS,
//       CONTRACT_ABI,
//       signer ?? provider
//     );
//   }
// }

// export function getProvider(): ethers.JsonRpcProvider {
//   if (!provider) initContractService();
//   if (!provider) throw new Error("Provider not initialized");
//   return provider;
// }

// export function getContract(): ethers.Contract {
//   if (!contract) initContractService();
//   if (!contract) throw new Error("Contract not initialized");
//   return contract;
// }

// // ---- Write Helpers ----
// export async function callCreateCategory(
//   name: string,
//   description: string
// ): Promise<ethers.TransactionReceipt> {
//   const c = getContract();
//   const tx = await c.createCategory(name, description);
//   return await tx.wait();
// }

// export async function callCreateProduct(
//   productCode: string,
//   companyCode: number,
//   categoryIds: number[],
//   txHash: string
// ): Promise<ethers.TransactionReceipt> {
//   const c = getContract();
//   const tx = await c.createProduct(productCode, companyCode, categoryIds, txHash);
//   return await tx.wait();
// }

// export default {
//   initContractService,
//   getProvider,
//   getContract,
//   callCreateCategory,
//   callCreateProduct,
// };

// /**
//  * Notes:
//  * - This version uses ethers v6 API (`ethers.JsonRpcProvider`, not v5 `ethers.providers.JsonRpcProvider`).
//  * - If your project is still on ethers v5, I can rewrite accordingly.
//  * - Always keep PRIVATE_KEY outside env in production (use Vault, AWS KMS, GCP Secret Manager, etc).
//  * - Consider adding read-only helpers for events & queries (`contract.queryFilter`).
//  */
