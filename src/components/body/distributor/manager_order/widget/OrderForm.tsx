// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Modal,
//   Stack,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Divider,
//   Snackbar,
//   Alert,
//   CircularProgress,
// } from "@mui/material";
// import { useUpdateOrder } from "@/hooks/database/useOrder";
// import { useBatches } from "@/hooks/database/useBatch"; // 🟢 Thêm
// import { Order, UpdateOrderRequest } from "@/types/order";
// import { supabase } from "@/lib/supabaseClient";
// import { useEntityPermission } from "@/hooks/database/useEntityPermission";

// interface UpdateOrderModalProps {
//   open: boolean;
//   onClose: () => void;
//   order: Order | null;
//   onUpdateSuccess: () => void;
// }

// const UpdateOrderModal: React.FC<UpdateOrderModalProps> = ({
//   open,
//   onClose,
//   order,
//   onUpdateSuccess,
// }) => {
//   const [selectedBatches, setSelectedBatches] = useState<
//     Record<string, { batchCode: string; quantity: number; locationId: string }>
//   >({});
//   const [status, setStatus] = useState<Order["status"]>("processing");
//   const [notification, setNotification] = useState<string | null>(null);

//   const updateOrderMutation = useUpdateOrder();
//   const { canCreate } = useEntityPermission("order");
//   const { data: allBatches, isLoading: loadingBatches } = useBatches(); // 🟢 Lấy toàn bộ batch

//   useEffect(() => {
//     if (!order) return;
//     setStatus(order.status);
//     const initialBatches: typeof selectedBatches = {};
//     (order.data || []).forEach((item) => {
//       const firstBatch = item.batch[0];
//       if (firstBatch) {
//         initialBatches[item.productCode] = {
//           batchCode: firstBatch.batchCode,
//           quantity: firstBatch.quantity,
//           locationId: firstBatch.locationId || "LOC001",
//         };
//       }
//     });
//     setSelectedBatches(initialBatches);
//   }, [order]);

//   if (!order) return null;

//   const handleSelectBatch = (
//     productCode: string,
//     batchCode: string,
//     quantity: number,
//     locationId: string
//   ) => {
//     setSelectedBatches((prev) => ({
//       ...prev,
//       [productCode]: { batchCode, quantity, locationId },
//     }));
//   };

//   const handleUpdate = async () => {
//     try {
//       const payload: UpdateOrderRequest = {
//         orderCode: order.orderCode,
//         status,
//         data: order.products?.map((item) => ({
//           productCode: item.productCode,
//           batch: [
//             {
//               batchCode: selectedBatches[item.productCode]?.batchCode || "",
//               quantity: selectedBatches[item.productCode]?.quantity || 0,
//               locationId: selectedBatches[item.productCode]?.locationId || "",
//             },
//           ],
//         })),
//       };

//       await updateOrderMutation.mutateAsync(payload);

//       // ===== XỬ LÝ THÔNG BÁO =====
//       const outOfStock: string[] = [];
//       const missingBatch: string[] = [];

//       order.data?.forEach((item) => {
//         const selected = selectedBatches[item.productCode];
//         const totalQuantity = selected?.quantity ?? 0;
//         const totalBatches = item.batch.length;

//         if (status === "processing" && totalQuantity === totalBatches) {
//           outOfStock.push(item.productCode);
//         } else if (status === "inproduction" && totalQuantity < totalBatches) {
//           missingBatch.push(item.productCode);
//         }
//       });

//       if (canCreate) {
//         if (outOfStock.length > 0) {
//           await supabase.from("notifications").insert(
//             outOfStock.map((code) => ({
//               title: "Hết hàng",
//               message: `Thuốc ${code} đã hết lô`,
//               order_code: order.orderCode,
//             }))
//           );
//         }

//         if (missingBatch.length > 0) {
//           await supabase.from("notifications").insert(
//             missingBatch.map((code) => ({
//               title: "Thiếu lô",
//               message: `Thuốc ${code} đang thiếu lô`,
//               order_code: order.orderCode,
//             }))
//           );
//         }
//       }

//       setNotification("Cập nhật đơn hàng thành công");
//       onUpdateSuccess();
//       onClose();
//     } catch (error: unknown) {
//       if (error instanceof Error) setNotification(error.message);
//       else setNotification("Cập nhật thất bại");
//       console.error(error);
//     }
//   };

//   if (loadingBatches)
//     return (
//       <Modal open={open} onClose={onClose}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             p: 3,
//           }}
//         >
//           <CircularProgress />
//         </Box>
//       </Modal>
//     );

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: 600,
//           bgcolor: "background.paper",
//           borderRadius: 2,
//           p: 3,
//           maxHeight: "90vh",
//           overflowY: "auto",
//         }}
//       >
//         <Typography variant="h6" mb={2}>
//           Cập nhật đơn hàng: {order.orderCode}
//         </Typography>
//         <Stack spacing={2}>
//           {(order.products || []).map((item) => {
//             const selected = selectedBatches[item.productCode];

