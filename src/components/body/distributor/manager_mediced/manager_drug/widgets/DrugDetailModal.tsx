// // "use client";

// // import React from "react";
// // import {
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Button,
// //   Grid,
// //   Typography,
// //   Box,
// //   Paper,
// //   Table,
// //   TableHead,
// //   TableRow,
// //   TableCell,
// //   TableBody,
// //   Avatar,
// //   Stack,
// // } from "@mui/material";
// // import type { BackendProduct } from "@/types/drug";

// // type DisplayProduct = Partial<BackendProduct> & {
// //   type?: "domestic" | "abroad";
// //   route?:
// //     | "oral"
// //     | "injection"
// //     | "IV infusion"
// //     | "inhalation"
// //     | "rectal insertion";
// //   createdAt?: string;
// //   updatedAt?: string;
// // };

// // interface DrugDetailModalProps {
// //   open: boolean;
// //   onClose: () => void;
// //   product: DisplayProduct | null;
// //   isDraft?: boolean;
// //   onEdit?: () => void;
// // }

// // export default function DrugDetailModal({
// //   open,
// //   onClose,
// //   product,
// //   isDraft = false,
// //   onEdit,
// // }: DrugDetailModalProps) {
// //   if (!product) return null;

// //   const p = product;
// //   const API_BASE =
// //     process.env.NEXT_PUBLIC_BE_API_BASE ||
// //     "https://aurelio-untoned-yadiel.ngrok-free.dev";

// //   // ======= Data to send to blockchain =======
// //   const blockchainData = [
// //     { key: "Product Code", value: p.productCode || "-" },
// //     { key: "Company Code", value: p.companyCode || "-" },
// //     { key: "GTIN", value: p.gtin || "-" },
// //     { key: "On Chain", value: p.onChain ? "Yes" : "No" },
// //     { key: "TX Hash", value: p.txHash || "-" },
// //     { key: "Status", value: p.isActive || "-" },
// //   ];

// //   return (
// //     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
// //       <DialogTitle>
// //         {isDraft ? "Chi tiết - Bản nháp" : "Chi tiết sản phẩm"}
// //       </DialogTitle>

// //       <DialogContent dividers>
// //         {/* I. Thông tin sản phẩm */}
// //         <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
// //           <Typography variant="h6" gutterBottom>
// //             🧾 Thông tin sản phẩm
// //           </Typography>

// //           <Grid container spacing={2}>
// //             {/* Cột trái */}
// //             <Grid size={{ xs: 12, sm: 6 }}>
// //               <Info label="Tên" value={p.name} />
// //               <Info label="Product Code" value={p.productCode} />
// //               <Info label="Trạng thái" value={p.isActive} />
// //               <Info label="On Chain" value={p.onChain ? "Yes" : "No"} />
// //               <Info
// //                 label="UOM / Số lượng"
// //                 value={`${p.uom || "-"} / ${p.uomQuantity || "-"}`}
// //               />
// //               <Info label="GTIN" value={p.gtin} />
// //               <Info label="Mã công ty" value={p.companyCode} />
// //               <Info
// //                 label="Category IDs"
// //                 value={p.categoryIds?.join(", ") || "-"}
// //               />
// //             </Grid>

// //             {/* Cột phải */}
// //             <Grid size={{ xs: 12, sm: 6 }}>
// //               <Info label="Mô tả" value={p.description} />
// //               <Info label="Route" value={p.route} />
// //               <Info label="Type" value={p.type} />

// //               <Box mt={1}>
// //                 <Typography variant="subtitle2">Active Ingredients</Typography>
// //                 {p.activeIngredient?.length ? (
// //                   p.activeIngredient.map((ai, idx) => (
// //                     <Typography key={idx}>
// //                       {ai.name} - {ai.strength}
// //                     </Typography>
// //                   ))
// //                 ) : (
// //                   <Typography color="text.secondary">-</Typography>
// //                 )}
// //               </Box>

// //               <Box mt={1}>
// //                 <Typography variant="subtitle2">Storage Conditions</Typography>
// //                 {p.storageConditions?.length ? (
// //                   p.storageConditions.map((sc, idx) => (
// //                     <Typography key={idx}>
// //                       Temp: {sc.temperature}, Humidity: {sc.humidity}
// //                     </Typography>
// //                   ))
// //                 ) : (
// //                   <Typography color="text.secondary">-</Typography>
// //                 )}
// //               </Box>

