// "use client";

// import { useState, useMemo } from "react";
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
//   Pagination,
//   Snackbar,
//   Alert,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";
// import {
//   Check as CheckIcon,
//   Info as InfoIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Close as CloseIcon,
//   Add as AddIcon,
// } from "@mui/icons-material";
// import { motion } from "framer-motion";

// import { Batch } from "@/types/batch";
// import { useAllBatches } from "@/hooks/database/useBatch";
// import { useEntityPermission } from "@/hooks/database/useEntityPermission";
// import BatchForm from "./BatchForm";
// import { toast } from "sonner";
// import BatchFilter, { BatchFilterValues } from "./BatchFilter";
// import AuditTimeline from "./AuditTimeLine";

// interface BatchTableBaseProps {
//   isActive?: boolean; // true: đã duyệt, false: chờ duyệt
//   title?: string;
// }

// export default function BatchTableBase({
//   isActive = true,
//   title = "Quản lý Lô Sản Phẩm",
// }: BatchTableBaseProps) {
//   const { data: batches = [], isLoading } = useAllBatches();
//   const { canCreate, canEdit, canDelete, canApprove } = useEntityPermission(
//     "batch"
//   );
//   const theme = useTheme();
//   const isLg = useMediaQuery(theme.breakpoints.up("lg"));
//   const itemsPerPage = isLg ? 6 : 4;

//   const [page, setPage] = useState(1);
//   const [filterValues, setFilterValues] = useState<BatchFilterValues>({});
//   const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
//   const [openForm, setOpenForm] = useState(false);
//   const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
//   const [toastState, setToastState] = useState<{
//     open: boolean;
//     message: string;
//     type: "success" | "info" | "error";
//   }>({ open: false, message: "", type: "info" });

//   // --- Filtered & Paginated ---
//   const filteredBatches = useMemo(() => {
//     return batches.filter((b) => {
//       if (isActive && b.state !== "APPROVE" && b.state !== "IN_PRODUCTION") return false;
//       if (!isActive && b.state === "APPROVE") return false;
//       if (filterValues.search && !b.batchCode.includes(filterValues.search) && !b.productCode.includes(filterValues.search)) return false;
//       if (filterValues.productCode && b.productCode !== filterValues.productCode) return false;
//       if (filterValues.state && b.state !== filterValues.state) return false;
//       if (filterValues.estimatedDate && b.estimatedDate !== filterValues.estimatedDate) return false;
//       return true;
//     });
//   }, [batches, filterValues, isActive]);

//   const paginationBatches = useMemo(() => {
//     const start = (page - 1) * itemsPerPage;
//     return filteredBatches.slice(start, start + itemsPerPage);
//   }, [filteredBatches, page, itemsPerPage]);

//   const handleApprove = (batch: Batch) => {
//     if (!canApprove) return;
//     toast.success(`Đã duyệt lô ${batch.batchCode}!`);
//   };

//   const handleDelete = (batch: Batch) => {
//     if (!canDelete) return;
//     toast.error(`Đã xóa lô ${batch.batchCode}`);
//   };

//   const renderBatchCard = (batch: Batch) => (
//     <motion.div
//       key={batch.batchCode}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{ duration: 0.3 }}
//     >
//       <Card
//         sx={{
//           borderRadius: 2,
//           boxShadow: 3,
//           "&:hover": { boxShadow: 6, transform: "translateY(-3px)" },
//           cursor: "pointer",
//           borderLeft: `6px solid ${batch.state === "DRAFT" ? "#ff9800" : "#4caf50"}`,
//         }}
//       >
//         <CardContent onClick={() => setSelectedBatch(batch)}>
//           <Typography variant="subtitle1" fontWeight="bold">
//             {batch.batchCode}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             {batch.productCode} | {batch.state} | {batch.estimatedDate}
//           </Typography>
//         </CardContent>
//         <CardActions sx={{ justifyContent: "flex-end" }}>
//           <IconButton onClick={() => setSelectedBatch(batch)}>
//             <InfoIcon color="info" />
//           </IconButton>
//           {isActive ? (
//             <>
//               {canEdit && (
//                 <IconButton
//                   onClick={() => {
//                     setEditingBatch(batch);
//                     setOpenForm(true);
//                   }}
//                 >
//                   <EditIcon color="primary" />
//                 </IconButton>
//               )}
//               {canDelete && (
//                 <IconButton onClick={() => handleDelete(batch)}>
//                   <DeleteIcon color="error" />
//                 </IconButton>
//               )}
//             </>
//           ) : (
//             <>
//               {canApprove && (
//                 <IconButton onClick={() => handleApprove(batch)}>
//                   <CheckIcon color="success" />
//                 </IconButton>
//               )}
//               {canDelete && (
//                 <IconButton onClick={() => handleDelete(batch)}>
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
//     <Box mt={4} mx={3}>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <Typography variant="h5" fontWeight="bold">{title}</Typography>
//         {isActive && canCreate && (
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={() => { setEditingBatch(null); setOpenForm(true); }}
//           >
//             Thêm lô
//           </Button>
//         )}
//       </Box>

//       <BatchFilter onFilterChange={setFilterValues} />

//       <Grid container spacing={2}>
//         {paginationBatches.length > 0
//           ? paginationBatches.map(renderBatchCard)
//           : <Typography>Không có lô nào</Typography>}
//       </Grid>

//       {filteredBatches.length > itemsPerPage && (
//         <Box mt={3} display="flex" justifyContent="center">
//           <Pagination
//             count={Math.ceil(filteredBatches.length / itemsPerPage)}
//             page={page}
//             onChange={(_, value) => setPage(value)}
//             color="primary"
//           />
//         </Box>
//       )}

//       {/* Form Modal */}
//       <Dialog
//         open={openForm}
//         onClose={() => setOpenForm(false)}
//         fullWidth
//         maxWidth="sm"
//       >
//         <DialogTitle>{editingBatch ? "Sửa lô" : "Thêm lô"}</DialogTitle>
//         <DialogContent>
//           <BatchForm
//             editData={editingBatch}
//             onSuccess={() => { setOpenForm(false); setEditingBatch(null); }}
//           />
//         </DialogContent>
//       </Dialog>

//       {/* Detail + Audit Modal */}
//       <Dialog
//         open={!!selectedBatch}
//         onClose={() => setSelectedBatch(null)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Chi tiết lô {selectedBatch?.batchCode}</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             <strong>Sản phẩm:</strong> {selectedBatch?.productCode} <br />
//             <strong>Trạng thái:</strong> {selectedBatch?.state} <br />
//             <strong>Ngày dự kiến:</strong> {selectedBatch?.estimatedDate} <br />
//             <strong>Tx Hash:</strong> {selectedBatch?.txHash || "Chưa có"}
//           </DialogContentText>
//           {selectedBatch && <AuditTimeline batch={selectedBatch} />}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setSelectedBatch(null)}>Đóng</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar */}
//       <Snackbar
//         open={toastState.open}
//         autoHideDuration={3000}
//         onClose={() => setToastState({ ...toastState, open: false })}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//       >
//         <Alert severity={toastState.type}>{toastState.message}</Alert>
//       </Snackbar>
//     </Box>
//   );
// }