//             // 🟢 Lọc chỉ các batch có trạng thái in_production & cùng productCode
//             const availableBatches =
//               allBatches?.filter(
//                 (b) =>
//                   b.productCode === item.productCode &&
//                   b.state === "IN_PRODUCTION"
//               ) || [];

//             return (
//               <Box
//                 key={item.productCode}
//                 sx={{ border: "1px solid #ddd", p: 2, borderRadius: 1 }}
//               >
//                 <Typography>{item.productCode}</Typography>
//                 <Stack direction="row" spacing={2} mt={1}>
//                   <FormControl fullWidth>
//                     <InputLabel>Chọn lô (in_production)</InputLabel>
//                     <Select
//                       value={selected?.batchCode || ""}
//                       label="Chọn lô (in_production)"
//                       onChange={(e) => {
//                         const sel = availableBatches.find(
//                           (b) => b.batchCode === e.target.value
//                         );
//                         if (!sel) return;
//                         handleSelectBatch(
//                           item.productCode,
//                           sel.batchCode,
//                           sel.currentQuantity,
//                           sel.locationId || "LOC001"
//                         );
//                       }}
//                     >
//                       {availableBatches.map((b) => (
//                         <MenuItem key={b.batchCode} value={b.batchCode}>
//                           {b.batchCode} ({b.currentQuantity})
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Stack>
//               </Box>
//             );
//           })}

//           <Divider />

//           <FormControl fullWidth>
//             <InputLabel>Trạng thái đơn</InputLabel>
//             <Select
//               value={status}
//               onChange={(e) => setStatus(e.target.value as Order["status"])}
//             >
//               <MenuItem value="processing">Processing</MenuItem>
//               <MenuItem value="inproduction">In Production</MenuItem>
//               <MenuItem value="instock">In Stock</MenuItem>
//               <MenuItem value="delivering">Delivering</MenuItem>
//               <MenuItem value="delivered">Delivered</MenuItem>
//               <MenuItem value="goods_received">Goods Received</MenuItem>
//               <MenuItem value="rejected">Rejected</MenuItem>
//             </Select>
//           </FormControl>

//           <Button variant="contained" onClick={handleUpdate}>
//             Cập nhật đơn hàng
//           </Button>
//         </Stack>

//         <Snackbar
//           open={!!notification}
//           autoHideDuration={4000}
//           onClose={() => setNotification(null)}
//         >
//           <Alert severity="info">{notification}</Alert>
//         </Snackbar>
//       </Box>
//     </Modal>
//   );
// };

// export default UpdateOrderModal;

// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Modal,
//   Stack,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Divider,
//   Snackbar,
//   Alert,
//   CircularProgress,
// } from "@mui/material";
// import { useUpdateOrder } from "@/hooks/database/useOrder";
// import { Order, UpdateOrderRequest } from "@/types/order";
// import { supabase } from "@/lib/supabaseClient";
// import { inventoryService } from "@/services/inventoryService";
// import { InventoryLocation } from "@/types/location";
// import { batchService } from "@/services/batchService";
// import { Batch } from "@/types/batch";

// // ✅ Interface mở rộng đúng kiểu
// interface InventoryWithLocation {
//   inventoryId: string;
//   locationId: string;
//   locationName: string;
//   batchCode: string;
//   currentQuantity: number;
//   uom: "box";
//   isActive: "active" | "inactive" | "danger";
//   productCode: string; // ✅ luôn có, không undefined
// }

// interface UpdateOrderModalProps {
//   open: boolean;
//   onClose: () => void;
//   order: Order | null;
//   onUpdateSuccess: () => void;
// }

// const UpdateOrderModal: React.FC<UpdateOrderModalProps> = ({
//   open,
//   onClose,
//   order,
//   onUpdateSuccess,
// }) => {
//   const [selectedBatches, setSelectedBatches] = useState<
//     Record<string, { batchCode: string; quantity: number; locationId: string }>
//   >({});
//   const [status, setStatus] = useState<Order["status"]>("processing");
//   const [notification, setNotification] = useState<string | null>(null);
//   const [inventories, setInventories] = useState<InventoryWithLocation[]>([]);
//   const [loadingInventory, setLoadingInventory] = useState<boolean>(false);

//   const updateOrderMutation = useUpdateOrder();

//   // 🟢 Lấy tồn kho + ánh xạ productCode từ Batch
//   useEffect(() => {
//     const fetchInventory = async () => {
//       try {
//         setLoadingInventory(true);

//         // Lấy danh sách lô hàng (để ánh xạ batch → product)
//         const batches: Batch[] = await batchService.getAll();
//         const batchMap: Record<string, string> = Object.fromEntries(
//           batches.map((b) => [b.batchCode, b.productCode])
//         );

//         // Lấy tồn kho (theo location)
//         const data: InventoryLocation[] = await inventoryService.getAll();

//         // Flatten inventories và thêm productCode
//         const flattened: InventoryWithLocation[] = data.flatMap((loc) =>
//           loc.inventories.map((inv) => ({
//             ...inv,
//             locationName: loc.locationName,
//             productCode: batchMap[inv.batchCode] || "UNKNOWN",
//           }))
//         );

