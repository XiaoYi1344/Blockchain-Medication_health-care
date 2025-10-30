import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { batchService } from "@/services/batchService";
import {
  Batch,
  BatchCreatePayload,
  BatchUpdatePayload,
  BatchStateUpdatePayload,
  BatchApprovalPayload,
} from "@/types/batch";
import { BatchWithInventory } from "@/types/location";

// --- Queries ---
export const useBatches = () => {
  return useQuery<BatchWithInventory[], Error>({
    queryKey: ["batches"],
    queryFn: async () => {
      const batches: Batch[] = await batchService.getAll(); // batch gốc

      // map sang BatchWithInventory
      return batches.map((b: Batch) => ({
        ...b,
        locationId: (b as Partial<BatchWithInventory>).locationId || "UNKNOWN",
        currentQuantity: (b as Partial<BatchWithInventory>).currentQuantity || 0,
        uom: "box",
      }));
    },
  });
};


export const useBatch = (batchCode: string) => {
  return useQuery<Batch, Error>({
    queryKey: ["batch", batchCode],
    queryFn: () => batchService.getOne(batchCode),
  });
};


// --- Mutations ---
export const useCreateBatch = () => {
  const queryClient = useQueryClient();
  return useMutation<{ batchCode: string }, Error, BatchCreatePayload>({
    mutationFn: batchService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
    },
  });
};

export const useUpdateBatch = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, BatchUpdatePayload>({
    mutationFn: batchService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
    },
  });
};

export const useUpdateBatchState = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, BatchStateUpdatePayload>({
    mutationFn: batchService.updateState,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
    },
  });
};

export const useApproveBatch = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, BatchApprovalPayload>({
    mutationFn: batchService.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
    },
  });
};
