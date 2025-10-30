import axios from "axios";
import Cookies from "js-cookie";
import {
//   Inventory,
  CreateInventoryReq,
  UpdateInventoryReq,
  ExportInventoryReq,
  InventoryLocation,
} from "@/types/location";

const API_URL = process.env.NEXT_PUBLIC_BE_API_BASE + "/api/inventory";

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
  };
};

export const inventoryService = {
  create: async (payload: CreateInventoryReq): Promise<void> => {
    const res = await axios.post(API_URL, payload, {
      headers: getAuthHeaders(),
    });
    if (!res.data.success) {
      throw new Error(res.data.message || "Create inventory failed");
    }
    return;
  },

  update: async (payload: UpdateInventoryReq): Promise<void> => {
    const res = await axios.put(API_URL, payload, {
      headers: getAuthHeaders(),
    });
    if (!res.data.success) {
      throw new Error(res.data.message || "Update inventory failed");
    }
    return;
  },

  export: async (payload: ExportInventoryReq): Promise<void> => {
    const res = await axios.post(`${API_URL}/export`, payload, {
      headers: getAuthHeaders(),
    });
    if (!res.data.success) {
      throw new Error(res.data.message || "Export inventory failed");
    }
    return;
  },

  // services/inventoryService.ts
  getAll: async (): Promise<InventoryLocation[]> => {
    const res = await axios.get<{ data: InventoryLocation[] }>(
      `${API_URL}/get-all`,
      {
        headers: getAuthHeaders(),
      }
    );
    return res.data.data;
  },
};
