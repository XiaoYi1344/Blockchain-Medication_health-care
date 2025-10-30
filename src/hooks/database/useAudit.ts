

/// hooks/useAudit.ts
import { useQuery } from "@tanstack/react-query";
import { AuditLog } from "@/types/auditLog";
import {
  getAuditLogsByCategory,
  getAuditLogsByProduct,
  getAuditLogsByUser,
} from "@/services/auditLogService";

// 🔹 Lấy audit theo Product
export const useAuditLogsByProduct = (productId?: string | number) => {
  return useQuery<AuditLog[]>({
    queryKey: ["auditLogs", "product", productId],
    queryFn: () => getAuditLogsByProduct(productId!),
    enabled: !!productId,
  });
};

// 🔹 Lấy audit theo Category
export const useAuditLogsByCategory = (categoryId?: string | number) => {
  return useQuery<AuditLog[]>({
    queryKey: ["auditLogs", "category", categoryId],
    queryFn: () => getAuditLogsByCategory(categoryId!),
    enabled: !!categoryId,
  });
};

// 🔹 Lấy audit theo User
export const useAuditLogsByUser = (userId?: string | number) => {
  return useQuery<AuditLog[]>({
    queryKey: ["auditLogs", "user", userId],
    queryFn: () => getAuditLogsByUser(userId!),
    enabled: !!userId,
  });
};
