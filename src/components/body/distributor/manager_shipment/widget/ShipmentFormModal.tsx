// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Modal,
//   Typography,
//   Stack,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   TextField,
//   Snackbar,
//   Alert,
//   CircularProgress,
// } from "@mui/material";
// import { Order } from "@/types/order";
// import { Shipment, BatchItem, ShipmentStatus } from "@/types/shipment";
// import { orderService } from "@/services/orderService";
// import axios from "axios";

// const modalStyle = {
//   position: "absolute" as const,
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 600,
//   bgcolor: "background.paper",
//   borderRadius: 2,
//   boxShadow: 24,
//   p: 4,
//   maxHeight: "90vh",
//   overflowY: "auto",
// };

// interface ShipmentFormModalV2Props {
//   open: boolean;
//   shipment?: Shipment | null;
//   preselectedBatchCode?: string | null;
//   onClose: () => void;
//   onSubmitSuccess: () => void;
// }

// const statusOptions: ShipmentStatus[] = [
//   "processing",
//   "delivering",
//   "delivered",
//   "goods_received",
//   "canceled",
// ];

// export const ShipmentFormModalV2: React.FC<ShipmentFormModalV2Props> = ({
//   open,
//   shipment,
//   onClose,
//   onSubmitSuccess,
//   preselectedBatchCode
// }) => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [batches, setBatches] = useState<BatchItem[]>([]);
//   const [status, setStatus] = useState<ShipmentStatus>("processing");
//   const [note, setNote] = useState("");
//   const [departAt, setDepartAt] = useState("");
//   const [expectedDate, setExpectedDate] = useState("");
//   const [loadingOrders, setLoadingOrders] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [notification, setNotification] = useState<string | null>(null);

//   // Load đơn processing khi mở modal
//   useEffect(() => {
//     if (!open) return;
//     const fetchOrders = async () => {
//       try {
//         setLoadingOrders(true);
//         const allOrders = await orderService.getAllReceived();
//         const processingOrders = allOrders.filter(
//           (o) => o.status === "processing"
//         );
//         setOrders(processingOrders);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoadingOrders(false);
//       }
//     };
//     fetchOrders();
//   }, [open]);

//   // Nếu là sửa shipment, điền dữ liệu sẵn
//   useEffect(() => {
//     if (shipment) {
//       setSelectedOrder({
//         orderCode: shipment.orderCode,
//         toCompanyId: shipment.toCompanyId,
//         status: "processing",
//         products: shipment.batches.map((b) => ({
//           productCode: b.batchCode,
//           productQuantity: b.quantity,
//           batch: [{ batchCode: b.batchCode, quantity: b.quantity }],
//         })),
//       } as Order);
//       setBatches(shipment.batches);
//       setNote(shipment.note || "");
//       setDepartAt(shipment.departAt || "");
//       setExpectedDate(shipment.expectedDate || "");
//       setStatus(shipment.status || "processing");
//     } else {
//       setSelectedOrder(null);
//       setBatches([]);
//       setNote("");
//       setDepartAt("");
//       setExpectedDate("");
//       setStatus("processing");
//     }
//   }, [shipment]);

//   // Khi chọn đơn mới → lấy batch tự động
//   useEffect(() => {
//     if (!selectedOrder) return;
//     const mappedBatches: BatchItem[] = [];
//     selectedOrder.products?.forEach((p) => {
//       p.batch.forEach((b) => {
//         mappedBatches.push({
//           batchCode: b.batchCode,
//           quantity: b.quantity,
//         });
//       });
//     });
//     setBatches(mappedBatches);
//   }, [selectedOrder]);

//   useEffect(() => {
//   if (preselectedBatchCode && !shipment) {
//     const batch = batches?.find((b) => b.batchCode === preselectedBatchCode);
//     if (batch) {
//       setBatches([batch]);
//       setStatus("processing");
//     }
//   }
// }, [preselectedBatchCode, batches, shipment]);

//   const handleSubmit = async () => {
//   if (!selectedOrder) {
//     setNotification("⚠️ Vui lòng chọn đơn");
//     return;
//   }

//   setSubmitting(true);
//   try {
//     if (shipment) {
//       // 1. Cập nhật shipment
//       await axios.put("/api/shipment", {
//         shipmentId: shipment._id,
//         note,
//         departAt,
//         expectedDate,
//         status,
//       });

//       // 2. Nếu shipment chuyển sang delivering → update order luôn
//       if (status === "delivering") {
//         await orderService.update({
//   orderCode: selectedOrder.orderCode,
//   status: "delivering",
// });

//       }
//     } else {
//       // Tạo shipment mới
//       await axios.post("/api/shipment", {
//         orderCode: selectedOrder.orderCode,
//         batches,
//       });
//     }

