// "use client";
// import React from "react";
// import { Role, PermissionType } from "@/types/staff";
// import {
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Chip,
//   Stack,
//   CircularProgress,
// } from "@mui/material";
// import { useDeleteRole, useRoles, useUpdateRole } from "@/hooks/database/useStaff"; // nhớ import hook update
// import { useQueries, useQueryClient } from "@tanstack/react-query";
// import { staffService } from "@/services/staffService";

// interface RoleTableProps {
//   roles: Role[];
//   onEdit: (role: Role) => void;
//   updating: boolean;
//   deleting: boolean;
// }

// export const RoleTable: React.FC<RoleTableProps> = ({
//   roles,
//   onEdit,
//   updating,
//   deleting,
// }) => {
//   const { refetch } = useRoles();
//   const deleteRole = useDeleteRole();
//   const updateRole = useUpdateRole(); // hook update role
//   const queryClient = useQueryClient();

//   // Lấy permissions cho tất cả roles bằng useQueries
//   const rolePermissionsQueries = useQueries({
//     queries: roles.map((role) => ({
//       queryKey: ["permissions-role", role._id],
//       queryFn: () => staffService.getPermissionsByRole(role._id),
//       enabled: !!role._id,
//     })),
//   });

//   const handleDeleteRole = async (roleId?: string) => {
//     if (!roleId) return console.error("Role ID không hợp lệ!");
//     if (!confirm("Bạn có chắc muốn xóa role này?")) return;

//     try {
//       await deleteRole.mutateAsync(roleId);
//       queryClient.invalidateQueries({ queryKey: ["roles"] });
//       queryClient.invalidateQueries({ queryKey: ["permissions-role", roleId] });
//       refetch();
//     } catch (err) {
//       console.error("Xóa role thất bại:", err);
//       alert("Xóa role thất bại. Vui lòng thử lại sau.");
//     }
//   };

//   // const handleUpdateRole = async (role: Role) => {
//   //   try {
//   //     const payload: UpdateRoleRequest = {
//   //       roleId: role._id,
//   //       name: role.name,
//   //       displayName: role.displayName,
//   //       permissionIds: role.permissions?.map((p) => p._id) ?? [],
//   //     };

//   //     await updateRole.mutateAsync(payload);

//   //     queryClient.invalidateQueries({
//   //       queryKey: ["permissions-role", role._id],
//   //     });
//   //     queryClient.invalidateQueries({ queryKey: ["roles"] });
//   //   } catch (err) {
//   //     console.error("Update role failed:", err);
//   //   }
//   // };

// //   const handleUpdateRole = async (role: Role) => {
// //   try {
// //     const userId = getCookie("userId") as string; // 👈 lấy từ cookie (được backend set khi login)
// //     if (!userId) {
// //       alert("Không tìm thấy userId, vui lòng đăng nhập lại!");
// //       return;
// //     }

// //     // ✅ đảm bảo gửi đủ permission (cả cũ + mới)
// //     const existingPermissions = role.permissions?.map((p) => p._id) ?? [];

// //     const payload: UpdateRoleRequest & { userId: string } = {
// //       userId,
// //       roleId: role._id,
// //       name: role.name,
// //       displayName: role.displayName,
// //       permissionIds: existingPermissions, // 👈 đầy đủ permissions
// //     };

// //     await updateRole.mutateAsync(payload);

// //     queryClient.invalidateQueries({ queryKey: ["permissions-role", role._id] });
// //     queryClient.invalidateQueries({ queryKey: ["roles"] });
// //   } catch (err) {
// //     console.error("Update role failed:", err);
// //     alert("Cập nhật role thất bại. Vui lòng thử lại sau.");
// //   }
// // };

//   return (
//     <Table>
//       <TableHead>
//         <TableRow>
//           <TableCell>Tên Role</TableCell>
//           <TableCell>Display Name</TableCell>
//           <TableCell>Permission</TableCell>
//           <TableCell>Hành động</TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {roles.map((role, index) => {
//           const roleQuery = rolePermissionsQueries[index];
//           const permissions: PermissionType[] = roleQuery?.data ?? [];
//           const isLoading = roleQuery?.isLoading ?? false;