//         setInventories(flattened);
//       } catch (err) {
//         console.error("Lỗi khi lấy tồn kho:", err);
//       } finally {
//         setLoadingInventory(false);
//       }
//     };

//     if (open) fetchInventory();
//   }, [open]);

//   // 🟢 Chọn batch
//   const handleSelectBatch = (
//     productCode: string,
//     batchCode: string,
//     quantity: number,
//     locationId: string
//   ) => {
//     setSelectedBatches((prev) => ({
//       ...prev,
//       [productCode]: { batchCode, quantity, locationId },
//     }));
//   };

//   // 🟢 Cập nhật đơn hàng + kiểm tra tồn kho
//   const handleUpdate = async () => {
//     try {
//       if (!order) return;

//       const lowStockBatches: string[] = [];

//       // ✅ Kiểm tra tồn kho trước
//       order.products?.forEach((item) => {
//         const sel = selectedBatches[item.productCode];
//         if (!sel?.batchCode) return;

//         const inv = inventories.find(
//           (inv) =>
//             inv.batchCode === sel.batchCode && inv.locationId === sel.locationId
//         );

//         if (!inv) return;

//         if (inv.currentQuantity <= 0) {
//           lowStockBatches.push(`${inv.batchCode} (hết hàng)`);
//         } else if (inv.currentQuantity < 50) {
//           lowStockBatches.push(`${inv.batchCode} (sắp hết hàng)`);
//         }
//       });

//       // 🟢 Tạo payload cập nhật đơn hàng
//       const payload: UpdateOrderRequest = {
//   orderCode: order.orderCode,
//   status,
//   data: order.products?.map((item) => ({
//     productCode: item.productCode,
//     batch: [
//       {
//         batchCode: selectedBatches[item.productCode]?.batchCode || "",
//         quantity: item.productQuantity, // ✅ lấy số lượng đơn hàng
//         locationId: selectedBatches[item.productCode]?.locationId || "",
//       },
//     ],
//   })),
// };

//       await updateOrderMutation.mutateAsync(payload);

//       // 🟢 Gửi thông báo cập nhật đơn hàng
//       await supabase.from("notifications").insert([
//         {
//           title: "Cập nhật đơn hàng",
//           message: `Đơn ${order.orderCode} đã được cập nhật trạng thái: ${status}`,
//           order_code: order.orderCode,
//           read: false,
//         },
//       ]);

//       // 🟠 Nếu có lô sắp hết → gửi cảnh báo
//       if (lowStockBatches.length > 0) {
//         await supabase.from("notifications").insert([
//           {
//             title: "Cảnh báo tồn kho thấp",
//             message: `Các lô sau sắp hết hàng: ${lowStockBatches.join(", ")}`,
//             read: false,
//           },
//         ]);
//       }

//       setNotification("Cập nhật đơn hàng thành công");
//       onUpdateSuccess();
//       onClose();
//     } catch (error: unknown) {
//       if (error instanceof Error) setNotification(error.message);
//       else setNotification("Cập nhật thất bại");
//       console.error(error);
//     }
//   };

//   if (!order) return null;

//   if (loadingInventory)
//     return (
//       <Modal open={open} onClose={onClose}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             p: 3,
//           }}
//         >
//           <CircularProgress />
//         </Box>
//       </Modal>
//     );

//   // 🟢 Render modal
//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: 600,
//           bgcolor: "background.paper",
//           borderRadius: 2,
//           p: 3,
//           maxHeight: "90vh",
//           overflowY: "auto",
//         }}
//       >
//         <Typography variant="h6" mb={2}>
//           Cập nhật đơn hàng: {order.orderCode}
//         </Typography>

//         <Stack spacing={2}>
//           {(order.products || []).map((item) => {
//             const selected = selectedBatches[item.productCode];
//             const availableStock = inventories.filter(
//               (inv) => inv.productCode === item.productCode
//             );

//             return (
//               <Box
//                 key={item.productCode}
//                 sx={{ border: "1px solid #ddd", p: 2, borderRadius: 1 }}
//               >
//                 <Typography fontWeight={600}>{item.productCode}</Typography>

//                 <Stack direction="row" spacing={2} mt={1}>
//                   <FormControl fullWidth>
//                     <InputLabel>Chọn lô tồn kho</InputLabel>
//                     <Select
//                       value={selected?.batchCode || ""}
//                       label="Chọn lô tồn kho"
//                       onChange={(e) => {
//                         const sel = availableStock.find(
//                           (inv) => inv.batchCode === e.target.value
//                         );
//                         if (!sel) return;
//                         handleSelectBatch(
//                           item.productCode,
//                           sel.batchCode,
//                           sel.currentQuantity,
//                           sel.locationId
//                         );
//                       }}
//                     >
//                       {availableStock.map((inv) => (
//                         <MenuItem key={inv.batchCode} value={inv.batchCode}>
//                           {inv.batchCode} - {inv.locationName} (
//                           {inv.currentQuantity})
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Stack>