//     setNotification("✅ Thao tác thành công");
//     onSubmitSuccess(); // callback để reload bảng, close modal...
//     onClose();
//   } catch (err: unknown) {
//     if (err instanceof Error) setNotification(err.message);
//     else setNotification("❌ Thao tác thất bại");
//     console.error(err);
//   } finally {
//     setSubmitting(false);
//   }
// };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box sx={modalStyle}>
//         <Typography variant="h6" mb={2}>
//           {shipment ? "Sửa Shipment" : "Tạo Shipment"}
//         </Typography>

//         {!shipment && (
//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel>Chọn đơn (Processing)</InputLabel>
//             <Select
//               value={selectedOrder?.orderCode || ""}
//               onChange={(e) => {
//                 const order = orders.find(
//                   (o) => o.orderCode === e.target.value
//                 );
//                 setSelectedOrder(order || null);
//               }}
//               disabled={loadingOrders || submitting}
//             >
//               {orders.map((o) => (
//                 <MenuItem key={o.orderCode} value={o.orderCode}>
//                   {o.orderCode} - {o.toCompanyId}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         )}

//         {selectedOrder && (
//           <>
//             <Typography variant="subtitle2">Batches</Typography>
//             {batches.map((b, i) => (
//               <Stack key={i} direction="row" spacing={1} mb={1}>
//                 <TextField
//                   label="Batch Code"
//                   value={b.batchCode}
//                   fullWidth
//                   disabled
//                 />
//                 <TextField
//                   label="Quantity"
//                   value={b.quantity}
//                   fullWidth
//                   disabled
//                 />
//               </Stack>
//             ))}
//           </>
//         )}

//         <TextField
//           fullWidth
//           label="Note"
//           value={note}
//           onChange={(e) => setNote(e.target.value)}
//           sx={{ mb: 2 }}
//         />
//         <TextField
//           fullWidth
//           label="Depart At"
//           type="datetime-local"
//           value={departAt}
//           onChange={(e) => setDepartAt(e.target.value)}
//           sx={{ mb: 2 }}
//           InputLabelProps={{ shrink: true }}
//         />
//         <TextField
//           fullWidth
//           label="Expected Date"
//           type="datetime-local"
//           value={expectedDate}
//           onChange={(e) => setExpectedDate(e.target.value)}
//           sx={{ mb: 2 }}
//           InputLabelProps={{ shrink: true }}
//         />
//         <FormControl fullWidth sx={{ mb: 2 }}>
//           <InputLabel>Status</InputLabel>
//           <Select
//             value={status}
//             onChange={(e) => setStatus(e.target.value as ShipmentStatus)}
//             disabled={submitting}
//           >
//             {statusOptions.map((s) => (
//               <MenuItem key={s} value={s}>
//                 {s}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <Button
//           variant="contained"
//           fullWidth
//           onClick={handleSubmit}
//           disabled={submitting}
//         >
//           {shipment ? "Cập nhật" : "Tạo"}
//         </Button>

//         <Snackbar
//           open={!!notification}
//           autoHideDuration={4000}
//           onClose={() => setNotification(null)}
//         >
//           <Alert severity={notification?.includes("⚠️") ? "warning" : "success"}>
//             {notification}
//           </Alert>
//         </Snackbar>

//         {loadingOrders && (
//           <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//             <CircularProgress />
//           </Box>
//         )}
//       </Box>
//     </Modal>
//   );
// };

// // ShipmentFormModalV2.tsx
// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Modal,
//   Typography,
//   Stack,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   TextField,
//   Snackbar,
//   Alert,
//   CircularProgress,
// } from "@mui/material";
// import { Order } from "@/types/order";
// import { Shipment, BatchItem, ShipmentStatus } from "@/types/shipment";
// import { orderService } from "@/services/orderService";
// import axios from "axios";

// const modalStyle = {
//   position: "absolute" as const,
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 600,
//   bgcolor: "background.paper",
//   borderRadius: 2,
//   boxShadow: 24,
//   p: 4,
//   maxHeight: "90vh",
//   overflowY: "auto",
// };

// // interface ShipmentFormModalV2Props {
// //   open: boolean;
// //   shipment?: Shipment | null;
// //   preselectedBatch?: string | null;
// //   onClose: () => void;
// //   onSubmitSuccess: () => void;
// // }

// interface ShipmentFormModalV2Props {
//   open: boolean;
//   shipment?: Shipment | null;
//   preselectedBatch?: string | null;
//   onClose: () => void;
//   onSubmitSuccess: (shipment: Shipment) => void; // <-- sửa đây
// }

// const statusOptions: ShipmentStatus[] = [
//   "processing",
//   "delivering",
//   "delivered",
//   "goods_received",
//   "canceled",
// ];

