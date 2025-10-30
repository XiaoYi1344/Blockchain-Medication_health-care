// "use client";

// import { useState } from "react";
// import {
//   Box,
//   TextField,
//   MenuItem,
//   IconButton,
//   Button,
//   Stack,
//   Paper,
//   InputAdornment,
// } from "@mui/material";
// import { Search, FilterX, Calendar } from "lucide-react";
// import { motion } from "framer-motion";
// import dayjs from "dayjs";
// import { BatchState } from "@/types/batch";

// export interface BatchFilterValues {
//   productCode?: string;
//   state?: BatchState | "";
//   estimatedDate?: string;
//   search?: string;
// }

// interface BatchFilterProps {
//   onFilterChange: (filters: BatchFilterValues) => void;
//   loading?: boolean;
// }

// export default function BatchFilter({ onFilterChange, loading }: BatchFilterProps) {
//   const [filters, setFilters] = useState<BatchFilterValues>({
//     productCode: "",
//     state: "",
//     estimatedDate: "",
//     search: "",
//   });

//   const handleChange = (key: keyof BatchFilterValues, value: string) => {
//     const newFilters = { ...filters, [key]: value };
//     setFilters(newFilters);
//     onFilterChange(newFilters);
//   };

//   const handleReset = () => {
//     const resetValues = {
//       productCode: "",
//       state: "",
//       estimatedDate: "",
//       search: "",
//     };
//     setFilters(resetValues);
//     onFilterChange(resetValues);
//   };

//   return (
//     <Paper
//       component={motion.div}
//       elevation={0}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       sx={{
//         p: 2,
//         mb: 2,
//         borderRadius: 3,
//         border: "1px solid #e0f2f1",
//         background: "linear-gradient(to right, #f6fffc, #ffffff)",
//       }}
//     >
//       <Stack
//         direction={{ xs: "column", sm: "row" }}
//         spacing={2}
//         alignItems={{ xs: "stretch", sm: "center" }}
//       >
//         {/* 🔍 Tìm kiếm */}
//         <TextField
//           size="small"
//           fullWidth
//           placeholder="Tìm theo mã lô hoặc sản phẩm..."
//           value={filters.search}
//           onChange={(e) => handleChange("search", e.target.value)}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Search size={18} color="#009688" />
//               </InputAdornment>
//             ),
//           }}
//         />

//         {/* Mã sản phẩm */}
//         <TextField
//           label="Mã sản phẩm"
//           size="small"
//           value={filters.productCode}
//           onChange={(e) => handleChange("productCode", e.target.value)}
//         />

//         {/* Trạng thái */}
//         <TextField
//           select
//           label="Trạng thái"
//           size="small"
//           value={filters.state}
//           onChange={(e) => handleChange("state", e.target.value as BatchState)}
//           sx={{ minWidth: 160 }}
//         >
//           <MenuItem value="">Tất cả</MenuItem>
//           <MenuItem value="DRAFT">Nháp</MenuItem>
//           <MenuItem value="APPROVE">Đã duyệt</MenuItem>
//           <MenuItem value="IN_PRODUCTION">Đang sản xuất</MenuItem>
//           <MenuItem value="IN_STOCK">Đã nhập kho</MenuItem>
//           <MenuItem value="SOLD_OUT">Đã bán hết</MenuItem>
//           <MenuItem value="RECALL">Đã thu hồi</MenuItem>
//         </TextField>

//         {/* Ngày dự kiến */}
//         <TextField
//           label="Ngày dự kiến"
//           type="date"
//           size="small"
//           InputLabelProps={{ shrink: true }}
//           value={filters.estimatedDate}
//           onChange={(e) => handleChange("estimatedDate", e.target.value)}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Calendar size={16} color="#009688" />
//               </InputAdornment>
//             ),
//           }}
//         />

//         {/* Nút reset */}
//         <IconButton
//           onClick={handleReset}
//           title="Xóa bộ lọc"
//           color="primary"
//           sx={{
//             bgcolor: "#e0f2f1",
//             "&:hover": { bgcolor: "#b2dfdb" },
//             transition: "0.3s",
//           }}
//         >
//           <FilterX size={18} />
//         </IconButton>

//         {/* Nút tạo mới (nếu cần hiển thị bên filter) */}
//         {!loading && (
//           <Button
//             variant="contained"
//             color="primary"
//             sx={{
//               textTransform: "none",
//               borderRadius: 3,
//               px: 2.5,
//               bgcolor: "#009688",
//               "&:hover": { bgcolor: "#00796b" },
//             }}
//             onClick={() => onFilterChange({ ...filters, create: "true" } as any)}
//           >
//             + Tạo lô mới
//           </Button>
//         )}
//       </Stack>
//     </Paper>
//   );
// }