//                 <Typography
//   mt={1}
//   fontSize={14}
//   color={
//     selected?.quantity !== undefined &&
//     selected.quantity < item.productQuantity
//       ? "error.main"
//       : "text.primary"
//   }
// >
//   Số lượng tồn: {selected?.quantity ?? "-"} / Số lượng đơn:{" "}
//   {item.productQuantity} <br />
//   {selected?.quantity === undefined ? (
//     <>⚠️ Chưa chọn lô tồn kho</>
//   ) : selected.quantity < item.productQuantity ? (
//     <>⚠️ Không đủ tồn kho!</>
//   ) : (
//     <>Số còn tồn sau khi trừ: {selected.quantity - item.productQuantity}</>
//   )}
// </Typography>

//               </Box>
//             );
//           })}

//           <Divider />

//           <FormControl fullWidth>
//             <InputLabel>Trạng thái đơn</InputLabel>
//             <Select
//               value={status}
//               onChange={(e) => setStatus(e.target.value as Order["status"])}
//             >
//               <MenuItem value="processing">Processing</MenuItem>
//               <MenuItem value="inproduction">In Production</MenuItem>
//               <MenuItem value="instock">In Stock</MenuItem>
//               <MenuItem value="delivering">Delivering</MenuItem>
//               <MenuItem value="delivered">Delivered</MenuItem>
//               <MenuItem value="goods_received">Goods Received</MenuItem>
//               <MenuItem value="rejected">Rejected</MenuItem>
//             </Select>
//           </FormControl>

//           <Button variant="contained" onClick={handleUpdate}>
//             Cập nhật đơn hàng
//           </Button>
//         </Stack>

//         <Snackbar
//           open={!!notification}
//           autoHideDuration={4000}
//           onClose={() => setNotification(null)}
//         >
//           <Alert severity="info">{notification}</Alert>
//         </Snackbar>
//       </Box>
//     </Modal>
//   );
// };

// export default UpdateOrderModal;

"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useUpdateOrder } from "@/hooks/database/useOrder";
import { Order, UpdateOrderRequest } from "@/types/order";
import { inventoryService } from "@/services/inventoryService";
import { batchService } from "@/services/batchService";
import { InventoryLocation } from "@/types/location";
import { Batch } from "@/types/batch";
import { supabase } from "@/lib/supabaseClient";

interface InventoryWithLocation {
  inventoryId: string;
  locationId: string;
  locationName: string;
  batchCode: string;
  currentQuantity: number;
  uom: "box";
  productCode: string;
}

interface UpdateOrderModalProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateSuccess: () => void;
}

