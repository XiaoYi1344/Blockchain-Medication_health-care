import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import { Order, UpdateOrderRequest } from "@/types/order";

// === Orders đã nhận ===
export const useReceivedOrders = () => {
  return useQuery<Order[], Error>({
    queryKey: ["receivedOrders"],
    queryFn: () => orderService.getAllReceived(),
    staleTime: 5 * 60 * 1000,
  });
};

// === Orders chưa nhận ===
export const useUnreceivedOrders = () => {
  return useQuery<Order[], Error>({
    queryKey: ["unreceivedOrders"],
    queryFn: () => orderService.getAllUnreceived(),
    staleTime: 5 * 60 * 1000,
  });
};

// === Nhận/Từ chối đơn hàng ===
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    { orderCode: string; status: "order_received" | "reject" }
  >({
    mutationFn: ({ orderCode, status }) =>
      orderService.updateStatus(orderCode, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receivedOrders"] });
      queryClient.invalidateQueries({ queryKey: ["unreceivedOrders"] });
    },
  });
};

// === Cập nhật thông tin đơn hàng ===
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, UpdateOrderRequest>({
    mutationFn: (payload) => orderService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receivedOrders"] });
      queryClient.invalidateQueries({ queryKey: ["unreceivedOrders"] });
    },
  });
};
