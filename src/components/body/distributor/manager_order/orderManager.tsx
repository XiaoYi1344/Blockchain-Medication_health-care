"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Button,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import { useReceivedOrders } from "@/hooks/database/useOrder";
import UpdateOrderModal from "./widget/OrderForm";
import { Order } from "@/types/order";
import { supabase } from "@/lib/supabaseClient";

interface Notification {
  id: string;
  title?: string;
  message: string;
  order_code?: string;
  created_at?: string;
}

export const OrderManager: React.FC = () => {
  const { data: orders, isLoading, refetch } = useReceivedOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const channel = supabase.channel("public:notifications");
    channel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications" },
      (payload) => {
        const newNoti = payload.new as Notification;
        setNotification(newNoti.message);
      }
    );
    channel.subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleOpenModal = (order: Order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleUpdateSuccess = async () => {
    await refetch();
  };

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Danh sách đơn hàng đã nhận
      </Typography>

      <Stack spacing={2}>
        
<Grid container spacing={2}>
  {orders?.map((order) => (
    <Grid key={order.orderCode} size={{ xs: 12, sm: 6, md: 4}}>
      <Card>
        <CardContent>
          <Typography>
            <b>OrderCode:</b> {order.orderCode}
          </Typography>
          <Typography>
            <b>Status:</b> {order.status}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 1 }}
            onClick={() => handleOpenModal(order)}
          >
            Cập nhật đơn hàng
          </Button>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>
        {!orders?.length && <Typography>Không có đơn hàng nào.</Typography>}
      </Stack>

      <UpdateOrderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        order={selectedOrder}
        onUpdateSuccess={handleUpdateSuccess}
      />

      <Snackbar
        open={!!notification}
        autoHideDuration={4000}
        onClose={() => setNotification(null)}
      >
        <Alert severity="info">{notification}</Alert>
      </Snackbar>
    </Box>
  );
};