const UpdateOrderModal: React.FC<UpdateOrderModalProps> = ({
  open,
  onClose,
  order,
  onUpdateSuccess,
}) => {
  const [selectedBatches, setSelectedBatches] = useState<
    Record<string, { batchCode: string; quantity: number; locationId: string }>
  >({});
  const [inventories, setInventories] = useState<InventoryWithLocation[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [notification, setNotification] = useState<string | null>(null);
  const [status, setStatus] = useState<Order["status"]>("processing");

  const updateOrderMutation = useUpdateOrder();

  // Load inventories
  useEffect(() => {
    if (!open) return;

    const fetchInventory = async () => {
      try {
        setLoadingInventory(true);
        const batches: Batch[] = await batchService.getAll();
        const batchMap: Record<string, string> = Object.fromEntries(
          batches.map((b) => [b.batchCode, b.productCode])
        );

        const data: InventoryLocation[] = await inventoryService.getAll();

        const flattened: InventoryWithLocation[] = data.flatMap((loc) =>
          loc.inventories.map((inv) => ({
            ...inv,
            locationName: loc.locationName,
            locationId: loc.locationId,
            productCode: batchMap[inv.batchCode] || "UNKNOWN",
          }))
        );

        setInventories(flattened);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingInventory(false);
      }
    };

    fetchInventory();
  }, [open]);

  const handleSelectBatch = (
    productCode: string,
    batchCode: string,
    quantity: number,
    locationId: string
  ) => {
    setSelectedBatches((prev) => ({
      ...prev,
      [productCode]: { batchCode, quantity, locationId },
    }));
  };

  // ✅ Validate batch và tạo notification Supabase nếu thiếu thuốc
  // const validateBatches = async (): Promise<boolean> => {
  //   if (!order) return false;

  //   const outOfStock: string[] = [];
  //   const lowStock: string[] = [];

  //   order.products?.forEach((item) => {
  //     const sel = selectedBatches[item.productCode];
  //     if (!sel?.batchCode) {
  //       lowStock.push(`${item.productCode} (chưa chọn lô)`);
  //       return;
  //     }

  //     const inv = inventories.find(
  //       (inv) =>
  //         inv.batchCode === sel.batchCode && inv.locationId === sel.locationId
  //     );
  //     if (!inv) return;

  //     if (inv.currentQuantity <= 0) outOfStock.push(item.productCode);
  //     else if (inv.currentQuantity < item.productQuantity)
  //       lowStock.push(
  //         `${item.productCode} (còn ${inv.currentQuantity}, thiếu ${
  //           item.productQuantity - inv.currentQuantity
  //         })`
  //       );
  //   });

  //   if (outOfStock.length > 0 || lowStock.length > 0) {
  //     const messageParts = [
  //       outOfStock.length ? `Hết hàng: ${outOfStock.join(", ")}` : null,
  //       lowStock.length ? `Thiếu hàng: ${lowStock.join(", ")}` : null,
  //     ].filter(Boolean);
  //     const message = messageParts.join(" | ");

  //     // Gửi vào Supabase
  //     await supabase.from("notifications").insert([
  //       {
  //         title: `Cảnh báo tồn kho đơn ${order.orderCode}`,
  //         message,
  //         order_code: order.orderCode,
  //       },
  //     ]);

  //     setNotification(`⚠️ ${message}`);
  //     return false;
  //   }

  //   return true;
  // };

  const validateBatches = async (): Promise<{ valid: boolean; message?: string }> => {
  if (!order) return { valid: false };

  const outOfStock: string[] = [];
  const lowStock: string[] = [];

  order.products?.forEach((item) => {
    const sel = selectedBatches[item.productCode];
    if (!sel?.batchCode) {
      lowStock.push(`${item.productCode} (chưa chọn lô)`);
      return;
    }

    const inv = inventories.find(
      (inv) =>
        inv.batchCode === sel.batchCode && inv.locationId === sel.locationId
    );
    if (!inv) return;

    if (inv.currentQuantity <= 0) outOfStock.push(item.productCode);
    else if (inv.currentQuantity < item.productQuantity)
      lowStock.push(
        `${item.productCode} (còn ${inv.currentQuantity}, thiếu ${
          item.productQuantity - inv.currentQuantity
        })`
      );
  });

  if (outOfStock.length > 0 || lowStock.length > 0) {
    const messageParts = [
      outOfStock.length ? `Hết hàng: ${outOfStock.join(", ")}` : null,
      lowStock.length ? `Thiếu hàng: ${lowStock.join(", ")}` : null,
    ].filter(Boolean);
    const message = messageParts.join(" | ");

    // Gửi notification Supabase
    await supabase.from("notifications").insert([
      {
        title: `Cảnh báo tồn kho đơn ${order.orderCode}`,
        message,
        order_code: order.orderCode,
      },
    ]);

    return { valid: false, message };
  }

  return { valid: true };
};

  const handleNextStep = async () => {
    const isValid = await validateBatches();
    if (isValid) setStep(2);
  };

  // const handleUpdateOrder = async () => {
  //   if (!order) return;

  //   const payload: UpdateOrderRequest = {
  //     orderCode: order.orderCode,
  //     status,
  //     data:
  //       order.products?.map((item) => ({
  //         productCode: item.productCode,
  //         batch: [
  //           {
  //             batchCode: selectedBatches[item.productCode]?.batchCode || "",
  //             quantity: item.productQuantity,
  //             locationId: selectedBatches[item.productCode]?.locationId || "",
  //           },
  //         ],
  //       })) || [],
  //   };

  //   try {
  //     await updateOrderMutation.mutateAsync(payload);
  //     setNotification("✅ Cập nhật đơn thành công");
  //     onUpdateSuccess();
  //     onClose();
  //   } catch (err: unknown) {
  //     if (err instanceof Error) setNotification(err.message);
  //     else setNotification("Cập nhật thất bại");
  //     console.error(err);
  //   }
  // };

  const handleUpdateOrder = async () => {
  if (!order) return;

  const validation = await validateBatches();
  if (!validation.valid) {
    setNotification(`⚠️ ${validation.message}`);
    // ❌ Giả lập cập nhật thất bại
    return;
  }

  // ✅ Nếu đủ tồn kho thì mới gọi API update
  const payload: UpdateOrderRequest = {
    orderCode: order.orderCode,
    status,
    data:
      order.products?.map((item) => ({
        productCode: item.productCode,
        batch: [
          {
            batchCode: selectedBatches[item.productCode]?.batchCode || "",
            quantity: item.productQuantity,
            locationId: selectedBatches[item.productCode]?.locationId || "",
          },
        ],
      })) || [],
  };

  try {
    await updateOrderMutation.mutateAsync(payload);
    setNotification("✅ Cập nhật đơn thành công");
    onUpdateSuccess();
    onClose();
  } catch (err) {
    setNotification("❌ Cập nhật thất bại");
    console.error(err);
  }
};


  if (!order) return null;

  if (loadingInventory)
    return (
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            p: 3,
          }}
        >
          <CircularProgress />
        </Box>
      </Modal>
    );

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 3,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" mb={2}>
          Cập nhật đơn hàng: {order.orderCode}
        </Typography>

        <Stack spacing={2}>
          {step === 1 && (
            <>
              <Typography variant="subtitle1">
                Bước 1: Chọn lô tồn kho
              </Typography>
              {(order.products || []).map((item) => {
                const selected = selectedBatches[item.productCode];
                const availableStock = inventories.filter(
                  (inv) =>
                    inv.productCode === item.productCode ||
                    inv.productCode === "UNKNOWN"
                );

                return (
                  <Box
                    key={item.productCode}
                    sx={{ border: "1px solid #ddd", p: 2, borderRadius: 1 }}
                  >
                    <Typography fontWeight={600}>{item.productCode}</Typography>

                    <FormControl fullWidth sx={{ mt: 1 }}>
                      <InputLabel>Chọn lô tồn kho</InputLabel>
                      <Select
                        value={selected?.batchCode || ""}
                        label="Chọn lô tồn kho"
                        onChange={(e) => {
                          const sel = availableStock.find(
                            (inv) => inv.batchCode === e.target.value
                          );
                          if (!sel) return;
                          handleSelectBatch(
                            item.productCode,
                            sel.batchCode,
                            sel.currentQuantity,
                            sel.locationId
                          );
                        }}
                      >
                        {availableStock.map((inv) => (
                          <MenuItem key={inv.batchCode} value={inv.batchCode}>
                            {inv.batchCode} - {inv.locationName} (
                            {inv.currentQuantity})
                            {inv.productCode === "UNKNOWN" &&
                              " ⚠️ Không xác định sản phẩm"}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                );
              })}
              <Button variant="contained" onClick={handleNextStep}>
                Tiếp theo
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Typography variant="subtitle1">Bước 2: Chọn trạng thái đơn</Typography>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Order["status"])}
                >
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="inproduction">In Production</MenuItem>
                  <MenuItem value="instock">In Stock</MenuItem>
                  <MenuItem value="delivering">Delivering</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="goods_received">Goods Received</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
              <Button variant="outlined" onClick={handleUpdateOrder}>
                Cập nhật
              </Button>
            </>
          )}
        </Stack>

        <Snackbar
          open={!!notification}
          autoHideDuration={4000}
          onClose={() => setNotification(null)}
        >
          <Alert
            severity={notification?.includes("⚠️") ? "warning" : "success"}
          >
            {notification}
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};

