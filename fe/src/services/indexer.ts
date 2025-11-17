// // services/indexer.ts
// // Responsibilities: listen to contract events and persist a fast index for queries

// import fs from "fs/promises";
// import { existsSync } from "fs";
// import contractService from "./contractService";

// const INDEX_FILE = process.env.INDEX_FILE || "./chain_index.json";

// type IndexData = {
//   categories: {
//     id: number;
//     name: string;
//     description: string;
//     txHash: string;
//     blockNumber: number;
//   }[];
//   products: {
//     id: number;
//     productCode: string;
//     companyCode: number;
//     txHash: string;
//     blockNumber: number;
//   }[];
// };

// async function loadIndex(): Promise<IndexData> {
//   if (!existsSync(INDEX_FILE)) {
//     const empty: IndexData = { categories: [], products: [] };
//     await fs.writeFile(INDEX_FILE, JSON.stringify(empty, null, 2));
//     return empty;
//   }
//   try {
//     const raw = await fs.readFile(INDEX_FILE, "utf-8");
//     return JSON.parse(raw) as IndexData;
//   } catch (err) {
//     console.error("Failed to parse index file, reinitializing:", err);
//     const empty: IndexData = { categories: [], products: [] };
//     await fs.writeFile(INDEX_FILE, JSON.stringify(empty, null, 2));
//     return empty;
//   }
// }

// async function saveIndex(data: IndexData) {
//   await fs.writeFile(INDEX_FILE, JSON.stringify(data, null, 2));
// }

// export async function startIndexer() {
//   contractService.initContractService();
//   const contract = contractService.getContract();
//   if (!contract) throw new Error("contract not initialized");

//   console.log("Indexer starting...");

//   // CategoryCreated(id, name, description)
//   contract.on(
//     "CategoryCreated",
//     async (id: bigint, name: string, description: string, event: any) => {
//       const data = await loadIndex();
//       data.categories.push({
//         id: Number(id),
//         name,
//         description,
//         txHash: event.log.transactionHash,
//         blockNumber: Number(event.log.blockNumber),
//       });
//       await saveIndex(data);
//       console.log("Indexed CategoryCreated", id.toString());
//     }
//   );

//   // ProductCreated(id, productCode, companyCode, txHash)
//   contract.on(
//     "ProductCreated",
//     async (
//       id: bigint,
//       productCode: string,
//       companyCode: bigint,
//       txHash: string,
//       event: any
//     ) => {
//       const data = await loadIndex();
//       data.products.push({
//         id: Number(id),
//         productCode,
//         companyCode: Number(companyCode),
//         txHash,
//         blockNumber: Number(event.log.blockNumber),
//       });
//       await saveIndex(data);
//       console.log("Indexed ProductCreated", id.toString());
//     }
//   );

//   console.log("Indexer started, listening to contract events...");
// }

// // If run directly with ts-node
// if (require.main === module) {
//   startIndexer().catch((err) => {
//     console.error("Indexer failed:", err);
//     process.exit(1);
//   });
// }

// /**
//  * Explanation:
//  * - Listens to on-chain events and maintains a JSON index.
//  * - Uses async fs (non-blocking).
//  * - Defensive JSON parsing to avoid crashes on corrupted index file.
//  * - Converts BigInt → number for easier queries.
//  *
//  * Note (when BE & contract ready):
//  * - Replace JSON file with Postgres/Redis/Elastic for scalability.
//  * - Coordinate: if BE also consumes events, make BE the single source of truth.
//  */