// export const ShipmentFormModalV2: React.FC<ShipmentFormModalV2Props> = ({
//   open,
//   shipment,
//   preselectedBatch,
//   onClose,
//   onSubmitSuccess,
// }) => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [batches, setBatches] = useState<BatchItem[]>([]);
//   const [status, setStatus] = useState<ShipmentStatus>("processing");
//   const [note, setNote] = useState("");
//   const [departAt, setDepartAt] = useState("");
//   const [expectedDate, setExpectedDate] = useState("");
//   const [loadingOrders, setLoadingOrders] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [notification, setNotification] = useState<string | null>(null);

//   // Load orders processing
//   useEffect(() => {
//     if (!open) return;
//     const fetchOrders = async () => {
//       setLoadingOrders(true);
//       try {
//         const allOrders = await orderService.getAllReceived();
//         const processingOrders = allOrders.filter(
//           (o) => o.status === "processing"
//         );
//         setOrders(processingOrders);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoadingOrders(false);
//       }
//     };
//     fetchOrders();
//   }, [open]);

//   // Init form if editing
//   useEffect(() => {
//     if (!open) return;
//     if (shipment) {
//       setSelectedOrder({
//         orderCode: shipment.orderCode,
//         toCompanyId: shipment.toCompanyId,
//         status: "processing",
//         products: shipment.batches.map((b) => ({
//           productCode: b.batchCode,
//           productQuantity: b.quantity,
//           batch: [{ batchCode: b.batchCode, quantity: b.quantity }],
//         })),
//       } as Order);
//       setBatches(shipment.batches);
//       setNote(shipment.note || "");
//       setDepartAt(shipment.departAt || "");
//       setExpectedDate(shipment.expectedDate || "");
//       setStatus(shipment.status || "processing");
//     } else {
//       setSelectedOrder(null);
//       setBatches([]);
//       setNote("");
//       setDepartAt("");
//       setExpectedDate("");
//       setStatus("processing");
//     }
//   }, [shipment, open]);

//   useEffect(() => {
//     if (!selectedOrder) return;
//     const mappedBatches: BatchItem[] = [];
//     selectedOrder.products?.forEach((p) => {
//       p.batch.forEach((b) =>
//         mappedBatches.push({ batchCode: b.batchCode, quantity: b.quantity })
//       );
//     });
//     setBatches(mappedBatches);
//   }, [selectedOrder]);

//   // Handle preselected batch
//   useEffect(() => {
//     if (preselectedBatch && !shipment) {
//       const batch = batches.find((b) => b.batchCode === preselectedBatch);
//       if (batch) setBatches([batch]);
//     }
//   }, [preselectedBatch, batches, shipment]);

//   // const handleSubmit = async () => {
//   //   if (!selectedOrder) {
//   //     setNotification("⚠️ Vui lòng chọn đơn");
//   //     return;
//   //   }

//   //   setSubmitting(true);
//   //   try {
//   //     if (shipment) {
//   //       await axios.put("/api/shipment", {
//   //         shipmentId: shipment._id,
//   //         note,
//   //         departAt,
//   //         expectedDate,
//   //         status,
//   //       });

//   //       // Tự động update order nếu delivering
//   //       if (status === "delivering") {
//   //         await orderService.update({
//   //           orderCode: selectedOrder.orderCode,
//   //           status: "delivering",
//   //         });
//   //       }
//   //     } else {
//   //       await axios.post("/api/shipment", {
//   //         orderCode: selectedOrder.orderCode,
//   //         batches,
//   //         note,
//   //         departAt,
//   //         expectedDate,
//   //         status,
//   //       });
//   //     }

//   //     setNotification("✅ Thao tác thành công");
//   //     onSubmitSuccess();
//   //     onClose();
//   //   } catch (err: unknown) {
//   //     if (err instanceof Error) setNotification(err.message);
//   //     else setNotification("❌ Thao tác thất bại");
//   //     console.error(err);
//   //   } finally {
//   //     setSubmitting(false);
//   //   }
//   // };

//   const handleSubmit = async () => {
//     if (!selectedOrder) {
//       setNotification("⚠️ Vui lòng chọn đơn");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       let updatedShipment: Shipment;

//       if (shipment) {
//         await axios.put("/api/shipment", {
//           shipmentId: shipment._id,
//           note,
//           departAt,
//           expectedDate,
//           status,
//         });

//         if (status === "delivering") {
//           await orderService.update({
//             orderCode: selectedOrder.orderCode,
//             status: "delivering",
//           });
//         }

//         updatedShipment = {
//           _id: shipment._id,
//           shipCode: shipment.shipCode,
//           orderCode: selectedOrder.orderCode,
//           fromCompanyId: shipment.fromCompanyId, // thêm đây
//           toCompanyId: selectedOrder.toCompanyId, // đã có
//           batches,
//           note,
//           departAt,
//           expectedDate,
//           status,
//         };
//       } else {
//         const res = await axios.post("/api/shipment", {
//           orderCode: selectedOrder.orderCode,
//           batches,
//           note,
//           departAt,
//           expectedDate,
//           status,
//         });

