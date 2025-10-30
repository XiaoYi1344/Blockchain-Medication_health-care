"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import { Order } from "@/types/order";
import UpdateOrderModal from "./OrderForm";

interface OrderTableWidgetProps {
  onSelectOrder?: (order: Order) => void;
}

export const OrderTableWidget: React.FC<OrderTableWidgetProps> = ({
  onSelectOrder,
}) => {
  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery<Order[], Error>({
    queryKey: ["ordersReceived"],
    queryFn: orderService.getAllReceived,
  });

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedOrderForUpdate, setSelectedOrderForUpdate] =
    useState<Order | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order: Order) => (
              <TableRow key={order.orderCode} hover>
                <TableCell>{order.orderCode}</TableCell>
                <TableCell>{order.toCompanyId}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedOrder(order);
                      onSelectOrder?.(order); 
                    }}
                  >
                    Xem
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ ml: 1 }}
                    onClick={() => {
                      setSelectedOrderForUpdate(order);
                      setUpdateModalOpen(true);
                    }}
                  >
                    Cập nhật
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal xem chi tiết sản phẩm */}
      <Dialog
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Chi tiết đơn hàng - {selectedOrder?.orderCode}
        </DialogTitle>
        <DialogContent dividers>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã sản phẩm</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Batch</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedOrder?.products.map((p) => (
                <TableRow key={p.productCode}>
                  <TableCell>{p.productCode}</TableCell>
                  <TableCell>{p.productQuantity}</TableCell>
                  <TableCell>
                    {p.batch.map((b) => (
                      <div key={b.batchCode}>
                        {b.batchCode} - {b.quantity}
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedOrder(null)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <UpdateOrderModal
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        order={selectedOrderForUpdate}
        onUpdateSuccess={() => refetch()}
      />
    </>
  );
};