export default UpdateOrderModal;


// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Modal,
//   Stack,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Divider,
//   Snackbar,
//   Alert,
//   CircularProgress,
// } from "@mui/material";
// import { useUpdateOrder } from "@/hooks/database/useOrder";
// import { useBatches } from "@/hooks/database/useBatch";
// import { useInventory } from "@/hooks/database/useInventory";
//  // hook lấy inventory theo company hoặc toàn bộ
// import { Order, UpdateOrderRequest } from "@/types/order";
// import { Inventory, InventoryLocation } from "@/types/location";
// import { Batch } from "@/types/batch";

// interface UpdateOrderModalProps {
//   open: boolean;
//   onClose: () => void;
//   order: Order;
// }

// export default function UpdateOrderModal({ open, onClose, order }: UpdateOrderModalProps) {
//   const { mutateAsync: updateOrder, isPending } = useUpdateOrder();
//   const { data: batchData, isLoading: loadingBatches } = useBatches();
// const { data: inventoryData, isLoading: loadingInventory } = useInventory();

//   const [selectedBatches, setSelectedBatches] = useState<Record<string, string>>({});
//   const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   // Reset selections when order changes
//   useEffect(() => {
//     if (order) setSelectedBatches({});
//   }, [order]);

//   // Xử lý cập nhật đơn hàng
//   const handleUpdate = async () => {
//   try {
//     const payload: UpdateOrderRequest = {
//       orderCode: order.orderCode, // ✅ đúng với type
//       status: "processing", // hoặc giữ nguyên trạng thái cũ nếu cần
//       data: order.products.map((p) => ({
//         productCode: p.productCode,
//         batch: [
//           {
//             batchCode: selectedBatches[p.productCode] || "",
//             quantity: p.productQuantity, // ✅ số lượng xuất, bạn có thể sửa nếu cần
//           },
//         ],
//       })),
//     };

//     await updateOrder(payload);
//     setSnackbar({
//       open: true,
//       message: "Cập nhật đơn hàng thành công!",
//       severity: "success",
//     });
//     onClose();
//   } catch (error: unknown) {
//   console.error(error);

//   const message =
//     error instanceof Error
//       ? error.message
//       : "Lỗi khi cập nhật đơn hàng!";

//   setSnackbar({
//     open: true,
//     message,
//     severity: "error",
//   });
// }
// };

//   if (loadingBatches || loadingInventory)
//     return (
//       <Box sx={{ textAlign: "center", p: 4 }}>
//         <CircularProgress />
//         <Typography mt={2}>Đang tải dữ liệu...</Typography>
//       </Box>
//     );

