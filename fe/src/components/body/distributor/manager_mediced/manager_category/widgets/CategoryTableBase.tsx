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
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddIcon from "@mui/icons-material/Add";
// import CloseIcon from "@mui/icons-material/Close";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import { Category } from "@/types/category";
// import { AuditLog } from "@/types/auditLog";
// import {
//   useCategoriesByStatus,
//   useApproveCategory,
//   useDeleteCategory,
// } from "@/hooks/useCategory";
// import CategoryForm from "./CategoryForm";
// import AuditTimeline from "./AuditTimeline";
// import { getAuditLogsByCategory } from "@/services/auditLogService";
// import { useEntityPermission } from "@/hooks/useEntityPermission";
// import { Role } from "@/types/role";

// interface CategoryTableBaseProps {
//   isActive: boolean; // true: đã duyệt, false: chờ duyệt
//   title?: string;
//   role?: Role; // ← thêm prop role
//   onSuccess?: () => void;
//   onError?: () => void;
// }

// export default function CategoryTableBase({
//   isActive,
//   title = "Quản lý danh mục thuốc",
//   role: propRole,
//   onSuccess,
//   onError,
// }: CategoryTableBaseProps) {
//   const theme = useTheme();
//   const isLg = useMediaQuery(theme.breakpoints.up("lg"));
//   const itemsPerPage = isLg ? 6 : 4;

//   const [page, setPage] = useState(1);
//   const [openForm, setOpenForm] = useState(false);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const [logs, setLogs] = useState<AuditLog[]>([]);
//   const [toast, setToast] = useState<{
//     open: boolean;
//     message: string;
//     type: "info" | "success" | "error";
//   }>({ open: false, message: "", type: "info" });

//   // --- Lấy quyền từ hook ---
//   const { canCreate, canEdit, canDelete, canApprove, role: roleFromHook } =
//     useEntityPermission("category");

//   // Nếu có prop role truyền vào, ưu tiên dùng prop
//   const currentRole = propRole || roleFromHook;

//   const { data: categories = [] } = useCategoriesByStatus(isActive);
//   const approveMutation = useApproveCategory();
//   const deleteMutation = useDeleteCategory();

//   useEffect(() => {
//     if (!selectedCategory?._id) return;
//     getAuditLogsByCategory(selectedCategory._id)
//       .then((res) => setLogs(res))
//       .catch(() =>
//         setToast({ open: true, message: "Không tải được lịch sử", type: "error" })
//       );
//   }, [selectedCategory]);

//   const paginationCategories = categories.slice(
//     (page - 1) * itemsPerPage,
//     page * itemsPerPage
//   );

//   const handleApprove = (categoryId: string) => {
//     if (!canApprove) return;
//     approveMutation.mutate(
//       { categoryId, isActive: true },
//       {
//         onSuccess: () => {
//           setToast({ open: true, message: "Duyệt thành công", type: "success" });
//           onSuccess?.();
//         },
//         onError: () => {
//           setToast({ open: true, message: "Duyệt thất bại", type: "error" });
//           onError?.();
//         },
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
//       onError: () => {
//         setToast({ open: true, message: "Xóa thất bại", type: "error" });
//         onError?.();
//       },
//     });
//   };

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
//           <IconButton
//             onClick={(e) => {
//               e.stopPropagation();
//               setSelectedCategory(cat);
//             }}
//           >
//             <InfoIcon color="info" />
//           </IconButton>

//           {isActive ? (
//             <>
//               {canEdit && (
//                 <IconButton
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setEditingCategory(cat);
//                     setOpenForm(true);
//                   }}
//                 >
//                   <EditIcon color="primary" />
//                 </IconButton>
//               )}
//               {canDelete && (
//                 <IconButton
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDelete(cat._id);
//                   }}
//                 >
//                   <DeleteIcon color="error" />
//                 </IconButton>
//               )}
//             </>
//           ) : (
//             <>
//               {canApprove && (
//                 <IconButton
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleApprove(cat._id);
//                   }}
//                 >
//                   <CheckIcon color="success" />
//                 </IconButton>
//               )}
//               {canDelete && (
//                 <IconButton
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDelete(cat._id);
//                   }}
//                 >
//                   <CloseIcon color="error" />
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
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <Typography variant="h5" fontWeight="bold">
//           {title}
//         </Typography>
//         {isActive && canCreate && currentRole && (
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