//         updatedShipment = {
//           _id: res.data._id,
//           shipCode: res.data.shipCode || "AUTO",
//           orderCode: selectedOrder.orderCode,
//           fromCompanyId: res.data.fromCompanyId || "MY_COMPANY_ID", // backend hoặc mặc định
//           toCompanyId: selectedOrder.toCompanyId,
//           batches,
//           note,
//           departAt,
//           expectedDate,
//           status,
//         };
//       }

//       setNotification("✅ Thao tác thành công");
//       onSubmitSuccess(updatedShipment);
//       onClose();
//     } catch (err: unknown) {
//       if (err instanceof Error) setNotification(err.message);
//       else setNotification("❌ Thao tác thất bại");
//       console.error(err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box sx={modalStyle}>
//         <Typography variant="h6" mb={2}>
//           {shipment ? "Sửa Shipment" : "Tạo Shipment"}
//         </Typography>

//         {!shipment && (
//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel>Chọn đơn (Processing)</InputLabel>
//             <Select
//               value={selectedOrder?.orderCode || ""}
//               onChange={(e) => {
//                 const order = orders.find(
//                   (o) => o.orderCode === e.target.value
//                 );
//                 setSelectedOrder(order || null);
//               }}
//               disabled={loadingOrders || submitting}
//             >
//               {orders.map((o) => (
//                 <MenuItem key={o.orderCode} value={o.orderCode}>
//                   {o.orderCode} - {o.toCompanyId}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         )}

//         {selectedOrder && (
//           <>
//             <Typography variant="subtitle2">Batches</Typography>
//             {batches.map((b, i) => (
//               <Stack key={i} direction="row" spacing={1} mb={1}>
//                 <TextField
//                   label="Batch Code"
//                   value={b.batchCode}
//                   fullWidth
//                   disabled
//                 />
//                 <TextField
//                   label="Quantity"
//                   value={b.quantity}
//                   fullWidth
//                   disabled
//                 />
//               </Stack>
//             ))}
//           </>
//         )}

//         <TextField
//           fullWidth
//           label="Note"
//           value={note}
//           onChange={(e) => setNote(e.target.value)}
//           sx={{ mb: 2 }}
//         />
//         <TextField
//           fullWidth
//           label="Depart At"
//           type="datetime-local"
//           value={departAt}
//           onChange={(e) => setDepartAt(e.target.value)}
//           sx={{ mb: 2 }}
//           InputLabelProps={{ shrink: true }}
//         />
//         <TextField
//           fullWidth
//           label="Expected Date"
//           type="datetime-local"
//           value={expectedDate}
//           onChange={(e) => setExpectedDate(e.target.value)}
//           sx={{ mb: 2 }}
//           InputLabelProps={{ shrink: true }}
//         />

//         <FormControl fullWidth sx={{ mb: 2 }}>
//           <InputLabel>Status</InputLabel>
//           <Select
//             value={status}
//             onChange={(e) => setStatus(e.target.value as ShipmentStatus)}
//             disabled={submitting}
//           >
//             {statusOptions.map((s) => (
//               <MenuItem key={s} value={s}>
//                 {s}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <Button
//           variant="contained"
//           fullWidth
//           onClick={handleSubmit}
//           disabled={submitting}
//         >
//           {shipment ? "Cập nhật" : "Tạo"}
//         </Button>

//         <Snackbar
//           open={!!notification}
//           autoHideDuration={4000}
//           onClose={() => setNotification(null)}
//         >
//           <Alert
//             severity={notification?.includes("⚠️") ? "warning" : "success"}
//           >
//             {notification}
//           </Alert>
//         </Snackbar>

//         {loadingOrders && (
//           <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//             <CircularProgress />
//           </Box>
//         )}
//       </Box>
//     </Modal>
//   );
// };

// // ShipmentFormModalV2.tsx
// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Modal,
//   Typography,
//   Stack,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   TextField,
//   Snackbar,
//   Alert,
//   CircularProgress,
// } from "@mui/material";
// import { Order } from "@/types/order";
// import { Shipment, BatchItem, ShipmentStatus, CreateShipmentRequest, UpdateShipmentRequest } from "@/types/shipment";
// import { orderService } from "@/services/orderService";
// import { useCreateShipment, useUpdateShipment } from "@/hooks/database/useShipment";

// const modalStyle = {
//   position: "absolute" as const,
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 600,
//   bgcolor: "background.paper",
//   borderRadius: 2,
//   boxShadow: 24,
//   p: 4,
//   maxHeight: "90vh",
//   overflowY: "auto",
// };

