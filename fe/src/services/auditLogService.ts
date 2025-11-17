// import axios from "axios";
// import { getCookie } from "cookies-next";
// import { AuditLog } from "@/types/auditLog";

// const API_BASE = process.env.NEXT_PUBLIC_BE_API_BASE;

// const api = axios.create({
//   baseURL: `${API_BASE}/api`,
//   headers: {
//     "ngrok-skip-browser-warning": "true",
//     "Cache-Control": "no-cache",
//   },
// });

// // Gắn accessToken cho tất cả request
// api.interceptors.request.use((config) => {
//   const token = getCookie("accessToken");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export const auditLogService = {
//   // Lấy tất cả audit logs (có thể filter theo entityType hoặc userId)
//   async getAll(params?: { entityType?: string; actorUserId?: number }): Promise<AuditLog[]> {
//     const res = await api.get("/audit-log", { params });
//     return res.data.data;
//   },

//   // Lấy log theo ID
//   async getById(id: number): Promise<AuditLog> {
//     const res = await api.get(`/audit-log/${id}`);
//     return res.data.data;
//   },

//   // Tạo log mới (nếu cần log thủ công từ FE)
//   async create(payload: Omit<AuditLog, "id" | "createdAt">): Promise<AuditLog> {
//     const res = await api.post("/audit-log", payload);
//     return res.data.data;
//   },

//   // Xóa log (chỉ khi có permission đặc biệt, thường ít khi cần)
//   async delete(id: number): Promise<void> {
//     await api.delete(`/audit-log/${id}`);
//   },
// };


// src/services/auditService.ts
import axios from "axios";
import { AuditLog } from "@/types/auditLog";

/**
 * Lấy audit logs theo entityType và entityId
 */
export const getAuditLogs = async (
  entityType: string,
  entityId: string | number
): Promise<AuditLog[]> => {
  if (!entityType || !entityId) return [];

  try {
    const res = await axios.get("/api/audit-logs", {
      params: { entityType, entityId },
    });
    return Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (err) {
    console.error("⚠️ [auditService.getAuditLogs]", err);
    return [];
  }
};

// Shortcut
export const getAuditLogsByCategory = (categoryId: string | number) =>
  getAuditLogs("Category", categoryId);

export const getAuditLogsByUser = (userId: string | number) =>
  getAuditLogs("User", userId);

export const getAuditLogsByProduct = (productId: string | number) =>
  getAuditLogs("Product", productId);

