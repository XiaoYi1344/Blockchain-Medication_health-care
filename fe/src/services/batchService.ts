// import axios from "axios";
// import { getCookie } from "cookies-next";
// import {
//   Batch,
//   BatchCreatePayload,
//   BatchUpdatePayload,
//   BatchStateUpdatePayload,
//   BatchApprovalPayload,
// } from "@/types/batch";

// const API_BASE = process.env.NEXT_PUBLIC_BE_API_BASE;

// const api = axios.create({
//   baseURL: `${API_BASE}/api/batch`,
//   headers: {
//     "ngrok-skip-browser-warning": "true",
//     "Cache-Control": "no-cache",
//   },
// });

// api.interceptors.request.use((config) => {
//   const token = getCookie("accessToken");
//   const userId = getCookie("userId");
//   const roleName = getCookie("roleName");
//   const roleId = getCookie("roleId");

//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   if (userId) config.headers["X-User-Id"] = userId;
//   if (roleName) config.headers["X-Role-Name"] = roleName;
//   if (roleId) config.headers["X-Role-Id"] = roleId;

//   return config;
// });

// export const batchService = {
//   create: async (payload: BatchCreatePayload) => {
//     const res = await api.post("/", payload);
//     return res.data;
//   },
//   approve: async (payload: BatchApprovalPayload) => {
//     await api.put("/approval", payload);
//   },
//   updateState: async (payload: BatchStateUpdatePayload) => {
//     await api.put("/update-state", payload);
//   },
//   update: async (payload: BatchUpdatePayload) => {
//     await api.put("/", payload);
//   },
//   getOne: async (batchCode: string): Promise<Batch> => {
//     const res = await api.get(`/${batchCode}`);
//     return res.data.data; // nếu API cũng trả về data
//   },
//   getAll: async (): Promise<Batch[]> => {
//     const res = await api.get("/get");
//     // Lấy đúng mảng data
//     return Array.isArray(res.data.data) ? res.data.data : [];
//   },
// };


import axios, { AxiosError } from "axios";
import { getCookie } from "cookies-next";
import { supabase } from "@/lib/supabaseClient";
import {
  Batch,
  BatchCreatePayload,
  BatchUpdatePayload,
  BatchStateUpdatePayload,
  BatchApprovalPayload,
} from "@/types/batch";

const API_BASE = process.env.NEXT_PUBLIC_BE_API_BASE;

const api = axios.create({
  baseURL: `${API_BASE}/api/batch`,
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Cache-Control": "no-cache",
  },
});

api.interceptors.request.use((config) => {
  const token = getCookie("accessToken");
  const userId = getCookie("userId");
  const roleName = getCookie("roleName");
  const roleId = getCookie("roleId");

  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (userId) config.headers["X-User-Id"] = userId;
  if (roleName) config.headers["X-Role-Name"] = roleName;
  if (roleId) config.headers["X-Role-Id"] = roleId;

  return config;
});

export const batchService = {
  create: async (payload: BatchCreatePayload) => {
    const res = await api.post("/", payload);
    return res.data;
  },

  approve: async (payload: BatchApprovalPayload) => {
    await api.put("/approval", payload);
  },

  updateState: async (payload: BatchStateUpdatePayload) => {
    await api.put("/update-state", payload);
  },

  update: async (payload: BatchUpdatePayload) => {
    await api.put("/", payload);
  },

  /** 🟣 Lấy 1 batch — fallback sang Supabase nếu không có token */
  getOne: async (batchCode: string): Promise<Batch> => {
    try {
      const res = await api.get(`/${batchCode}`);
      return res.data.data;
    } catch (error: unknown) {
      // Kiểm tra lỗi axios
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;

      if (status === 401 || axiosError.message.includes("Unauthorized")) {
        console.warn("⚠️ Không có token, fallback Supabase...");

        const { data, error: sbError } = await supabase
          .from("batches")
          .select("*")
          .eq("batchCode", batchCode)
          .single();

        if (sbError || !data) {
          console.error("❌ Supabase error:", sbError?.message);
          throw new Error("Không tìm thấy lô sản phẩm trong Supabase");
        }

        console.log("✅ Supabase batchData:", data);
        return data as Batch;
      }

      throw error;
    }
  },

  getAll: async (): Promise<Batch[]> => {
    const res = await api.get("/get");
    return Array.isArray(res.data.data) ? res.data.data : [];
  },
};
