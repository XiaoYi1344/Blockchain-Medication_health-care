"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Snackbar, Alert, Box, Typography, Stack } from "@mui/material";

interface Notification {
  id: string;
  title: string;
  message: string;
  order_code?: string;
  created_at?: string;
}

export const NotificationsListener: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toast, setToast] = useState<Notification | null>(null);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) console.error(error);
    else if (data) setNotifications(data as Notification[]);
  };

  useEffect(() => {
    fetchNotifications();

    // --- Realtime subscription bằng channel ---
    const channel = supabase.channel("public:notifications");

    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
      },
      (payload) => {
        const newNoti = payload.new as Notification;
        setNotifications((prev) => [newNoti, ...prev]);
        setToast(newNoti);
      }
    );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Box>
      <Stack spacing={1} mb={2}>
        {notifications.map((noti) => (
          <Box
            key={noti.id}
            sx={{
              p: 1,
              border: "1px solid #ddd",
              borderRadius: 1,
              bgcolor: "#f9f9f9",
            }}
          >
            <Typography variant="subtitle2">{noti.title}</Typography>
            <Typography variant="body2">{noti.message}</Typography>
            {noti.order_code && (
              <Typography variant="caption">Order: {noti.order_code}</Typography>
            )}
          </Box>
        ))}
      </Stack>

      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
      >
        <Alert severity="info">
          {toast?.title ? `${toast.title}: ${toast.message}` : toast?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
