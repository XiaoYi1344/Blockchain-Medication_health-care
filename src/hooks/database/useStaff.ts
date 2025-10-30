
// hooks/useStaff.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { staffService } from "@/services/staffService";
import {
  User,
  CreateUserRequest,
  Role,
  UpdateRoleRequest,
  PermissionType,
  CreateRoleRequest,
} from "@/types/staff";

// ===== USERS =====
export const useUsers = () =>
  useQuery<User[]>({ queryKey: ["users"], queryFn: () => staffService.getAllUsers() });

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserRequest) => staffService.createUser(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useLockUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      staffService.lockUser(userId, isActive),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffService.deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};

// ===== ROLES =====
export const useRoles = () =>
  useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: () => staffService.getAllRolesByCompany(),
  });

export const useCreateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRoleRequest) => staffService.createRole(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roles"] }),
  });
};

// export const useUpdateRole = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationKey: ['update-role'],
//     mutationFn: (payload: UpdateRoleRequest) => staffService.updateRole(payload),
//     onSuccess: () => qc.invalidateQueries({ queryKey: ["roles"] }),
//   });
// };


// ✅ hooks/useStaff.ts
export const useUpdateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["update-role"],
    mutationFn: (payload: UpdateRoleRequest & { userId: string }) =>
      staffService.updateRole(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roles"] }),
  });
};


export const useDeleteRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['delete-role'],
    mutationFn: (roleId: string) => staffService.deleteRole(roleId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roles"] }),
  });
};

// ===== COMPANIES =====
export const useCompanies = () =>
  useQuery({
    queryKey: ["companies"],
    queryFn: () => staffService.getAllCompanies(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

// ===== ROLES THEO COMPANY =====
export const useRolesByCompany = (companyId?: string) =>
  useQuery({
    queryKey: ["roles-company", companyId],
    queryFn: () => staffService.getRolesByCompany(companyId!),
    enabled: !!companyId,
  });


// ===== PERMISSIONS =====
export const usePermissionsByUser = (userId?: string) =>
  useQuery<PermissionType[]>({
    queryKey: ["permissions-user", userId],
    queryFn: () => staffService.getPermissionsByUser(userId!),
    enabled: !!userId && userId !== "NaN" && userId !== "undefined",
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

export const usePermissionsByRole = (roleId?: string) =>
  useQuery<PermissionType[]>({
    queryKey: ["permissions-role", roleId],
    queryFn: () => staffService.getPermissionsByRole(roleId!),
    enabled: !!roleId,
  });

export const usePermissionsByType = () =>
  useQuery<PermissionType[]>({
    queryKey: ["permissions-type"],
    queryFn: () => staffService.getPermissionsByType(),
  });

// ===== ASSIGN PERMISSIONS TO USER =====
export const useAssignUserPermission = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { userId: string; permissionIds: string[] }) =>
      staffService.assignUserPermission(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["permissions-user"] });
    },
  });


};