//           return (
//             <TableRow key={role._id}>
//               <TableCell>{role.name}</TableCell>
//               <TableCell>{role.displayName}</TableCell>
//               <TableCell>
//                 {isLoading ? (
//                   <CircularProgress size={20} />
//                 ) : permissions.length > 0 ? (
//                   <Stack
//                     direction="row"
//                     flexWrap="wrap"
//                     sx={{ gap: 1, rowGap: 1, py: 1 }}
//                   >
//                     {permissions.map((p, idx) => (
//                       <Chip
//                         key={`${p._id}-${idx}`}
//                         label={p.displayName}
//                         size="small"
//                         color="primary"
//                         variant="outlined"
//                         sx={{
//                           borderRadius: "12px",
//                           fontSize: "0.8rem",
//                           fontWeight: 500,
//                         }}
//                       />
//                     ))}
//                   </Stack>
//                 ) : (
//                   <Stack
//                     alignItems="center"
//                     justifyContent="center"
//                     sx={{ py: 1, px: 2, bgcolor: "grey.50", borderRadius: 2 }}
//                   >
//                     <span style={{ color: "#888", fontSize: "0.85rem" }}>
//                       Chưa có permission
//                     </span>
//                   </Stack>
//                 )}
//               </TableCell>

//               <TableCell>
//                 {/* <Button
//                   onClick={() => handleUpdateRole(role)}
//                   variant="outlined"
//                   sx={{ mr: 1, borderRadius: 2, textTransform: "none" }}
//                   disabled={updating}
//                 >
//                   Sửa
//                 </Button> */}

//                 {/* <Button
//                   onClick={() => onEdit(role)} // ✅ thay vì gọi handleUpdateRole
//                   variant="outlined"
//                   sx={{ mr: 1, borderRadius: 2, textTransform: "none" }}
//                   disabled={updating}
//                 >
//                   Sửa
//                 </Button> */}

// {/* <Button
//   onClick={() => handleUpdateRole(role)}
//   variant="outlined"
//   sx={{ mr: 1, borderRadius: 2, textTransform: "none" }}
//   disabled={updating}
// >
//   Sửa
// </Button> */}

// <Button
//   onClick={() => onEdit(role)} // ✅ open form via RolePage
//   variant="outlined"
//   sx={{ mr: 1, borderRadius: 2, textTransform: "none" }}
//   disabled={updating}
// >
//   Sửa
// </Button>

//                 <Button
//                   onClick={() => handleDeleteRole(role._id)}
//                   color="error"
//                   variant="outlined"
//                   sx={{ borderRadius: 2, textTransform: "none" }}
//                   disabled={deleting}
//                 >
//                   Xóa
//                 </Button>
//               </TableCell>
//             </TableRow>
//           );
//         })}
//       </TableBody>
//     </Table>
//   );
// };

"use client";
import React from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Stack,
  CircularProgress,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { Role, PermissionType } from "@/types/staff";
// import { useDeleteRole, useRoles } from "@/hooks/database/useStaff";
import { useQueries } from "@tanstack/react-query";
import { staffService } from "@/services/staffService";
import { motion } from "framer-motion";

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void; // ✅ thêm dòng này
  updating: boolean;
  deleting: boolean;
}