// interface ShipmentFormModalV2Props {
//   open: boolean;
//   shipment?: Shipment | null;
//   preselectedBatch?: string | null;
//   onClose: () => void;
//   onSubmitSuccess: (shipment: Shipment) => void;
// }

// const statusOptions: ShipmentStatus[] = [
//   "processing",
//   "delivering",
//   "delivered",
//   "goods_received",
//   "canceled",
// ];

// export const ShipmentFormModalV2: React.FC<ShipmentFormModalV2Props> = ({
//   open,
//   shipment,
//   preselectedBatch,
//   onClose,
//   onSubmitSuccess,
// }) => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [batches, setBatches] = useState<BatchItem[]>([]);
//   const [status, setStatus] = useState<ShipmentStatus>("processing");
//   const [note, setNote] = useState("");
//   const [departAt, setDepartAt] = useState("");
//   const [expectedDate, setExpectedDate] = useState("");
//   const [loadingOrders, setLoadingOrders] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [notification, setNotification] = useState<string | null>(null);

//   const createShipmentMutation = useCreateShipment();
//   const updateShipmentMutation = useUpdateShipment();

//   // Load orders processing
//   useEffect(() => {
//     if (!open) return;
//     const fetchOrders = async () => {
//       setLoadingOrders(true);
//       try {
//         const allOrders = await orderService.getAllReceived();
//         setOrders(allOrders.filter((o) => o.status === "processing"));
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoadingOrders(false);
//       }
//     };
//     fetchOrders();
//   }, [open]);

//   // Init form if editing
//   useEffect(() => {
//     if (!open) return;
//     if (shipment) {
//       setSelectedOrder({
//         orderCode: shipment.orderCode,
//         toCompanyId: shipment.toCompanyId,
//         status: "processing",
//         products: shipment.batches.map((b) => ({
//           productCode: b.batchCode,
//           productQuantity: b.quantity,
//           batch: [{ batchCode: b.batchCode, quantity: b.quantity }],
//         })),
//       } as Order);
//       setBatches(shipment.batches);
//       setNote(shipment.note || "");
//       setDepartAt(shipment.departAt || "");
//       setExpectedDate(shipment.expectedDate || "");
//       setStatus(shipment.status || "processing");
//     } else {
//       setSelectedOrder(null);
//       setBatches([]);
//       setNote("");
//       setDepartAt("");
//       setExpectedDate("");
//       setStatus("processing");
//     }
//   }, [shipment, open]);

//   useEffect(() => {
//     if (!selectedOrder) return;
//     const mappedBatches: BatchItem[] = [];
//     selectedOrder.products?.forEach((p) => {
//       p.batch.forEach((b) =>
//         mappedBatches.push({ batchCode: b.batchCode, quantity: b.quantity })
//       );
//     });
//     setBatches(mappedBatches);
//   }, [selectedOrder]);

//   // Handle preselected batch
//   useEffect(() => {
//     if (preselectedBatch && !shipment) {
//       const batch = batches.find((b) => b.batchCode === preselectedBatch);
//       if (batch) setBatches([batch]);
//     }
//   }, [preselectedBatch, batches, shipment]);

//   // const handleSubmit = async () => {
//   //   if (!selectedOrder) {
//   //     setNotification("⚠️ Vui lòng chọn đơn");
//   //     return;
//   //   }

//   //   setSubmitting(true);
//   //   try {
//   //     let updatedShipment: Shipment;

//   //     if (shipment) {
//   //       await updateShipmentMutation.mutateAsync({
//   //         shipmentId: shipment._id,
//   //         note,
//   //         departAt,
//   //         // expectedDate,
//   //         status,
//   //       });

//   //       if (status === "delivering") {
//   //         await orderService.update({
//   //           orderCode: selectedOrder.orderCode,
//   //           status: "delivering",
//   //         });
//   //       }

//   //       updatedShipment = {
//   //         _id: shipment._id,
//   //         shipCode: shipment.shipCode,
//   //         orderCode: selectedOrder.orderCode,
//   //         fromCompanyId: shipment.fromCompanyId,
//   //         toCompanyId: selectedOrder.toCompanyId,
//   //         batches,
//   //         note,
//   //         departAt,
//   //         expectedDate,
//   //         status,
//   //       };
//   //     } else {
//   //       const res = await createShipmentMutation.mutateAsync({
//   //         orderCode: selectedOrder.orderCode,
//   //         batches,
//   //         note,
//   //         departAt,
//   //         expectedDate,
//   //         status,
//   //       });

//   //       updatedShipment = {
//   //         _id: res._id,
//   //         shipCode: res.shipCode || "AUTO",
//   //         orderCode: selectedOrder.orderCode,
//   //         fromCompanyId: res.fromCompanyId || "MY_COMPANY_ID",
//   //         toCompanyId: selectedOrder.toCompanyId,
//   //         batches,
//   //         note,
//   //         departAt,
//   //         expectedDate,
//   //         status,
//   //       };
//   //     }

