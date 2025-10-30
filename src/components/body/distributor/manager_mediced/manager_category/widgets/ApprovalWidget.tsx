// "use client";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   CardActions,
//   IconButton,
//   Grid,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   Button,
//   Snackbar,
//   Alert,
//   useTheme,
//   useMediaQuery,
//   Pagination,
// } from "@mui/material";
// import CheckIcon from "@mui/icons-material/Check";
// import InfoIcon from "@mui/icons-material/Info";
// import CloseIcon from "@mui/icons-material/Close";
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { PermissionType } from "@/types/staff";
// import { staffService } from "@/services/staffService";
// import {
//   useCategoriesByStatus,
//   useApproveCategory,
//   useDeleteCategory,
// } from "@/hooks/useCategory";
// import { Category } from "@/types/category";
// import { Role } from "@/types/role";
// // import { hasPermission } from "../hooks/useCategoryPermission";

// type ApprovalWidgetProps = {
//   role: Role;
//   onSuccess?: () => void;
//   onError?: () => void;
// };

// export default function ApprovalWidget({
//   role,
//   onSuccess,
//   onError,
// }: ApprovalWidgetProps) {
//   const [page, setPage] = useState(1);
//   const theme = useTheme();
//   const isLg = useMediaQuery(theme.breakpoints.up("lg"));
//   const itemsPerPage = isLg ? 6 : 4;

//   const [permissions, setPermissions] = useState<PermissionType[]>([]);
//   const { data: pendingCategories = [] } = useCategoriesByStatus(false);
//   const approveMutation = useApproveCategory();
//   const deleteMutation = useDeleteCategory();

//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(
//     null
//   );

//   // Toast state
//   const [toast, setToast] = useState<{
//     open: boolean;
//     message: string;
//     type: "info" | "success" | "error";
//   }>({ open: false, message: "", type: "info" });

//   useEffect(() => {
//     (async () => {
//       const perms = await staffService.getPermissionsByType();
//       setPermissions(perms);
//     })();
//   }, []);

//   // check quyền duyệt bằng hasPermission
//   const canApprove = hasPermission(role, permissions, "canApprove");
//   const canDelete = hasPermission(role, permissions, "canDelete");

//   const handleApprove = (categoryId: string) => {
//     if (!canApprove) return;
//     approveMutation.mutate(
//       { categoryId, isActive: true },
//       {
//         onSuccess: () => onSuccess?.(),
//         onError: () => onError?.(),
//       }
//     );
//   };

//   const handleDelete = (id: string) => {
//     if (!canDelete) return;

//     setToast({ open: true, message: "Đang xóa danh mục...", type: "info" });

//     deleteMutation.mutate(id, {
//       onSuccess: () => {
//         setToast({ open: true, message: "Xóa thành công", type: "success" });
//         onSuccess?.();
//       },
//       onError: (err) => {
//         console.error("Delete category error:", err);
//         setToast({ open: true, message: "Xóa thất bại", type: "error" });
//         onError?.();
//       },
//     });
//   };

//   const paginationCategories = pendingCategories.slice(
//     (page - 1) * itemsPerPage,
//     page * itemsPerPage
//   );

//   const renderCategoryCard = (cat: Category, approved: boolean) => (
//     <motion.div
//       key={cat._id}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{ duration: 0.3 }}
//     >
//       <Card
//         sx={{
//           borderRadius: 3,
//           boxShadow: 3,
//           "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
//           cursor: "pointer",
//           borderLeft: `6px solid ${approved ? "#4caf50" : "#ff9800"}`,
//         }}
//         onClick={() => setSelectedCategory(cat)}
//       >
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             {cat.name}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             {cat.description || "Không có mô tả"}
//           </Typography>
//         </CardContent>
//         <CardActions sx={{ justifyContent: "flex-end" }}>
//           {!approved && (
//             <>
//               <InfoIcon color="info" />
//               {canApprove && (
//                 <IconButton
//                   color="success"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleApprove(cat._id);
//                   }}
//                 >
//                   <CheckIcon />
//                 </IconButton>
//               )}
//               {canDelete && (
//                 <IconButton
//                   color="error"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDelete(cat._id);
//                   }}
//                 >
//                   <CloseIcon />
//                 </IconButton>
//               )}
//             </>
//           )}
//         </CardActions>
//       </Card>
//     </motion.div>
//   );

//   return (
//     <Box mt={4}>
//       <Typography variant="h5" mb={2} fontWeight="bold">
//         Quản lý danh mục thuốc
//       </Typography>

//       {/* Chưa duyệt */}
//       <Typography variant="h6" mb={2} color="warning.main">
//         Category chưa duyệt
//       </Typography>
//       <Grid container spacing={2}>
//         {paginationCategories.length > 0 ? (
//           paginationCategories.map((cat) => (
//             <Grid size={{ xs: 12, sm: 6, lg: 4 }}key={cat._id}>
//               {renderCategoryCard(cat, false)}
//             </Grid>
//           ))
//         ) : (
//           <Typography>Không có</Typography>
//         )}
//       </Grid>

//       {pendingCategories.length > itemsPerPage && (
//         <Box mt={3} display="flex" justifyContent="center">
//           <Pagination
//             count={Math.ceil(pendingCategories.length / itemsPerPage)}
//             page={page}
//             onChange={(_, value) => setPage(value)}
//             color="primary"
//           />
//         </Box>
//       )}

//       {/* Modal chi tiết */}
//       <Dialog
//         open={!!selectedCategory}
//         onClose={() => setSelectedCategory(null)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Chi tiết Category</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             <strong>Tên:</strong> {selectedCategory?.name}
//             <br />
//             <strong>Mô tả:</strong>{" "}
//             {selectedCategory?.description || "Không có mô tả"}
//             <br />
//             <strong>Trạng thái:</strong>{" "}
//             {selectedCategory?.isActive ? "Đã duyệt" : "Chưa duyệt"}
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setSelectedCategory(null)}>Đóng</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Toast */}
//       <Snackbar
//         open={toast.open}
//         autoHideDuration={3000}
//         onClose={() => setToast({ ...toast, open: false })}
//       >
//         <Alert
//           severity={toast.type}
//           onClose={() => setToast({ ...toast, open: false })}
//           sx={{ width: "100%" }}
//         >
//           {toast.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }


import CategoryTableBase from "./CategoryTableBase";
import { Role } from "@/types/role";

interface Props {
  role: Role;
}

export default function CategoryPendingTable({ role }: Props) {
  return (
    <CategoryTableBase
      isActive={false} // false = danh mục chờ duyệt
      title="Danh mục chờ duyệt"
      role={role}
    />
  );
}
