
// src/services/shipment.service.ts
import axios from "axios";
import Cookies from "js-cookie";
import {
  Shipment,

  UpdateShipmentRequest,
  CreateShipmentResponse,
  CreateShipmentRequest,
  // ApiResponse,
} from "@/types/shipment";

const API_URL = process.env.NEXT_PUBLIC_BE_API_BASE + "/api/shipment";

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

export const shipmentService = {
  // CREATE shipment
 create: async (data: CreateShipmentRequest): Promise<CreateShipmentResponse> => {
  const res = await axios.post(`${API_URL}`, data, { headers: getAuthHeaders() });
  return res.data.result ?? res.data.data ?? res.data;
}
,

  // UPDATE shipment
  update: async (data: UpdateShipmentRequest): Promise<Shipment> => {
    const res = await axios.put(`${API_URL}`, data, { headers: getAuthHeaders() });
    return res.data.result ?? res.data.data ?? res.data;
  },

  // STOP shipment
  stop: async (shipmentId: string): Promise<Shipment> => {
    const res = await axios.put(`${API_URL}/${shipmentId}`, null, { headers: getAuthHeaders() });
    return res.data.result ?? res.data.data ?? res.data;
  },

  // GET all shipments by company
  getAllByCompany: async (): Promise<Shipment[]> => {
    const res = await axios.get(`${API_URL}/get-all`, { headers: getAuthHeaders() });
    return res.data.result ?? res.data.data ?? res.data ?? [];
  },

  // GET all shipments by user
  getAllByUser: async (): Promise<Shipment[]> => {
    const res = await axios.get(`${API_URL}/get-by-user`, { headers: getAuthHeaders() });
    return res.data.result ?? res.data.data ?? res.data ?? [];
  },

  // GET shipments by orderCode
  getByOrderCode: async (orderCode: string): Promise<Shipment[]> => {
    const res = await axios.get(`${API_URL}/get-by-code/${orderCode}`, { headers: getAuthHeaders() });
    return res.data.result ?? res.data.data ?? res.data ?? [];
  },
};