// //               <Box mt={2}>
// //                 <Typography variant="subtitle2">Ảnh sản phẩm</Typography>

// //                 {/* Ảnh đại diện */}
// //                 {p.imagePrimary ? (
// //                   <Box mt={1} textAlign="center">
// //                     <Avatar
// //                       src={`${API_BASE}/api/upload/${p.imagePrimary}`}
// //                       alt="Ảnh đại diện"
// //                       variant="rounded"
// //                       sx={{ width: 160, height: 120 }}
// //                     />
// //                   </Box>
// //                 ) : (
// //                   <Typography color="text.secondary" mt={1}>
// //                     Không có ảnh đại diện
// //                   </Typography>
// //                 )}

// //                 {/* Ảnh phụ */}
// //                 {p.images && p.images.length > 0 && (
// //                   <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
// //                     {p.images.map((imgId, idx) => (
// //                       <Box key={idx} textAlign="center">
// //                         <Avatar
// //                           src={`${API_BASE}/api/upload/${imgId}`}
// //                           alt={`Ảnh phụ ${idx + 1}`}
// //                           variant="rounded"
// //                           sx={{ width: 80, height: 80 }}
// //                         />
// //                       </Box>
// //                     ))}
// //                   </Stack>
// //                 )}
// //               </Box>
// //             </Grid>
// //           </Grid>
// //         </Paper>

// //         {/* II. Bảng dữ liệu blockchain */}
// //         <Paper variant="outlined" sx={{ p: 2 }}>
// //           <Typography variant="h6" gutterBottom>
// //             ⛓️ Dữ liệu ghi lên Blockchain
// //           </Typography>

// //           <Table size="small">
// //             <TableHead>
// //               <TableRow>
// //                 <TableCell width="40%">Thuộc tính</TableCell>
// //                 <TableCell>Giá trị</TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {blockchainData.map((item, idx) => (
// //                 <TableRow key={idx}>
// //                   <TableCell>{item.key}</TableCell>
// //                   <TableCell>
// //                     <Typography
// //                       color={
// //                         item.key === "On Chain" && p.onChain
// //                           ? "success.main"
// //                           : "text.primary"
// //                       }
// //                     >
// //                       {item.value}
// //                     </Typography>
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         </Paper>

// //         {/* Ngày tạo/cập nhật */}
// //         <Box mt={2}>
// //           <Typography variant="body2" color="text.secondary">
// //             Ngày tạo:{" "}
// //             {p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}
// //           </Typography>
// //           <Typography variant="body2" color="text.secondary">
// //             Ngày cập nhật:{" "}
// //             {p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "-"}
// //           </Typography>
// //         </Box>
// //       </DialogContent>

// //       <DialogActions>
// //         {onEdit && (
// //           <Button onClick={onEdit} variant="contained">
// //             Sửa
// //           </Button>
// //         )}
// //         <Button onClick={onClose}>Đóng</Button>
// //       </DialogActions>
// //     </Dialog>
// //   );
// // }

// // // Component nhỏ để hiển thị label + value nhất quán
// // const Info = ({
// //   label,
// //   value,
// // }: {
// //   label: string;
// //   value?: string | number | boolean | null | undefined;
// // }) => (
// //   <Box mt={1}>
// //     <Typography variant="subtitle2">{label}</Typography>
// //     <Typography>
// //       {value !== undefined && value !== null && value !== ""
// //         ? String(value)
// //         : "-"}
// //     </Typography>
// //   </Box>
// // );

// "use client";

// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Grid,
//   Typography,
//   Box,
//   Paper,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Avatar,
//   Stack,
//   TextField,
// } from "@mui/material";
// import type { BackendProduct } from "@/types/drug";

// type DisplayProduct = Partial<BackendProduct> & {
//   type?: "domestic" | "abroad";
//   route?:
//     | "oral"
//     | "injection"
//     | "IV infusion"
//     | "inhalation"
//     | "rectal insertion";
//   createdAt?: string;
//   updatedAt?: string;
//   origin?: string;
// };

// interface DrugDetailModalProps {
//   open: boolean;
//   onClose: () => void;
//   product: DisplayProduct | null;
//   isDraft?: boolean;
//   onEdit?: () => void;
//   onConfirmOnchain?: (product: DisplayProduct & { origin: string }) => void;
// }

