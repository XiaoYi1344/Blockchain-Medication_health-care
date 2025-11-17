import axios from "axios";
import Cookies from "js-cookie";
import { Order, UpdateOrderRequest } from "@/types/order";

const API_URL = process.env.NEXT_PUBLIC_BE_API_BASE + "/api/order";

const getAuthHeaders = () => {
  const accessToken = Cookies.get("accessToken");
  const userId = Cookies.get("userId");
  const roleName = Cookies.get("roleName");
  const roleId = Cookies.get("roleId");

  return {
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
    "X-User-Id": userId || "",
    "X-Role-Name": roleName || "",
    "X-Role-Id": roleId || "",
    "ngrok-skip-browser-warning": "true",
  };
};

export const orderService = {
  // Lấy tất cả đơn hàng đã nhận
  getAllReceived: async (): Promise<Order[]> => {
    const res = await axios.get(`${API_URL}/get-all-received`, {
      headers: getAuthHeaders(),
    });
    return res.data.result ?? res.data.data ?? res.data ?? [];
  },

  // Lấy tất cả đơn hàng chưa nhận
  getAllUnreceived: async (): Promise<Order[]> => {
    const res = await axios.get(`${API_URL}/get-all-unreceived`, {
      headers: getAuthHeaders(),
    });
    return res.data.result ?? res.data.data ?? res.data ?? [];
  },

  // Nhận hoặc từ chối đơn hàng
  updateStatus: async (
    orderCode: string,
    status: "order_received" | "reject"
  ): Promise<void> => {
    const res = await axios.put(
      `${API_URL}/received`,
      { orderCode, status },
      { headers: getAuthHeaders() }
    );
    return res.data.result ?? res.data.data ?? res.data;
  },

  // Cập nhật thông tin đơn hàng
  update: async (payload: UpdateOrderRequest): Promise<void> => {
    const res = await axios.put(API_URL, payload, {
      headers: getAuthHeaders(),
    });
    return res.data.result ?? res.data.data ?? res.data;
  },
};
