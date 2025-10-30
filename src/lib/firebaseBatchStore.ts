// // /lib/firebaseOnchain.ts
// import { initializeApp } from "firebase/app";
// import {
//   getFirestore,
//   collection,
//   query,
//   where,
//   getDocs,
//   setDoc,
//   doc,
//   serverTimestamp,
//   DocumentData,
//   FieldValue,
// } from "firebase/firestore";
// import Cookies from "js-cookie";
// import { prepareWriteContract, writeContract } from "wagmi"; // v1 Wagmi
// import type { Address, Abi } from "abitype";
// import { contractConfig } from "@/config/contract";

// import type { Order } from "@/types/order";
// import type { Batch as BatchType } from "@/types/batch";

// // --- Firebase config ---
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FB_API_KEY!,
//   authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN!,
//   projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID!,
//   storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET!,
//   messagingSenderId: process.env.NEXT_PUBLIC_FB_MSG_ID!,
//   appId: process.env.NEXT_PUBLIC_FB_APP_ID!,
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // === Types ===
// export interface TempBatch {
//   userId: string;
//   fromCompanyId: string;
//   toCompanyId: string;
//   orderCode: string;
//   status: string;
//   productCode: string;
//   productQuantity: number;
//   batchCode: string;
//   manufacturerId: string;
//   locationId: string;
//   quantity: number;
//   initialQuantity: number;
//   EXP: string;
//   MFG: string;
//   createdAt: number;
//   createdAtServer: FieldValue;
// }

// export interface OnchainOrder {
//   fromCompanyId: string;
//   toCompanyId: string;
//   orderCode: string;
//   batchCode: string[];
//   quantity: number;
// }

// // ==============================
// // 1️⃣ Lưu dữ liệu tạm (Hàng chờ Onchain)
// // =============================

// export async function addTempBatch(order: Order, batch: BatchType): Promise<void> {
//   const userId = Cookies.get("userId");
//   if (!userId) throw new Error("User chưa đăng nhập");

//   const docId = `${userId}_${order.orderCode}_${batch.batchCode}`;

//   const data: TempBatch = {
//     userId,
//     fromCompanyId: order.createdBy || "", // nếu bạn muốn từ order.createdBy
//     toCompanyId: order.toCompanyId || "",
//     orderCode: order.orderCode,
//     status: order.status,
//     productCode: order.products?.[0]?.productCode || "",
//     productQuantity: order.products?.[0]?.productQuantity || 0,
//     batchCode: batch.batchCode,
//     manufacturerId: batch.manufacturerId || "",
//     locationId: batch.locationId || "", // của inventory
//     quantity: batch.quantity || 0, // currentQuantity của inventory
//     initialQuantity: batch.initialQuantity || 0,
//     EXP: batch.estimatedDate || "",
//     MFG: "", // nếu bạn có MFG thì map vào đây
//     createdAt: Date.now(),
//     createdAtServer: serverTimestamp(),
//   };

//   // Check tồn tại
//   const existingDocs = await getDocs(
//     query(collection(db, "tempBatches"), where("userId", "==", userId))
//   );

//   const alreadyExists = existingDocs.docs.some(
//     (d) => d.id === docId || (d.data() as DocumentData).batchCode === batch.batchCode
//   );
//   if (alreadyExists) return;

//   await setDoc(doc(db, "tempBatches", docId), data);
// }

// // ==============================
// // 2️⃣ Lấy danh sách hàng chờ onchain
// // ==============================
// export async function getUserBatches(): Promise<TempBatch[]> {
//   const userId = Cookies.get("userId");
//   if (!userId) throw new Error("User chưa đăng nhập");

//   const q = query(collection(db, "tempBatches"), where("userId", "==", userId));
//   const snapshot = await getDocs(q);

//   return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as TempBatch) }));
// }

// // ==============================
// // 3️⃣ Gom dữ liệu thành orders để gửi Onchain
// // ==============================
// export async function prepareOrdersForOnchain(): Promise<OnchainOrder[]> {
//   const batches = await getUserBatches();

//   const grouped = Object.values(
//     batches.reduce<Record<string, OnchainOrder>>((acc, b) => {
//       if (!acc[b.orderCode]) {
//         acc[b.orderCode] = {
//           fromCompanyId: b.fromCompanyId,
//           toCompanyId: b.toCompanyId,
//           orderCode: b.orderCode,
//           batchCode: [],
//           quantity: 0,
//         };
//       }
//       acc[b.orderCode].batchCode.push(b.batchCode);
//       acc[b.orderCode].quantity += Number(b.quantity) || 0;
//       return acc;
//     }, {})
//   );

//   return grouped;
// }

// // ==============================
// // 4️⃣ Gửi dữ liệu Onchain (Wagmi v1 chuẩn)
// // ==============================
// export async function pushOrdersToChain(): Promise<void> {
//   const orders = await prepareOrdersForOnchain();
//   console.log("Đang đẩy lên blockchain:", orders);

//   for (const o of orders) {
//     try {
//       // 1️⃣ Chuẩn bị giao dịch
//       const config = await prepareWriteContract({
//         address: contractConfig.address as Address,
//         abi: contractConfig.abi as Abi,
//         functionName: "createOrder",
//         args: [o.fromCompanyId, o.toCompanyId, o.orderCode, o.batchCode, o.quantity],
//       });

//       // 2️⃣ Gửi giao dịch
//       const tx = await writeContract(config);
//       console.log("Tx sent:", tx.hash);
//     } catch (err) {
//       console.error("Lỗi gửi order lên blockchain:", err);
//     }
//   }
// }
