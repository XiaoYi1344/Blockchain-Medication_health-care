// services/locationService.ts
import axios from "axios";
import Cookies from "js-cookie";
import {
  Location,
  CreateLocationReq,
  UpdateLocationReq,
  LocationAPIResponse,
} from "@/types/location";

const API_URL = process.env.NEXT_PUBLIC_BE_API_BASE + "/api/location";

// --- Helper lấy header auth ---
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

// --- Location service ---
export const locationService = {
  getAll: async (isActive: boolean): Promise<Location[]> => {
    const res = await axios.post(
      `${API_URL}/get-all`,
      { isActive },
      { headers: getAuthHeaders() }
    );

    return res.data.data.map(
      (item: LocationAPIResponse & { currentQuantity?: number }) => ({
        _id: item._id,
        name: item.name,
        address: item.address || "",
        type: item.type,
        preservationCapability: item.preservationCapability || "NORMAL",
        maximum: item.maximum || 0,
        isActive: item.isActive,
        currentQuantity: item.currentQuantity || 0, // ✅ mặc định 0 nếu chưa có
      })
    );
  },

  create: async (payload: CreateLocationReq): Promise<Location> => {
    const res = await axios.post(API_URL, payload, {
      headers: getAuthHeaders(),
    });
    if (!res.data.success) throw new Error(res.data.message || "Create failed");

    // Trả về Location hợp lệ với id từ API
    return {
      _id: res.data.data._id,
      name: res.data.data.name || payload.name,
      address: res.data.data.address || payload.address,
      type: res.data.data.type || payload.type,
      preservationCapability:
        res.data.data.preservationCapability || payload.preservationCapability,
      maximum: res.data.data.maximum || payload.maximum,
      isActive: true,
    };
  },

  update: async (payload: UpdateLocationReq): Promise<Location> => {
    const res = await axios.put(API_URL, payload, {
      headers: getAuthHeaders(),
    });
    if (!res.data.success) throw new Error(res.data.message || "Update failed");

    return {
      _id: payload.locationId,
      name: payload.name,
      address: payload.address,
      type: payload.type,
      preservationCapability: payload.preservationCapability,
      maximum: payload.maximum,
      isActive: payload.isActive,
    };
  },
};
