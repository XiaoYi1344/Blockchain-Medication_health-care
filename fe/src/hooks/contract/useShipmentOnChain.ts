// src/hooks/database/useShipmentOnChain.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { shipmentContractService } from "@/services/contract/shipmentContract";
import type { Shipment } from "@/types/shipment";
import { ethers } from "ethers";

// ========================
// FETCH ALL SHIPMENTS ON CHAIN
// ========================
export const useShipmentsOnChain = () => {
  return useQuery<Shipment[]>({
    queryKey: ["shipments", "on-chain"],
    queryFn: () => shipmentContractService.getAllShipments(),
  });
};

// ========================
// CREATE SHIPMENT ON CHAIN
// ========================
export const useCreateShipmentOnChain = () => {
  return useMutation<
    { txHash: string; shipmentId: string },
    Error,
    {
      signer: ethers.Signer;
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
      };
    }
  >({
    mutationFn: ({ signer, payload }) =>
      shipmentContractService.createShipment(signer, payload),
  });
};
