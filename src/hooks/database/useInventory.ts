import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  //   Inventory,
  CreateInventoryReq,
  UpdateInventoryReq,
  ExportInventoryReq,
} from "@/types/location";
import { inventoryService } from "@/services/inventoryService";

export const useInventory = () => {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: () => inventoryService.getAll(),
  });
};

export const useCreateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInventoryReq) =>
      inventoryService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });
};

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateInventoryReq) =>
      inventoryService.update(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });
};

export const useExportInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ExportInventoryReq) =>
      inventoryService.export(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });
};