export const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  onEdit,
  onDelete,
  updating,
  deleting,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const queryClient = useQueryClient();
  // const { refetch } = useRoles();
  // const deleteRole = useDeleteRole();

  const rolePermissionsQueries = useQueries({
    queries: roles.map((role) => ({
      queryKey: ["permissions-role", role._id],
      queryFn: () => staffService.getPermissionsByRole(role._id),
      enabled: !!role._id,
    })),
  });

  // const handleDeleteRole = async (roleId?: string) => {
  //   if (!roleId) return;
  //   if (!confirm("Bạn có chắc muốn xóa role này?")) return;

  //   try {
  //     await deleteRole.mutateAsync(roleId);
  //     queryClient.invalidateQueries({ queryKey: ["roles"] });
  //     refetch();
  //   } catch (err) {
  //     console.error(err);
  //     alert("Xóa role thất bại. Vui lòng thử lại!");
  //   }
  // };

  // 🧱 Giao diện desktop (bảng)
  const renderTable = () => (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 1.5,
        overflow: "hidden",
        boxShadow:
          theme.palette.mode === "light"
            ? "0 4px 12px rgba(0,0,0,0.04)"
            : "0 4px 12px rgba(0,0,0,0.2)",
        bgcolor:
          theme.palette.mode === "light"
            ? theme.palette.background.paper
            : "rgba(255,255,255,0.03)",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {["Tên Role", "Tên hiển thị", "Permission", "Hành động"].map(
              (col) => (
                <TableCell
                  key={col}
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    color: theme.palette.text.secondary,
                  }}
                >
                  {col}
                </TableCell>
              )
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {roles.map((role, i) => {
            const roleQuery = rolePermissionsQueries[i];
            const permissions: PermissionType[] = roleQuery?.data ?? [];
            const isLoading = roleQuery?.isLoading ?? false;

            return (
              <motion.tr
                key={role._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <TableCell sx={{ fontWeight: 500 }}>{role.name}</TableCell>
                <TableCell>{role.displayName}</TableCell>
                <TableCell>
                  {isLoading ? (
                    <CircularProgress size={20} />
                  ) : permissions.length > 0 ? (
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {permissions.map((p, idx) => (
                        <Chip
                          key={`${p._id}-${idx}`}
                          label={p.displayName}
                          size="small"
                          color="primary"
                          variant={
                            theme.palette.mode === "light"
                              ? "outlined"
                              : "filled"
                          }
                          sx={{
                            borderRadius: 8,
                            fontWeight: 500,
                            transition: "0.2s",
                            "&:hover": {
                              transform: "scale(1.05)",
                              boxShadow:
                                theme.palette.mode === "light"
                                  ? "0 2px 6px rgba(0,169,157,0.2)"
                                  : "0 0 8px rgba(0,255,200,0.2)",
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", fontStyle: "italic" }}
                    >
                      Chưa có permission
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      onClick={() => onEdit(role)}
                      variant="outlined"
                      disabled={updating}
                    >
                      Sửa
                    </Button>
                    <Button
                      onClick={() => onDelete(role._id)} // ✅ dùng hàm từ cha
                      color="error"
                      variant="outlined"
                      disabled={deleting}
                    >
                      Xóa
                    </Button>
                  </Stack>
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );

  // 📱 Giao diện mobile (card)
  const renderCards = () => (
    <Stack spacing={2}>
      {roles.map((role, i) => {
        const roleQuery = rolePermissionsQueries[i];
        const permissions: PermissionType[] = roleQuery?.data ?? [];
        const isLoading = roleQuery?.isLoading ?? false;

        return (
          <motion.div
            key={role._id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 1.5,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.04)"
                    : "background.paper",
                "&:hover": {
                  boxShadow:
                    theme.palette.mode === "light"
                      ? "0 4px 12px rgba(0,0,0,0.08)"
                      : "0 0 10px rgba(0,255,255,0.15)",
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  {role.displayName}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  ({role.name})
                </Typography>

                <Divider sx={{ my: 1 }} />

                {isLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {permissions.map((p) => (
                      <Chip
                        key={p._id}
                        label={p.displayName}
                        size="small"
                        color="primary"
                        variant={
                          theme.palette.mode === "light" ? "outlined" : "filled"
                        }
                      />
                    ))}
                  </Stack>
                )}

                <Stack direction="row" spacing={1} mt={2}>
                  <Button
                    onClick={() => onEdit(role)}
                    variant="outlined"
                    size="small"
                  >
                    Sửa
                  </Button>
                  <Button
                    onClick={() => onDelete(role._id)} // ✅ dùng hàm từ cha
                    color="error"
                    variant="outlined"
                    disabled={deleting}
                  >
                    Xóa
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </Stack>
  );

  return <>{isMobile ? renderCards() : renderTable()}</>;
};
