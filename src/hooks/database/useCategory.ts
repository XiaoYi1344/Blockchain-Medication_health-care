
// hooks/useCategory.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/categoryService";
import {
  Category,
  CategoryCreatePayload,
  CategoryUpdatePayload,
} from "@/types/category";

// --- Get categories by status ---
export const useCategoriesByStatus = (
  isActive: boolean,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["categories", isActive],
    queryFn: async (): Promise<Category[]> => {
      const data = await categoryService.getAll(isActive);
      return data.map((item) => ({
        _id: item._id,
        name: item.name,
        description: item.description || "",
        isActive: Boolean(item.isActive),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
    },
    staleTime: 1000 * 60 * 2,
    placeholderData: [],
    enabled: options?.enabled ?? true,
  });
};

// --- Get single category ---
export const useCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => categoryService.getOne(categoryId),
    enabled: !!categoryId,
  });
};

// --- Get all categories (regardless of status) ---
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories", "all"],
    queryFn: async (): Promise<Category[]> => {
      const dataActive = await categoryService.getAll(true);
      const dataInactive = await categoryService.getAll(false);
      return [...dataActive, ...dataInactive].map((item) => ({
        _id: item._id,
        name: item.name,
        description: item.description || "",
        isActive: Boolean(item.isActive),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
    },
    staleTime: 1000 * 60 * 2,
    placeholderData: [],
  });
};

// --- Create category ---
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryCreatePayload) => categoryService.create(data),
    onSuccess: () => {
      // invalidate cả 2 danh sách (đã duyệt + chờ duyệt)
      queryClient.invalidateQueries({ queryKey: ["categories", true] });
      queryClient.invalidateQueries({ queryKey: ["categories", false] });
    },
  });
};

// --- Update category ---
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryUpdatePayload) => categoryService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", true] });
      queryClient.invalidateQueries({ queryKey: ["categories", false] });
    },
  });
};

// --- Delete category ---
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: string) => categoryService.delete(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", true] });
      queryClient.invalidateQueries({ queryKey: ["categories", false] });
    },
  });
};

// --- Get audit logs for a category ---
export const useCategoryAudit = (categoryId?: string) => {
  return useQuery({
    queryKey: ["audit", categoryId],
    queryFn: () => (categoryId ? categoryService.getAudit(categoryId) : []),
    enabled: !!categoryId,
  });
};

// --- Approve category ---
export const useApproveCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      categoryId,
      isActive,
    }: {
      categoryId: string;
      isActive: boolean;
    }) => categoryService.approve(categoryId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", true] });
      queryClient.invalidateQueries({ queryKey: ["categories", false] });
    },
  });
};