// export default function DrugDetailModal({
//   open,
//   onClose,
//   product,
//   isDraft = false,
//   onEdit,
//   onConfirmOnchain,
// }: DrugDetailModalProps) {
//   // ✅ Hooks luôn được gọi ngay từ đầu, không theo điều kiện
//   const [originInput, setOriginInput] = useState(product?.origin || "");
//   const [confirming, setConfirming] = useState(false);

//   if (!product) return null;
//   const p = product;
//   const API_BASE =
//     process.env.NEXT_PUBLIC_BE_API_BASE ||
//     "https://aurelio-untoned-yadiel.ngrok-free.dev";

//   const blockchainData = [
//     { key: "Product Code", value: p.productCode || "-" },
//     { key: "Company Code", value: p.companyCode || "-" },
//     { key: "GTIN", value: p.gtin || "-" },
//     { key: "On Chain", value: p.onChain ? "Yes" : "No" },
//     { key: "TX Hash", value: p.txHash || "-" },
//     { key: "Status", value: p.isActive || "-" },
//     { key: "Origin", value: originInput || "-" },
//   ];

//   const handleConfirm = () => {
//     if (!originInput) {
//       alert("⚠️ Vui lòng nhập Origin trước khi xác nhận!");
//       return;
//     }
//     if (onConfirmOnchain) {
//       onConfirmOnchain({ ...p, origin: originInput });
//     }
//     setConfirming(false);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>
//         {isDraft ? "Chi tiết - Bản nháp" : "Chi tiết sản phẩm"}
//       </DialogTitle>

//       <DialogContent dividers>
//         {/* I. Thông tin sản phẩm */}
//         <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
//           <Typography variant="h6" gutterBottom>
//             🧾 Thông tin sản phẩm
//           </Typography>

//           <Grid container spacing={2}>
//             <Grid size={{ xs: 12, sm: 6 }}>
//               <Info label="Tên" value={p.name} />
//               <Info label="Product Code" value={p.productCode} />
//               <Info label="Trạng thái" value={p.isActive} />
//               <Info label="On Chain" value={p.onChain ? "Yes" : "No"} />
//               <Info
//                 label="UOM / Số lượng"
//                 value={`${p.uom || "-"} / ${p.uomQuantity || "-"}`}
//               />
//               <Info label="GTIN" value={p.gtin} />
//               <Info label="Mã công ty" value={p.companyCode} />
//               <Info
//                 label="Category IDs"
//                 value={p.categoryIds?.join(", ") || "-"}
//               />
//               <Box mt={1}>
//                 <TextField
//                   label="Origin"
//                   fullWidth
//                   value={originInput}
//                   onChange={(e) => setOriginInput(e.target.value)}
//                   disabled={p.onChain}
//                   helperText="Nhập origin trước khi on-chain"
//                 />
//               </Box>
//             </Grid>

//             <Grid size={{ xs: 12, sm: 6 }}>
//               <Info label="Mô tả" value={p.description} />
//               <Info label="Route" value={p.route} />
//               <Info label="Type" value={p.type} />

//               <Box mt={1}>
//                 <Typography variant="subtitle2">Active Ingredients</Typography>
//                 {p.activeIngredient?.length ? (
//                   p.activeIngredient.map((ai, idx) => (
//                     <Typography key={idx}>
//                       {ai.name} - {ai.strength}
//                     </Typography>
//                   ))
//                 ) : (
//                   <Typography color="text.secondary">-</Typography>
//                 )}
//               </Box>

//               <Box mt={1}>
//                 <Typography variant="subtitle2">Storage Conditions</Typography>
//                 {p.storageConditions?.length ? (
//                   p.storageConditions.map((sc, idx) => (
//                     <Typography key={idx}>
//                       Temp: {sc.temperature}, Humidity: {sc.humidity}
//                     </Typography>
//                   ))
//                 ) : (
//                   <Typography color="text.secondary">-</Typography>
//                 )}
//               </Box>

//               <Box mt={2}>
//                 <Typography variant="subtitle2">Ảnh sản phẩm</Typography>
//                 {p.imagePrimary ? (
//                   <Box mt={1} textAlign="center">
//                     <Avatar
//                       src={`${API_BASE}/api/upload/${p.imagePrimary}`}
//                       alt="Ảnh đại diện"
//                       variant="rounded"
//                       sx={{ width: 160, height: 120 }}
//                     />
//                   </Box>
//                 ) : (
//                   <Typography color="text.secondary" mt={1}>
//                     Không có ảnh đại diện
//                   </Typography>
//                 )}