//       <Typography
//         variant="subtitle1"
//         mb={1}
//         fontWeight="bold"
//         color={isActive ? "green" : "warning.main"}
//       >
//         {isActive ? "✅ Đã duyệt" : "🕓 Chờ duyệt"}
//       </Typography>

//       <Grid container spacing={2}>
//         {paginationCategories.length > 0 ? (
//           paginationCategories.map((cat) => (
//             <Grid key={cat._id} size={{ xs: 12, sm: 6, lg: 4 }}>
//               {renderCategoryCard(cat)}
//             </Grid>
//           ))
//         ) : (
//           <Typography>Không có danh mục nào</Typography>
//         )}
//       </Grid>

//       {categories.length > itemsPerPage && (
//         <Box mt={3} display="flex" justifyContent="center">
//           <Pagination
//             count={Math.ceil(categories.length / itemsPerPage)}
//             page={page}
//             onChange={(_, value) => setPage(value)}
//             color="primary"
//           />
//         </Box>
//       )}

//       {/* Form thêm/sửa */}
//       <Dialog
//         open={openForm && !!currentRole}
//         onClose={() => {
//           setOpenForm(false);
//           setEditingCategory(null);
//         }}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>{editingCategory ? "Sửa danh mục" : "Thêm danh mục"}</DialogTitle>
//         <DialogContent>
//           {currentRole && (
//             <CategoryForm
//               role={currentRole}
//               category={editingCategory}
//               onClose={() => {
//                 setOpenForm(false);
//                 setEditingCategory(null);
//               }}
//               onSuccess={() => {
//                 onSuccess?.();
//                 setOpenForm(false);
//                 setEditingCategory(null);
//               }}
//               onError={onError}
//             />
//           )}
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
//             <strong>Mô tả:</strong> {selectedCategory?.description || "Không có mô tả"}
//             <br />
//             <strong>Trạng thái:</strong> {selectedCategory?.isActive ? "Đã duyệt" : "Chưa duyệt"}
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

"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Pagination,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Category } from "@/types/category";
import { AuditLog } from "@/types/auditLog";
import {
  useCategoriesByStatus,
  useApproveCategory,
  useDeleteCategory,
} from "@/hooks/database/useCategory";
import CategoryForm from "./CategoryForm";
import AuditTimeline from "./AuditTimeline";
import { getAuditLogsByCategory } from "@/services/auditLogService";
import { useEntityPermission } from "@/hooks/database/useEntityPermission";
import { Role } from "@/types/role";

interface CategoryTableBaseProps {
  isActive: boolean; // true: đã duyệt, false: chờ duyệt
  title?: string;
  role?: Role; // ← thêm prop role
  onSuccess?: () => void;
  onError?: () => void;
}