//   //     setNotification("✅ Thao tác thành công");
//   //     onSubmitSuccess(updatedShipment);
//   //     onClose();
//   //   } catch (err: unknown) {
//   //     if (err instanceof Error) setNotification(err.message);
//   //     else setNotification("❌ Thao tác thất bại");
//   //     console.error(err);
//   //   } finally {
//   //     setSubmitting(false);
//   //   }
//   // };

//   const handleSubmit = async () => {
//   if (!selectedOrder) {
//     setNotification("⚠️ Vui lòng chọn đơn");
//     return;
//   }

//   setSubmitting(true);
//   try {
//     let updatedShipment: Shipment;

//     if (shipment) {
//       // --- UPDATE ---
//       await updateShipmentMutation.mutateAsync({
//         shipmentId: shipment._id,
//         note,
//         departAt,
//         expectedDate,
//         status,
//       } as UpdateShipmentRequest);

//       // Nếu trạng thái là delivering, update order luôn
//       if (status === "delivering") {
//         await orderService.update({
//           orderCode: selectedOrder.orderCode,
//           status: "delivering",
//         });
//       }

//       // Tạo object frontend
//       updatedShipment = {
//         ...shipment,
//         orderCode: selectedOrder.orderCode,
//         batches,
//         note,
//         departAt,
//         expectedDate,
//         status,
//       };
//     } else {
//       // --- CREATE ---
//       // Chỉ gửi những field backend yêu cầu
//       const res = await createShipmentMutation.mutateAsync({
//         orderCode: selectedOrder.orderCode,
//         batches,
//       } as CreateShipmentRequest);

//       // Merge các field local cho frontend
//       updatedShipment = {
//         _id: res._id, // backend trả về _id
//         shipCode: res.shipCode || "AUTO",
//         orderCode: selectedOrder.orderCode,
//         fromCompanyId: res.fromCompanyId || "MY_COMPANY_ID",
//         toCompanyId: selectedOrder.toCompanyId,
//         batches,
//         note,
//         departAt,
//         expectedDate,
//         status,
//       };
//     }

//     setNotification("✅ Thao tác thành công");
//     onSubmitSuccess(updatedShipment);
//     onClose();
//   } catch (err: unknown) {
//     if (err instanceof Error) setNotification(err.message);
//     else setNotification("❌ Thao tác thất bại");
//     console.error(err);
//   } finally {
//     setSubmitting(false);
//   }
// };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box sx={modalStyle}>
//         <Typography variant="h6" mb={2}>
//           {shipment ? "Sửa Shipment" : "Tạo Shipment"}
//         </Typography>

//         {!shipment && (
//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel>Chọn đơn (Processing)</InputLabel>
//             <Select
//               value={selectedOrder?.orderCode || ""}
//               onChange={(e) => {
//                 const order = orders.find((o) => o.orderCode === e.target.value);
//                 setSelectedOrder(order || null);
//               }}
//               disabled={loadingOrders || submitting}
//             >
//               {orders.map((o) => (
//                 <MenuItem key={o.orderCode} value={o.orderCode}>
//                   {o.orderCode} - {o.toCompanyId}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         )}

//         {selectedOrder && (
//           <>
//             <Typography variant="subtitle2">Batches</Typography>
//             {batches.map((b, i) => (
//               <Stack key={i} direction="row" spacing={1} mb={1}>
//                 <TextField label="Batch Code" value={b.batchCode} fullWidth disabled />
//                 <TextField label="Quantity" value={b.quantity} fullWidth disabled />
//               </Stack>
//             ))}
//           </>
//         )}

//         <TextField fullWidth label="Note" value={note} onChange={(e) => setNote(e.target.value)} sx={{ mb: 2 }} />
//         <TextField
//           fullWidth
//           label="Depart At"
//           type="datetime-local"
//           value={departAt}
//           onChange={(e) => setDepartAt(e.target.value)}
//           sx={{ mb: 2 }}
//           InputLabelProps={{ shrink: true }}
//         />
//         <TextField
//           fullWidth
//           label="Expected Date"
//           type="datetime-local"
//           value={expectedDate}
//           onChange={(e) => setExpectedDate(e.target.value)}
//           sx={{ mb: 2 }}
//           InputLabelProps={{ shrink: true }}
//         />

//         <FormControl fullWidth sx={{ mb: 2 }}>
//           <InputLabel>Status</InputLabel>
//           <Select value={status} onChange={(e) => setStatus(e.target.value as ShipmentStatus)} disabled={submitting}>
//             {statusOptions.map((s) => (
//               <MenuItem key={s} value={s}>
//                 {s}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <Button variant="contained" fullWidth onClick={handleSubmit} disabled={submitting}>
//           {shipment ? "Cập nhật" : "Tạo"}
//         </Button>

