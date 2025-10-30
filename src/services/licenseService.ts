import axios from "axios";
import Cookies from "js-cookie";
import { LicenseV6, CreateLicensePayloadV6 } from "@/types/license";

const API_URL = process.env.NEXT_PUBLIC_BE_API_BASE + "/api/license";

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

export const licenseService = {
  getAll: async (): Promise<LicenseV6[]> => {
    const res = await axios.get(API_URL, { headers: getAuthHeaders() });
    return res.data.result ?? res.data.data ?? res.data ?? [];
  },

  create: async (payload: CreateLicensePayloadV6): Promise<LicenseV6> => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("expiryDate", payload.expiryDate);
    formData.append("type", payload.type);

    // Ép kiểu rõ ràng, tránh TS hiểu nhầm
    (payload.images as File[]).forEach((file: File) => {
      formData.append("images", file);
    });

    const res = await axios.post(`${API_URL}/create-license`, formData, {
      headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
    });
    return res.data.result ?? res.data.data ?? res.data;
  },
};