export default function CategoryTableBase({
  isActive,
  title = "Quản lý danh mục thuốc",
  role: propRole,
  onSuccess,
  onError,
}: CategoryTableBaseProps) {
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));
  const itemsPerPage = isLg ? 6 : 4;

  const [page, setPage] = useState(1);
  const [openForm, setOpenForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    type: "info" | "success" | "error";
  }>({ open: false, message: "", type: "info" });

  // --- Lấy quyền từ hook ---
  const {
    canCreate,
    canEdit,
    canDelete,
    canApprove,
    role: roleFromHook,
  } = useEntityPermission("category");

  // Nếu có prop role truyền vào, ưu tiên dùng prop
  const currentRole = propRole || roleFromHook;

  const { data: categories = [] } = useCategoriesByStatus(isActive);
  const approveMutation = useApproveCategory();
  const deleteMutation = useDeleteCategory();

  useEffect(() => {
    if (!selectedCategory?._id) return;
    getAuditLogsByCategory(selectedCategory._id)
      .then((res) => setLogs(res))
      .catch(() =>
        setToast({
          open: true,
          message: "Không tải được lịch sử",
          type: "error",
        })
      );
  }, [selectedCategory]);

  const paginationCategories = categories.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleApprove = (categoryId: string) => {
    if (!canApprove) return;
    approveMutation.mutate(
      { categoryId, isActive: true },
      {
        onSuccess: () => {
          setToast({
            open: true,
            message: "Duyệt thành công",
            type: "success",
          });
          onSuccess?.();
        },
        onError: () => {
          setToast({ open: true, message: "Duyệt thất bại", type: "error" });
          onError?.();
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (!canDelete) return;
    setToast({ open: true, message: "Đang xóa danh mục...", type: "info" });
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setToast({ open: true, message: "Xóa thành công", type: "success" });
        onSuccess?.();
      },
      onError: () => {
        setToast({ open: true, message: "Xóa thất bại", type: "error" });
        onError?.();
      },
    });
  };

  const renderCategoryCard = (cat: Category) => (
    <motion.div
      key={cat._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          borderRadius: 1.75,
          boxShadow: 3,
          "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
          cursor: "pointer",
          borderLeft: `6px solid ${cat.isActive ? "#4caf50" : "#ff9800"}`,
        }}
        onClick={() => setSelectedCategory(cat)}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {cat.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {cat.description || "Không có mô tả"}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCategory(cat);
            }}
          >
            <InfoIcon color="info" />
          </IconButton>

          {isActive ? (
            <>
              {canEdit && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCategory(cat);
                    setOpenForm(true);
                  }}
                >
                  <EditIcon color="primary" />
                </IconButton>
              )}
              {canDelete && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(cat._id);
                  }}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              )}
            </>
          ) : (
            <>
              {canApprove && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(cat._id);
                  }}
                >
                  <CheckIcon color="success" />
                </IconButton>
              )}
              {canDelete && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(cat._id);
                  }}
                >
                  <CloseIcon color="error" />
                </IconButton>
              )}
            </>
          )}
        </CardActions>
      </Card>
    </motion.div>
  );

  return (
    <Box mt={4} mx={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold">
          {title}
        </Typography>
        {isActive && canCreate && currentRole && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingCategory(null);
              setOpenForm(true);
            }}
          >
            Thêm danh mục
          </Button>
        )}
      </Box>

      <Typography
        variant="subtitle1"
        mb={1}
        fontWeight="bold"
        color={isActive ? "green" : "warning.main"}
      >
        {isActive ? "✅ Đã duyệt" : "🕓 Chờ duyệt"}
      </Typography>

      <Grid container spacing={2}>
        {paginationCategories.length > 0 ? (
          paginationCategories.map((cat) => (
            <Grid key={cat._id} size={{ xs: 12, sm: 6, lg: 4 }}>
              {renderCategoryCard(cat)}
            </Grid>
          ))
        ) : (
          <Typography>Không có danh mục nào</Typography>
        )}
      </Grid>

      {categories.length > itemsPerPage && (
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(categories.length / itemsPerPage)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Form thêm/sửa */}
      <Dialog
        open={openForm && !!currentRole}
        onClose={() => {
          setOpenForm(false);
          setEditingCategory(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
        </DialogTitle>
        <DialogContent>
          {currentRole && (
            <CategoryForm
              role={currentRole}
              canCreate={canCreate} // ← thêm
              canEdit={canEdit} // ← thêm
              category={editingCategory}
              onClose={() => {
                setOpenForm(false);
                setEditingCategory(null);
              }}
              onSuccess={() => {
                onSuccess?.();
                setOpenForm(false);
                setEditingCategory(null);
              }}
              onError={onError}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal chi tiết */}
      <Dialog
        open={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chi tiết danh mục</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Tên:</strong> {selectedCategory?.name}
            <br />
            <strong>Mô tả:</strong>{" "}
            {selectedCategory?.description || "Không có mô tả"}
            <br />
            <strong>Trạng thái:</strong>{" "}
            {selectedCategory?.isActive ? "Đã duyệt" : "Chưa duyệt"}
          </DialogContentText>
          {selectedCategory && (
            <Box mt={2}>
              <AuditTimeline logs={logs} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedCategory(null)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={toast.type}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}