//                 {p.images && p.images.length > 0 && (
//                   <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
//                     {p.images.map((imgId, idx) => (
//                       <Box key={idx} textAlign="center">
//                         <Avatar
//                           src={`${API_BASE}/api/upload/${imgId}`}
//                           alt={`Ảnh phụ ${idx + 1}`}
//                           variant="rounded"
//                           sx={{ width: 80, height: 80 }}
//                         />
//                       </Box>
//                     ))}
//                   </Stack>
//                 )}
//               </Box>
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* II. Bảng dữ liệu blockchain */}
//         <Paper variant="outlined" sx={{ p: 2 }}>
//           <Typography variant="h6" gutterBottom>
//             ⛓️ Dữ liệu ghi lên Blockchain
//           </Typography>

//           <Table size="small">
//             <TableHead>
//               <TableRow>
//                 <TableCell width="40%">Thuộc tính</TableCell>
//                 <TableCell>Giá trị</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {blockchainData.map((item, idx) => (
//                 <TableRow key={idx}>
//                   <TableCell>{item.key}</TableCell>
//                   <TableCell>
//                     <Typography
//                       color={
//                         item.key === "On Chain" && p.onChain
//                           ? "success.main"
//                           : "text.primary"
//                       }
//                     >
//                       {item.value}
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Paper>

//         <Box mt={2}>
//           <Typography variant="body2" color="text.secondary">
//             Ngày tạo:{" "}
//             {p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Ngày cập nhật:{" "}
//             {p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "-"}
//           </Typography>
//         </Box>
//       </DialogContent>

//       <DialogActions>
//         {onEdit && <Button onClick={onEdit}>Sửa</Button>}

//         {!p.onChain && onConfirmOnchain && (
//           <Button variant="contained" color="primary" onClick={handleConfirm}>
//             Xác nhận & Onchain
//           </Button>
//         )}

//         <Button onClick={onClose}>Đóng</Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// const Info = ({
//   label,
//   value,
// }: {
//   label: string;
//   value?: string | number | boolean | null | undefined;
// }) => (
//   <Box mt={1}>
//     <Typography variant="subtitle2">{label}</Typography>
//     <Typography>
//       {value !== undefined && value !== null && value !== ""
//         ? String(value)
//         : "-"}
//     </Typography>
//   </Box>
// );


"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Stack,
  TextField,
} from "@mui/material";
import type { BackendProduct } from "@/types/drug";

type DisplayProduct = Partial<BackendProduct> & {
  type?: "domestic" | "abroad";
  route?:
    | "oral"
    | "injection"
    | "IV infusion"
    | "inhalation"
    | "rectal insertion";
  createdAt?: string;
  updatedAt?: string;
  origin?: string;
};

interface DrugDetailModalProps {
  open: boolean;
  onClose: () => void;
  product: DisplayProduct | null;
  isDraft?: boolean;
  onEdit?: () => void;
  onConfirmOnchain?: (product: DisplayProduct & { origin: string }) => void;
}