//   // batchData và inventoryData lấy từ API
// const batches: Batch[] = batchData || [];
// const inventories: Inventory[] =
//   inventoryData?.flatMap((loc: InventoryLocation) =>
//     loc.inventories.map((inv: Inventory) => ({
//       ...inv,
//       locationName: loc.locationName,
//     }))
//   ) || [];

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           bgcolor: "background.paper",
//           p: 4,
//           width: 600,
//           borderRadius: 2,
//           boxShadow: 24,
//           mx: "auto",
//           mt: "10%",
//         }}
//       >
//         <Typography variant="h6" gutterBottom>
//           Cập nhật lô cho đơn hàng {order.orderCode}
//         </Typography>

//         <Divider sx={{ mb: 2 }} />

//         {order.products.map((item) => {
//           // Lọc lô tồn kho phù hợp với sản phẩm
//           const availableStock = inventories.filter((inv) => {
//             const batchInfo = batches.find((b) => b.batchCode === inv.batchCode);
//             return (
//               batchInfo &&
//               batchInfo.productCode === item.productCode &&
//               inv.currentQuantity > 0 &&
//               inv.isActive === "active"
//             );
//           });

//           return (
//             <Box
//               key={item.productCode}
//               sx={{
//                 border: "1px solid #ddd",
//                 borderRadius: 1,
//                 p: 2,
//                 mb: 2,
//                 backgroundColor: "#fafafa",
//               }}
//             >
//               <Typography fontWeight={600}>
//                 {/* {item.productName}  */}
//                 ({item.productCode})
//               </Typography>

//               <Stack direction="row" spacing={2} mt={1}>
//                 <FormControl fullWidth>
//                   <InputLabel>Chọn lô tồn kho</InputLabel>
//                   <Select
//                     label="Chọn lô tồn kho"
//                     value={selectedBatches[item.productCode] || ""}
//                     onChange={(e) =>
//                       setSelectedBatches((prev) => ({
//                         ...prev,
//                         [item.productCode]: e.target.value,
//                       }))
//                     }
//                   >
//                     {availableStock.length > 0 ? (
//                       availableStock.map((inv) => (
//                         <MenuItem key={inv.batchCode} value={inv.batchCode}>
//                           {inv.batchCode} — {inv.locationName} ({inv.currentQuantity} {inv.uom})
//                         </MenuItem>
//                       ))
//                     ) : (
//                       <MenuItem disabled>Không có lô tồn kho phù hợp</MenuItem>
//                     )}
//                   </Select>
//                 </FormControl>
//               </Stack>
//             </Box>
//           );
//         })}

//         <Divider sx={{ my: 2 }} />

//         <Stack direction="row" justifyContent="flex-end" spacing={2}>
//           <Button variant="outlined" onClick={onClose}>
//             Hủy
//           </Button>
//           <Button variant="contained" onClick={handleUpdate} disabled={isPending}>
//             {isPending ? "Đang lưu..." : "Lưu thay đổi"}
//           </Button>
//         </Stack>

//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={4000}
//           onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
//           anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//         >
//           <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
//         </Snackbar>
//       </Box>
//     </Modal>
//   );
// }

// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Modal,
//   Stack,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Divider,
//   Snackbar,
//   Alert,
//   CircularProgress,
// } from "@mui/material";
// import { useUpdateOrder } from "@/hooks/database/useOrder";
// import { useBatches } from "@/hooks/database/useBatch";
// import { useInventory } from "@/hooks/database/useInventory";
// import { Order, UpdateOrderRequest, OrderStatus } from "@/types/order";
// import { Inventory, InventoryLocation } from "@/types/location";
// import { Batch } from "@/types/batch";

// interface UpdateOrderModalProps {
//   open: boolean;
//   onClose: () => void;
//   order: Order | null;
//   onUpdateSuccess?: (updatedData?: {
//     outOfStock?: string[];
//     inProduction?: boolean;
//   }) => Promise<void>;
// }

// export default function UpdateOrderModal({
//   open,
//   onClose,
//   order,
//   onUpdateSuccess,
// }: UpdateOrderModalProps) {
//   const [status, setStatus] = useState<OrderStatus>("processing");
//   const { mutateAsync: updateOrder, isPending } = useUpdateOrder();
//   const { data: batchData, isLoading: loadingBatches } = useBatches();
//   const { data: inventoryData, isLoading: loadingInventory } = useInventory();

//   const [selectedBatches, setSelectedBatches] = useState<
//     Record<string, string>
//   >({});
//   const [snackbar, setSnackbar] = useState<{
//     open: boolean;
//     message: string;
//     severity: "success" | "error";
//   }>({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   // 🧩 Reset selections khi order thay đổi
//   useEffect(() => {
//     if (order) setSelectedBatches({});
//   }, [order]);

//   if (!order) return null;

//   // 🧩 Gọi API cập nhật đơn hàng
//   const handleUpdate = async () => {
//     try {
//       const payload: UpdateOrderRequest = {
//         orderCode: order.orderCode,
//         status, // ✅ dùng state thay vì cố định
//         data: order.products.map((p) => ({
//           productCode: p.productCode,
//           batch: [
//             {
//               batchCode: selectedBatches[p.productCode] || "",
//               quantity: p.productQuantity,
//             },
//           ],
//         })),
//       };