//         <Snackbar open={!!notification} autoHideDuration={4000} onClose={() => setNotification(null)}>
//           <Alert severity={notification?.includes("⚠️") ? "warning" : "success"}>{notification}</Alert>
//         </Snackbar>

//         {loadingOrders && (
//           <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//             <CircularProgress />
//           </Box>
//         )}
//       </Box>
//     </Modal>
//   );
// };

// "use client";
"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Order } from "@/types/order";
import {
  Shipment,
  BatchItem,
  ShipmentStatus,
  CreateShipmentRequest,
  UpdateShipmentRequest,
} from "@/types/shipment";
import { orderService } from "@/services/orderService";
import {
  useCreateShipment,
  useUpdateShipment,
} from "@/hooks/database/useShipment";
import { shipmentContractService } from "@/services/contract/shipmentContract"; // ✅ Đảm bảo import đúng file mới
import { supabase } from "@/lib/supabaseClient";
import { ethers } from "ethers";

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: "90vh",
  overflowY: "auto",
};

interface ShipmentFormModalV2Props {
  open: boolean;
  shipment?: Shipment | null;
  preselectedBatch?: string | null;
  onClose: () => void;
  onSubmitSuccess: (shipment: Shipment) => void;
}

const statusOptions: ShipmentStatus[] = [
  "processing",
  "delivering",
  "delivered",
  "goods_received",
  "canceled",
];

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (...args: unknown[]) => void;
  removeListener?: (...args: unknown[]) => void;
}