export default function DrugDetailModal({
  open,
  onClose,
  product,
  isDraft = false,
  onEdit,
  onConfirmOnchain,
}: DrugDetailModalProps) {
  const [originMap, setOriginMap] = useState<Record<string, string>>({});

  // Khi product thay đổi, reset input từ originMap nếu có
  const originInput = product?.productCode
    ? originMap[product.productCode] || ""
    : "";

  const API_BASE =
    process.env.NEXT_PUBLIC_BE_API_BASE ||
    "https://aurelio-untoned-yadiel.ngrok-free.dev";

  if (!product) return null;
  const p = product;

  const blockchainData = [
    { key: "Product Code", value: p.productCode || "-" },
    { key: "Company Code", value: p.companyCode || "-" },
    { key: "GTIN", value: p.gtin || "-" },
    { key: "On Chain", value: p.onChain ? "Yes" : "No" },
    { key: "TX Hash", value: p.txHash || "-" },
    { key: "Status", value: p.isActive || "-" },
    { key: "Origin", value: originInput || "-" },
  ];

  const handleOriginChange = (value: string) => {
    if (!p.productCode) return;
    setOriginMap((prev) => ({
      ...prev,
      [p.productCode || ""]: value,
    }));
  };

  const handleConfirm = () => {
    if (!p.productCode) return;
    const origin = originMap[p.productCode] || "";
    if (!origin) {
      alert("⚠️ Vui lòng nhập Origin trước khi xác nhận!");
      return;
    }
    onConfirmOnchain?.({ ...p, origin });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isDraft ? "Chi tiết - Bản nháp" : "Chi tiết sản phẩm"}
      </DialogTitle>

      <DialogContent dividers>
        {/* I. Thông tin sản phẩm */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            🧾 Thông tin sản phẩm
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Info label="Tên" value={p.name} />
              <Info label="Product Code" value={p.productCode} />
              <Info label="Trạng thái" value={p.isActive} />
              <Info label="On Chain" value={p.onChain ? "Yes" : "No"} />
              <Info
                label="UOM / Số lượng"
                value={`${p.uom || "-"} / ${p.uomQuantity || "-"}`}
              />
              <Info label="GTIN" value={p.gtin} />
              <Info label="Mã công ty" value={p.companyCode} />
              <Info
                label="Category IDs"
                value={p.categoryIds?.join(", ") || "-"}
              />

              {/* Input Origin */}
              {!p.onChain && (
                <Box mt={1}>
                  <TextField
                    label="Origin"
                    fullWidth
                    value={originInput}
                    onChange={(e) => handleOriginChange(e.target.value)}
                    helperText="Nhập Origin trước khi on-chain"
                  />
                </Box>
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Info label="Mô tả" value={p.description} />
              <Info label="Route" value={p.route} />
              <Info label="Type" value={p.type} />

              <Box mt={1}>
                <Typography variant="subtitle2">Active Ingredients</Typography>
                {p.activeIngredient?.length ? (
                  p.activeIngredient.map((ai, idx) => (
                    <Typography key={idx}>
                      {ai.name} - {ai.strength}
                    </Typography>
                  ))
                ) : (
                  <Typography color="text.secondary">-</Typography>
                )}
              </Box>

              <Box mt={1}>
                <Typography variant="subtitle2">Storage Conditions</Typography>
                {p.storageConditions?.length ? (
                  p.storageConditions.map((sc, idx) => (
                    <Typography key={idx}>
                      Temp: {sc.temperature}, Humidity: {sc.humidity}
                    </Typography>
                  ))
                ) : (
                  <Typography color="text.secondary">-</Typography>
                )}
              </Box>

              <Box mt={2}>
                <Typography variant="subtitle2">Ảnh sản phẩm</Typography>
                {p.imagePrimary ? (
                  <Box mt={1} textAlign="center">
                    <Avatar
                      src={`${API_BASE}/api/upload/${p.imagePrimary}`}
                      alt="Ảnh đại diện"
                      variant="rounded"
                      sx={{ width: 160, height: 120 }}
                    />
                  </Box>
                ) : (
                  <Typography color="text.secondary" mt={1}>
                    Không có ảnh đại diện
                  </Typography>
                )}

                {p.images && p.images.length > 0 && (
                  <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                    {p.images.map((imgId, idx) => (
                      <Box key={idx} textAlign="center">
                        <Avatar
                          src={`${API_BASE}/api/upload/${imgId}`}
                          alt={`Ảnh phụ ${idx + 1}`}
                          variant="rounded"
                          sx={{ width: 80, height: 80 }}
                        />
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* II. Bảng dữ liệu blockchain */}
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            ⛓️ Dữ liệu ghi lên Blockchain
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width="40%">Thuộc tính</TableCell>
                <TableCell>Giá trị</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blockchainData.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.key}</TableCell>
                  <TableCell>
                    <Typography
                      color={
                        item.key === "On Chain" && p.onChain
                          ? "success.main"
                          : "text.primary"
                      }
                    >
                      {item.value}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            Ngày tạo:{" "}
            {p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ngày cập nhật:{" "}
            {p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "-"}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        {onEdit && <Button onClick={onEdit}>Sửa</Button>}

        {!p.onChain && onConfirmOnchain && (
          <Button variant="contained" color="primary" onClick={handleConfirm}>
            Xác nhận & Onchain
          </Button>
        )}

        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}

const Info = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | boolean | null | undefined;
}) => (
  <Box mt={1}>
    <Typography variant="subtitle2">{label}</Typography>
    <Typography>
      {value !== undefined && value !== null && value !== ""
        ? String(value)
        : "-"}
    </Typography>
  </Box>
);
