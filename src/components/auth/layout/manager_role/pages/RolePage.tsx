"use client";
import React, { useState, useMemo } from "react";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "notistack"; // ✅ thêm dòng này

// import { supabase } from "@/lib/supabaseClient";
import { RoleTable } from "../widgets/RoleTable";
import {
  useRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  usePermissionsByType,
} from "@/hooks/database/useStaff";
import { Role, UpdateRoleRequest } from "@/types/staff";
import { useIsMutating, useQueryClient } from "@tanstack/react-query";
import RoleForm from "../widgets/RoleForm";
import { getCookie } from "cookies-next";

export default function RolePage() {
  const { enqueueSnackbar } = useSnackbar(); // ✅ khởi tạo toast
  const queryClient = useQueryClient();

  const { data: rolesRaw = [] } = useRoles();
  const { data: permissions = [] } = usePermissionsByType();

  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  const updating = useIsMutating({ mutationKey: ["update-role"] }) > 0;
  const deleting = useIsMutating({ mutationKey: ["delete-role"] }) > 0;

  const [openForm, setOpenForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const roles = useMemo(
    () => rolesRaw.map((r) => ({ ...r, id: r._id })),
    [rolesRaw]
  );

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setOpenForm(true);
  };

  const handleDeleteRole = (roleId: string) => {
    if (!confirm("Bạn có chắc muốn xóa role này?")) return;

    deleteRole.mutate(roleId, {
      onSuccess: () => {
        enqueueSnackbar("Xóa role thành công", { variant: "success" });
        queryClient.invalidateQueries({ queryKey: ["roles"] });
      },
      onError: () => {
        enqueueSnackbar("Lỗi khi xóa role", { variant: "error" });
      },
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Quản lý Roles
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            bgcolor: "#4FC3F7",
            "&:hover": { bgcolor: "#29B6F6" },
          }}
          onClick={() => {
            setEditingRole(null);
            setOpenForm(true);
          }}
        >
          Thêm Role
        </Button>
      </Box>

      <RoleTable
        roles={roles}
        onEdit={handleEditRole}
        onDelete={handleDeleteRole} // ✅ thêm dòng này
        updating={updating}
        deleting={deleting}
      />

      <RoleForm
        open={openForm}
        initial={editingRole}
        permissions={permissions}
        onClose={() => {
          setOpenForm(false);
          setEditingRole(null);
        }}
        onSubmit={(data) => {
          if (editingRole) {
            const userId = getCookie("userId") as string;
            if (!userId) {
              enqueueSnackbar(
                "Không tìm thấy userId, vui lòng đăng nhập lại!",
                { variant: "error" }
              );
              return;
            }

            const payload: UpdateRoleRequest & { userId: string } = {
              userId,
              roleId: editingRole._id,
              name: data.name,
              displayName: data.displayName,
              permissionIds: data.permissionIds,
            };

            updateRole.mutate(payload, {
              onSuccess: () => {
                enqueueSnackbar("Cập nhật role thành công", {
                  variant: "success",
                });
                // ✅ Refetch role list
                queryClient.invalidateQueries({ queryKey: ["roles"] });
                // ✅ Refetch permissions cho role vừa update
                queryClient.invalidateQueries({
                  queryKey: ["permissions-role", editingRole._id],
                });
              },
              onError: () => {
                enqueueSnackbar("Lỗi khi cập nhật role", { variant: "error" });
              },
            });
          } else {
            const payload = {
              name: data.name,
              displayName: data.displayName,
              permissionIds: data.permissionIds,
            };
            createRole.mutate(payload, {
              onSuccess: () => {
                enqueueSnackbar("Tạo role thành công", { variant: "success" });
                queryClient.invalidateQueries({ queryKey: ["roles"] });
              },
              onError: () => {
                enqueueSnackbar("Lỗi khi tạo role", { variant: "error" });
              },
            });
          }

          setOpenForm(false);
          setEditingRole(null);
        }}
      />
    </Box>
  );
}
