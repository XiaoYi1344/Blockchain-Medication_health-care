import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import { OrderStatus } from "@/types/order";

type SyncShipmentToOrderInput = {
  orderCode: string;
  status: OrderStatus;
};

export const useSyncShipmentToOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SyncShipmentToOrderInput) => {
      const { orderCode, status } = input;

      if (!orderCode) throw new Error("Order code is required");

      return orderService.update({
        orderCode,
        status,
        data: [],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordersReceived"] });
    },
  });
};