//       await updateOrder(payload);
//       if (onUpdateSuccess) await onUpdateSuccess();

//       setSnackbar({
//         open: true,
//         message: "Cập nhật đơn hàng thành công!",
//         severity: "success",
//       });
//       onClose();
//     } catch (error: unknown) {
//       console.error(error);
//       const message =
//         error instanceof Error ? error.message : "Lỗi khi cập nhật đơn hàng!";
//       setSnackbar({
//         open: true,
//         message,
//         severity: "error",
//       });
//     }
//   };

//   // 🧩 Loading
//   if (loadingBatches || loadingInventory)
//     return (
//       <Box sx={{ textAlign: "center", p: 4 }}>
//         <CircularProgress />
//         <Typography mt={2}>Đang tải dữ liệu...</Typography>
//       </Box>
//     );

//   // 🧩 Chuẩn hóa dữ liệu tồn kho
//   const batches: Batch[] = batchData || [];
//   const inventories: Inventory[] =
//     inventoryData?.flatMap((loc: InventoryLocation) =>
//       loc.inventories.map((inv: Inventory) => ({
//         ...inv,
//         locationName: loc.locationName,
//       }))
//     ) || [];

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           bgcolor: "background.paper",
//           p: 4,
//           width: 600,
//           borderRadius: 2,
//           boxShadow: 24,
//           mx: "auto",
//           mt: "10%",
//         }}
//       >
//         <Typography variant="h6" gutterBottom>
//           Cập nhật lô cho đơn hàng {order.orderCode}
//         </Typography>

//         <Divider sx={{ mb: 2 }} />

//         {/* 🧩 Hiển thị sản phẩm và chọn lô */}
//         {order.products.map((item) => {
//           const availableStock = inventories.filter((inv) => {
//             const batchInfo = batches.find(
//               (b) => b.batchCode === inv.batchCode
//             );
//             return (
//               batchInfo &&
//               batchInfo.productCode === item.productCode &&
//               inv.currentQuantity > 0 &&
//               inv.isActive === "active"
//             );
//           });

//           return (
//             <Box
//               key={item.productCode}
//               sx={{
//                 border: "1px solid #ddd",
//                 borderRadius: 1,
//                 p: 2,
//                 mb: 2,
//                 backgroundColor: "#fafafa",
//               }}
//             >
//               <Typography fontWeight={600}>
//                 Sản phẩm: {item.productCode}
//               </Typography>

//               <Stack direction="row" spacing={2} mt={1}>
//                 <FormControl fullWidth>
//                   <InputLabel>Chọn lô tồn kho</InputLabel>
//                   <Select
//                     label="Chọn lô tồn kho"
//                     value={selectedBatches[item.productCode] || ""}
//                     onChange={(e) =>
//                       setSelectedBatches((prev) => ({
//                         ...prev,
//                         [item.productCode]: e.target.value,
//                       }))
//                     }
//                   >
//                     {availableStock.length > 0 ? (
//                       availableStock.map((inv) => (
//                         <MenuItem key={inv.batchCode} value={inv.batchCode}>
//                           {inv.batchCode} — {inv.locationName} (
//                           {inv.currentQuantity} {inv.uom})
//                         </MenuItem>
//                       ))
//                     ) : (
//                       <MenuItem disabled>Không có lô tồn kho phù hợp</MenuItem>
//                     )}
//                   </Select>
//                 </FormControl>
//               </Stack>
//             </Box>
//           );
//         })}

//         <Divider sx={{ my: 2 }} />

//         {/* 🧩 Chọn trạng thái đơn hàng */}
//         <Stack direction="row" spacing={2} mb={2}>
//           <FormControl fullWidth>
//             <InputLabel>Trạng thái đơn hàng</InputLabel>
//             <Select
//               label="Trạng thái đơn hàng"
//               value={status}
//               onChange={(e) => setStatus(e.target.value as OrderStatus)}
//             >
//               <MenuItem value="processing">Processing</MenuItem>
//               <MenuItem value="inproduction">In Production</MenuItem>
//               <MenuItem value="instock">In Stock</MenuItem>
//               <MenuItem value="delivering">Delivering</MenuItem>
//               <MenuItem value="delivered">Delivered</MenuItem>
//               <MenuItem value="goods_received">Goods Received</MenuItem>
//               <MenuItem value="rejected">Rejected</MenuItem>
//             </Select>
//           </FormControl>
//         </Stack>

//         {/* 🧩 Nút hành động */}
//         <Stack direction="row" justifyContent="flex-end" spacing={2}>
//           <Button variant="outlined" onClick={onClose}>
//             Hủy
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleUpdate}
//             disabled={isPending}
//           >
//             {isPending ? "Đang lưu..." : "Lưu thay đổi"}
//           </Button>
//         </Stack>

//         {/* 🧩 Snackbar thông báo */}
//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={4000}
//           onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
//           anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//         >
//           <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
//         </Snackbar>
//       </Box>
//     </Modal>
//   );
// }
