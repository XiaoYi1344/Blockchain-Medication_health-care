// "use client";
// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Chip,
//   Stack,
//   Typography,
//   CircularProgress,
// } from "@mui/material";
// import { usePermissionsByType, useUpdateRole } from "@/hooks/useStaff";
// import { Role } from "@/types/staff";
// import { getCookie } from "cookies-next";

// interface RoleEditFormProps {
//   open: boolean;
//   onClose: () => void;
//   role: Role | null;
// }

// const RoleEditForm: React.FC<RoleEditFormProps> = ({ open, onClose, role }) => {
//   const [name, setName] = useState("");
//   const [displayName, setDisplayName] = useState("");
//   const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
//   const [error, setError] = useState("");
//   const { data: allPermissions, isLoading } = usePermissionsByType();
//   const updateRole = useUpdateRole();

//   // Khi mở form sửa, load data vào
//   useEffect(() => {
//     if (role) {
//       setName(role.name);
//       setDisplayName(role.displayName);
//       setSelectedPermissions(role.permissions?.map((p) => p._id) || []);
//     }
//   }, [role]);

//   const handleChipToggle = (id: string) => {
//     setSelectedPermissions((prev) => {
//       if (prev.includes(id)) {
//         setError("");
//         return prev.filter((p) => p !== id);
//       }

//       if (prev.length >= 10) {
//         setError("Chỉ được chọn tối đa 10 permission");
//         return prev;
//       }

//       setError("");
//       return [...prev, id];
//     });
//   };

// //   const handleSubmit = async () => {
// //     if (!role) return;

// //     try {
// //       await updateRole.mutateAsync({
// //         roleId: role._id,
// //         name,
// //         displayName,
// //         permissionIds: selectedPermissions,
// //       });
// //       onClose();
// //     } catch (err) {
// //       console.error("Lỗi cập nhật role:", err);
// //     }
// //   };

// const handleSubmit = async () => {
//   if (!role) return;

//   const userId = getCookie("userId"); // ✅ lấy userId từ cookie (backend set khi login)

//   try {
//     await updateRole.mutateAsync({
//       roleId: role._id,
//       name,
//       displayName,
//       permissionIds: selectedPermissions,
//       userId: userId as string, // 👈 thêm userId
//     });
//     onClose();
//   } catch (err) {
//     console.error("Lỗi cập nhật role:", err);
//   }
// };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
//       <DialogTitle>Cập nhật Role</DialogTitle>
//       <DialogContent dividers>
//         <Stack spacing={2}>
//           <TextField
//             label="Tên Role"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             fullWidth
//           />
//           <TextField
//             label="Display Name"
//             value={displayName}
//             onChange={(e) => setDisplayName(e.target.value)}
//             fullWidth
//           />

//           <Typography fontWeight={600}>Chọn Permissions</Typography>
//           {isLoading ? (
//             <CircularProgress size={24} />
//           ) : (
//             <Stack direction="row" flexWrap="wrap" gap={1}>
//               {allPermissions?.map((p) => (
//                 <Chip
//                   key={p._id}
//                   label={p.displayName}
//                   onClick={() => handleChipToggle(p._id)}
//                   color={selectedPermissions.includes(p._id) ? "primary" : "default"}
//                   variant={
//                     selectedPermissions.includes(p._id) ? "filled" : "outlined"
//                   }
//                   sx={{ borderRadius: 2 }}
//                 />
//               ))}
//             </Stack>
//           )}

//           {error && (
//             <Typography color="error" variant="body2">
//               {error}
//             </Typography>
//           )}
//         </Stack>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="inherit">
//           Hủy
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           variant="contained"
//           disabled={updateRole.isPending}
//         >
//           {updateRole.isPending ? "Đang lưu..." : "Lưu"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default RoleEditForm;
