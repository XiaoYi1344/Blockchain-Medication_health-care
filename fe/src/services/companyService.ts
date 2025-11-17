import axios from "axios";
import Cookies from "js-cookie";
import {
  CompanyV6,
  UpdateCompanyPayloadV6,
  GetCompanyQueryV6,
} from "@/types/company";

const API_URL = process.env.NEXT_PUBLIC_BE_API_BASE + "/api/company";

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

export const companyService = {
  // UPDATE companyF
  update: async (payload: UpdateCompanyPayloadV6): Promise<CompanyV6> => {
    const res = await axios.put(API_URL, payload, {
      headers: getAuthHeaders(),
    });
    return res.data.result ?? res.data.data ?? res.data;
  },

  // GET company
  get: async (query: GetCompanyQueryV6): Promise<CompanyV6> => {
    const res = await axios.get(API_URL, {
      headers: getAuthHeaders(),
      params: query,
    });
    return res.data.result ?? res.data.data ?? res.data;
  },
};
