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
// import InfoIcon from "@mui/icons-material/Info";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddIcon from "@mui/icons-material/Add";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import { Category } from "@/types/category";
// import { Role } from "@/types/role";
// import { PermissionType } from "@/types/staff";
// import { useCategoriesByStatus, useDeleteCategory } from "@/hooks/useCategory";
// import AuditTimeline from "./AuditTimeline";
// import CategoryForm from "./CategoryForm";
// import { AuditLog } from "@/types/auditLog";
// import { getAuditLogsByCategory } from "@/services/auditLogService";
// import { hasPermission } from "../hooks/useCategoryPermission";

// interface CategoryTreeProps {
//   role: Role;
//   permissions: PermissionType[];
//   onSelectCategory?: (cat: Category) => void;
//   onSuccess?: () => void;
//   onError?: () => void;
// }

// export default function CategoryTree({
//   role,
//   permissions,
//   onSelectCategory,
//   onSuccess,
//   onError,
// }: CategoryTreeProps) {
//   const [page, setPage] = useState(1);
//   const theme = useTheme();
//   const isLg = useMediaQuery(theme.breakpoints.up("lg"));
//   const itemsPerPage = isLg ? 6 : 4;

//   const { data: approvedCategories = [] } = useCategoriesByStatus(true);

//   const [openForm, setOpenForm] = useState(false);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(
//     null
//   );

//   const [logs, setLogs] = useState<AuditLog[]>([]);
//   const [toast, setToast] = useState<{
//     open: boolean;
//     message: string;
//     type: "success" | "error" | "info";
//   }>({ open: false, message: "", type: "info" });

//   const deleteMutation = useDeleteCategory();

//   const handleDelete = (id: string) => {
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

//   const paginationCategories = approvedCategories.slice(
//     (page - 1) * itemsPerPage,
//     page * itemsPerPage
//   );

//   const handleToast = (
//     message: string,
//     type: "success" | "error" | "info" = "info"
//   ) => setToast({ open: true, message, type });

//   useEffect(() => {
//     if (!selectedCategory?._id) {
//       setLogs([]);
//       return;
//     }

//     getAuditLogsByCategory(selectedCategory._id)
//       .then((res) => setLogs(res))
//       .catch(() => handleToast("Không tải được lịch sử hoạt động", "error"));
//   }, [selectedCategory]);

//   const renderCategoryCard = (cat: Category) => (
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
//           borderLeft: `6px solid ${cat.isActive ? "#4caf50" : "#ff9800"}`,
//         }}
//         onClick={() => onSelectCategory?.(cat)}
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
//           <IconButton
//             onClick={(e) => {
//               e.stopPropagation();
//               setSelectedCategory(cat);
//             }}
//           >
//             <InfoIcon color="info" />
//           </IconButton>

//           {hasPermission(role, permissions, "canEdit") && (
//             <IconButton
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setEditingCategory(cat);
//                 setOpenForm(true);
//               }}
//             >
//               <EditIcon color="primary" />
//             </IconButton>
//           )}

//           {hasPermission(role, permissions, "canDelete") && (
//             <IconButton
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleDelete(cat._id);
//               }}
//             >
//               <DeleteIcon color="error" />
//             </IconButton>
//           )}
//         </CardActions>
//       </Card>
//     </motion.div>
//   );

//   return (
//     <Box mt={4}>
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={2}
//       >
//         <Typography variant="h5" fontWeight="bold">
//           Danh mục thuốc
//         </Typography>

//         {hasPermission(role, permissions, "canCreate") && (
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={() => {
//               setEditingCategory(null);
//               setOpenForm(true);
//             }}
//           >
//             Thêm danh mục
//           </Button>
//         )}
//       </Box>

//       <Typography variant="subtitle1" mb={1} fontWeight="bold" color="green">
//         ✅ Đã duyệt
//       </Typography>
//       <Grid container spacing={2} mb={3}>
//         {paginationCategories.length > 0 ? (
//           paginationCategories.map((cat) => (
//             <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={cat._id}>
//               {renderCategoryCard(cat)}
//             </Grid>
//           ))
//         ) : (
//           <Typography>Không có danh mục nào đã duyệt</Typography>
//         )}
//       </Grid>

//       {approvedCategories.length > itemsPerPage && (
//         <Box mt={3} display="flex" justifyContent="center">
//           <Pagination
//             count={Math.ceil(approvedCategories.length / itemsPerPage)}
//             page={page}
//             onChange={(_, value) => setPage(value)}
//             color="primary"
//           />
//         </Box>
//       )}

//       {/* Form thêm/sửa */}
//       <Dialog
//         open={openForm}
//         onClose={() => {
//           setOpenForm(false);
//           setEditingCategory(null);
//         }}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>
//           {editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
//         </DialogTitle>
//         <DialogContent>
//           <CategoryForm
//             role={role}
//             category={editingCategory}
//             onClose={() => {
//               setOpenForm(false);
//               setEditingCategory(null);
//             }}
//             onSuccess={() => {
//               onSuccess?.();
//               setOpenForm(false);
//               setEditingCategory(null);
//             }}
//             onError={onError}
//           />
//         </DialogContent>
//       </Dialog>

//       {/* Modal chi tiết */}
//       <Dialog
//         open={!!selectedCategory}
//         onClose={() => setSelectedCategory(null)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Chi tiết danh mục</DialogTitle>
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
//           {selectedCategory && (
//             <Box mt={2}>
//               <AuditTimeline logs={logs} />
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setSelectedCategory(null)}>Đóng</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar */}
//       <Snackbar
//         open={toast.open}
//         autoHideDuration={3000}
//         onClose={() => setToast({ ...toast, open: false })}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//       >
//         <Alert severity={toast.type}>{toast.message}</Alert>
//       </Snackbar>
//     </Box>
//   );
// }

import CategoryTableBase from "./CategoryTableBase";
import { Role } from "@/types/role";

interface Props {
  role: Role;
}

export default function CategoryApprovedTable({ role }: Props) {
  return (
    <CategoryTableBase
      isActive={true} // true = danh mục đã duyệt
      title="Danh mục đã duyệt"
      role={role} // prop role ưu tiên
    />
  );
}