export const ShipmentFormModalV2: React.FC<ShipmentFormModalV2Props> = ({
  open,
  shipment,
  preselectedBatch,
  onClose,
  onSubmitSuccess,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [status, setStatus] = useState<ShipmentStatus>("processing");
  const [note, setNote] = useState("");
  const [departAt, setDepartAt] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverPhoneNumber, setDriverPhoneNumber] = useState("");
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const createShipmentMutation = useCreateShipment();
  const updateShipmentMutation = useUpdateShipment();

  // Load danh sách đơn hàng đang processing
  useEffect(() => {
    if (!open) return;
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const allOrders = await orderService.getAllReceived();
        setOrders(allOrders.filter((o) => o.status === "processing"));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [open]);

  // Khi mở modal edit
  useEffect(() => {
    if (!open) return;

    if (shipment) {
      setSelectedOrder({
        orderCode: shipment.orderCode,
        toCompanyId: shipment.toCompanyId,
        status: "processing",
        products: shipment.batches.map((b) => ({
          productCode: b.batchCode,
          productQuantity: b.quantity,
          batch: [{ batchCode: b.batchCode, quantity: b.quantity }],
        })),
      } as Order);

      setBatches(shipment.batches);
      setNote(shipment.note || "");
      setDepartAt(shipment.departAt || "");
      setExpectedDate(shipment.expectedDate || "");
      setVehiclePlateNumber(shipment.vehiclePlateNumber || "");
      setDriverName(shipment.driverName || "");
      setDriverPhoneNumber(shipment.driverPhoneNumber || "");
      setStatus(shipment.status || "processing");
    } else {
      setSelectedOrder(null);
      setBatches([]);
      setNote("");
      setDepartAt("");
      setExpectedDate("");
      setVehiclePlateNumber("");
      setDriverName("");
      setDriverPhoneNumber("");
      setStatus("processing");
    }
  }, [shipment, open]);

  // Map batches theo selected order
  useEffect(() => {
    if (!selectedOrder) return;
    const mapped: BatchItem[] = [];
    selectedOrder.products?.forEach((p) =>
      p.batch.forEach((b) =>
        mapped.push({ batchCode: b.batchCode, quantity: b.quantity })
      )
    );
    setBatches(mapped);
  }, [selectedOrder]);

  useEffect(() => {
  if (preselectedBatch && selectedOrder) {
    const foundBatch = selectedOrder.products
      .flatMap((p) => p.batch)
      .find((b) => b.batchCode === preselectedBatch);

    if (foundBatch) {
      setBatches([{ batchCode: foundBatch.batchCode, quantity: foundBatch.quantity }]);
    }
  }
}, [preselectedBatch, selectedOrder]);

  const formatDateTime = (input: string) => {
    if (!input) return "";
    return input.replace("T", " ").slice(0, 16);
  };

  const handleSubmit = async () => {
    if (!selectedOrder) return setNotification("⚠️ Vui lòng chọn đơn");
    if (batches.length === 0)
      return setNotification("⚠️ Đơn chưa có batch nào");

    setSubmitting(true);
    try {
      let updatedShipment: Shipment;

      if (shipment) {
        // --- UPDATE ---
        const payload: UpdateShipmentRequest = {
          shipmentId: shipment._id,
          note,
          departAt: formatDateTime(departAt),
          expectedDate: formatDateTime(expectedDate),
          status,
          vehiclePlateNumber,
          driverName,
          driverPhoneNumber,
        };

        await updateShipmentMutation.mutateAsync(payload);
        updatedShipment = { ...shipment, ...payload };
      } else {
        // --- CREATE ---
        const payload: CreateShipmentRequest = {
          orderCode: selectedOrder.orderCode,
          batches,
          note,
          departAt: formatDateTime(departAt),
          expectedDate: formatDateTime(expectedDate),
          status,
          vehiclePlateNumber,
          driverName,
          driverPhoneNumber,
        };

        const res = await createShipmentMutation.mutateAsync(payload);

        // Ghi vào Supabase
        for (const batch of batches) {
          await supabase.from("shipments_onchain").insert({
            shipment_id: res._id,
            ship_code: res.shipCode,
            batch_code: batch.batchCode,
            quantity_batch: batch.quantity,
            from_company_id: res.fromCompanyId,
            to_company_id: selectedOrder.toCompanyId,
            vehicle_plate_number: vehiclePlateNumber,
            driver_name: driverName,
            driver_phone_number: driverPhoneNumber,
            note,
            onchain_status: "pending",
          });
        }

        // --- GỌI ONCHAIN (FULL) ---
        const provider = new ethers.BrowserProvider(
          (window as { ethereum: EthereumProvider }).ethereum
        );

        const signer = await provider.getSigner();

        for (const batch of batches) {
          if (!res.fromCompanyId || !selectedOrder.toCompanyId) continue;

          await shipmentContractService.createShipment(signer, {
            shipCode: res.shipCode,
            batchCode: batch.batchCode,
            quantityBatch: batch.quantity,
            fromCompanyId: res.fromCompanyId,
            toCompanyId: selectedOrder.toCompanyId,
            vehiclePlateNumber,
            driverName,
            driverPhoneNumber,
            note,
            receivingTime: Date.now(),
          });
        }

        updatedShipment = {
          _id: res._id,
          shipCode: res.shipCode,
          orderCode: selectedOrder.orderCode,
          fromCompanyId: res.fromCompanyId,
          toCompanyId: selectedOrder.toCompanyId,
          batches,
          note,
          departAt: payload.departAt,
          expectedDate: payload.expectedDate,
          status,
          vehiclePlateNumber,
          driverName,
          driverPhoneNumber,
        };
      }

      setNotification("✅ Lưu shipment thành công");
      onSubmitSuccess(updatedShipment);
      onClose();
    } catch (err) {
      console.error(err);
      setNotification("❌ Thao tác thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          {shipment ? "Sửa Shipment" : "Tạo Shipment"}
        </Typography>

        {/* Select Order */}
        {!shipment && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Chọn đơn (Processing)</InputLabel>
            <Select
              value={selectedOrder?.orderCode || ""}
              onChange={(e) => {
                const order = orders.find(
                  (o) => o.orderCode === e.target.value
                );
                setSelectedOrder(order || null);
              }}
              disabled={loadingOrders || submitting}
            >
              {orders.map((o) => (
                <MenuItem key={o.orderCode} value={o.orderCode}>
                  {o.orderCode} - {o.toCompanyId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Batches */}
        {selectedOrder && (
          <>
            <Typography variant="subtitle2">Batches</Typography>
            {batches.map((b, i) => (
              <Stack key={i} direction="row" spacing={1} mb={1}>
                <TextField
                  label="Batch Code"
                  value={b.batchCode}
                  fullWidth
                  disabled
                />
                <TextField
                  label="Quantity"
                  value={b.quantity}
                  fullWidth
                  disabled
                />
              </Stack>
            ))}
          </>
        )}

        <TextField
          fullWidth
          label="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Depart At"
          type="datetime-local"
          value={departAt}
          onChange={(e) => setDepartAt(e.target.value)}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          label="Expected Date"
          type="datetime-local"
          value={expectedDate}
          onChange={(e) => setExpectedDate(e.target.value)}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          label="Biển số xe"
          value={vehiclePlateNumber}
          onChange={(e) => setVehiclePlateNumber(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Tên tài xế"
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="SĐT tài xế"
          value={driverPhoneNumber}
          onChange={(e) => setDriverPhoneNumber(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as ShipmentStatus)}
            disabled={submitting}
          >
            {statusOptions.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={submitting}
        >
          {shipment ? "Cập nhật" : "Tạo"}
        </Button>

        <Snackbar
          open={!!notification}
          autoHideDuration={4000}
          onClose={() => setNotification(null)}
        >
          <Alert
            severity={
              notification?.includes("⚠️")
                ? "warning"
                : notification?.includes("❌")
                ? "error"
                : "success"
            }
          >
            {notification}
          </Alert>
        </Snackbar>

        {loadingOrders && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Modal>
  );
};
