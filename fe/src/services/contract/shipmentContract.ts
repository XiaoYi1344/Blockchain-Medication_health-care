// src/services/shipmentContractService.ts
import { ethers } from "ethers";
import type { Shipment } from "@/types/shipment";

const CONTRACT_ADDRESS = "0xAb718396B6a0b799635A6976F08d3A60fDda71B8";
const CONTRACT_ABI = [
  "function createShipment(string shipCode,string batchCode,uint256 quantityBatch,string fromCompanyId,string toCompanyId) returns (uint256)",
  "function createShipmentFull(string shipCode,string batchCode,uint256 quantityBatch,string fromCompanyId,string toCompanyId,string vehiclePlateNumber,string driverName,string driverPhoneNumber,string note,uint256 receivingTime) returns (uint256)",
  "function getAllShipments() view returns (tuple(uint256 id,string shipCode,string batchCode,uint256 quantityBatch,string fromCompanyId,string toCompanyId,string vehiclePlateNumber,string driverName,string driverPhoneNumber,string note,uint256 receivingTime,bool exists)[])",
];

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (...args: unknown[]) => void;
  removeListener?: (...args: unknown[]) => void;
}

function getProvider(): ethers.BrowserProvider | ethers.JsonRpcProvider {
  if (
    typeof window !== "undefined" &&
    (window as { ethereum?: EthereumProvider }).ethereum
  ) {
    return new ethers.BrowserProvider(
      (window as { ethereum: EthereumProvider }).ethereum
    );
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

interface ShipmentOnChain {
  id: bigint; // trước là BigNumber, giờ dùng bigint
  shipCode: string;
  batchCode: string;
  quantityBatch: bigint; // trước là BigNumber, giờ bigint
  fromCompanyId: string;
  toCompanyId: string;
  vehiclePlateNumber: string;
  driverName: string;
  driverPhoneNumber: string;
  note: string;
  receivingTime: bigint; // bigint
  exists: boolean;
}

export const shipmentContractService = {
  createShipment: async (
    signer: ethers.Signer,
    payload: {
      shipCode: string;
      batchCode: string;
      quantityBatch: number;
      fromCompanyId: string;
      toCompanyId: string;
      vehiclePlateNumber?: string;
      driverName?: string;
      driverPhoneNumber?: string;
      note?: string;
      receivingTime?: number;
    }
  ): Promise<{ txHash: string; shipmentId: string }> => {
    const c = getContract(signer);
    let tx;
    if (
      payload.vehiclePlateNumber ||
      payload.driverName ||
      payload.driverPhoneNumber ||
      payload.note ||
      payload.receivingTime
    ) {
      tx = await c.createShipmentFull(
        payload.shipCode,
        payload.batchCode,
        payload.quantityBatch,
        payload.fromCompanyId,
        payload.toCompanyId,
        payload.vehiclePlateNumber || "",
        payload.driverName || "",
        payload.driverPhoneNumber || "",
        payload.note || "",
        payload.receivingTime || 0
      );
    } else {
      tx = await c.createShipment(
        payload.shipCode,
        payload.batchCode,
        payload.quantityBatch,
        payload.fromCompanyId,
        payload.toCompanyId
      );
    }

    const receipt = await tx.wait();
    const shipmentId = receipt.events?.[0]?.args?.id.toString();
    return { txHash: receipt.transactionHash, shipmentId };
  },

  getAllShipments: async (): Promise<Shipment[]> => {
    const c = getContract();
    const data: ShipmentOnChain[] = await c.getAllShipments();
    
    return data.map((s) => ({
      _id: s.id.toString(),
      shipCode: s.shipCode,
      orderCode: "",
      fromCompanyId: s.fromCompanyId,
      toCompanyId: s.toCompanyId,
      batches: [
        { batchCode: s.batchCode, quantity: Number(s.quantityBatch) }, // <-- chuyển từ bigint sang number
      ],
      vehiclePlateNumber: s.vehiclePlateNumber,
      driverName: s.driverName,
      driverPhoneNumber: s.driverPhoneNumber,
      note: s.note,
      receivingTime: s.receivingTime.toString(),
      status: "processing" as const,
    }));
  },
};
