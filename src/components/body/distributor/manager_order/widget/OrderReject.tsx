// "use client";
// import {
//   Modal, Box, Typography, Table, TableRow, TableHead, TableBody, TableCell,
// } from "@mui/material";
// import { useReceivedOrders } from "@/hooks/database/useOrders";

// export default function RejectedOrdersModal({ open, onClose }: any) {
//   const { data: orders = [] } = useReceivedOrders();
//   const rejected = orders.filter((o) => o.status === "rejected");

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box sx={{ p: 3, bgcolor: "background.paper", m: "auto", mt: 10, width: 600, borderRadius: 2 }}>
//         <Typography variant="h6" mb={2}>Đơn hàng bị từ chối</Typography>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Mã đơn</TableCell>
//               <TableCell>Sản phẩm</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rejected.map((o) => (
//               <TableRow key={o.orderCode}>
//                 <TableCell>{o.orderCode}</TableCell>
//                 <TableCell>{o.products.map((p: any) => p.productCode).join(", ")}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Box>
//     </Modal>
//   );
// }
