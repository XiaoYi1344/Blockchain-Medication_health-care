"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Stack,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useBatches } from "@/hooks/database/useBatch";
import { useEntityPermission } from "@/hooks/database/useEntityPermission";
import { BatchModal, Batch } from "./BatchForm";
import { supabase } from "@/lib/supabaseClient";

interface ApprovedBatchesTableProps {
  onView: (batchCode: string) => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  order_code?: string;
  created_at?: string;
  read?: boolean;
}

export const ApprovedBatchesTable: React.FC<ApprovedBatchesTableProps> = ({
  onView,
}) => {
  const { data: batches, isLoading } = useBatches();
  const { canRead, canEdit, canApprove, canCreate } =
    useEntityPermission("batch");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<
    "create" | "update" | "updateState"
  >("create");
  const [selectedBatch, setSelectedBatch] = useState<Batch | undefined>();

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toast, setToast] = useState<Notification | null>(null);

  // 🧭 Fetch unread notifications
  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("read", false)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) console.error("[fetchNotifications]", error);
    else if (data) setNotifications(data as Notification[]);
  };

  // ✅ Mark notification as read and hide it locally
  const markNotificationAsRead = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);

    if (error) {
      console.error("[markNotificationAsRead]", error);
      return;
    }

    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // ✅ Listen for realtime new notifications
  useEffect(() => {
    const channel = supabase.channel("public:notifications");

    channel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications" },
      (payload) => {
        const newNoti = payload.new as Notification;
        if (newNoti.read) return;

        setNotifications((prev) => {
          if (prev.some((n) => n.id === newNoti.id)) return prev;
          return [newNoti, ...prev].slice(0, 10);
        });

        // 🔔 Show toast only for shortage warning
        if (newNoti.message?.toLowerCase().includes("thiếu")) {
          setToast(newNoti);
        }
      }
    );

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        console.log("✅ Subscribed to realtime notifications");
        await fetchNotifications();
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!canRead) return null;

  const approvedBatches = batches?.filter((b) => b.state !== "DRAFT");

  const handleOpenModal = (
    mode: "create" | "update" | "updateState",
    batch?: Batch
  ) => {
    setModalMode(mode);
    setSelectedBatch(batch);
    setModalOpen(true);
  };

  const isBatchNotified = (batchCode: string) =>
    notifications.some((n) => n.message?.includes(batchCode));

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {canCreate && (
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenModal("create")}
          >
            Thêm lô
          </Button>
        </Box>
      )}

      {/* 🔔 Notification list */}
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          🔔 Thông báo gần đây
        </Typography>
        <Stack spacing={1}>
          {notifications.length > 0 ? (
            notifications.map((noti) => (
              <Box
                key={noti.id}
                sx={{
                  p: 1.5,
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  bgcolor: "#f9f9f9",
                  cursor: "pointer",
                }}
                onClick={() => markNotificationAsRead(noti.id)}
              >
                <Typography variant="subtitle2">{noti.title}</Typography>
                <Typography variant="body2">{noti.message}</Typography>
                {noti.order_code && (
                  <Typography variant="caption" color="text.secondary">
                    Order: {noti.order_code}
                  </Typography>
                )}
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Không có thông báo nào chưa đọc.
            </Typography>
          )}
        </Stack>
      </Box>

      {/* 🧾 Batch table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã lô</TableCell>
              <TableCell>Số lượng dự kiến</TableCell>
              <TableCell>Trạng thái</TableCell>
              {/* <TableCell>Ngày dự kiến</TableCell>
              <TableCell>Hạn sử dụng</TableCell> */}
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {approvedBatches?.map((batch) => (
              <TableRow
                key={batch.batchCode}
                hover
                sx={{
                  bgcolor: isBatchNotified(batch.batchCode)
                    ? "#fff3e0"
                    : "inherit",
                }}
              >
                <TableCell>{batch.batchCode}</TableCell>
                <TableCell>{batch.expectedQuantity ?? "-"}</TableCell>
                <TableCell>{batch.state}</TableCell>
                {/* <TableCell>{batch.estimatedDate ?? "-"}</TableCell>
                <TableCell>{batch.EXP ?? "-"}</TableCell> */}
                <TableCell align="center">
                  <Button size="small" onClick={() => onView(batch.batchCode)}>
                    Xem
                  </Button>

                  {canEdit && (
                    <Button
                      size="small"
                      sx={{ ml: 1 }}
                      color="success"
                      onClick={() =>
                        handleOpenModal("update", {
                          ...batch,
                          expectedQuantity: batch.expectedQuantity ?? 0,
                          estimatedDate: batch.estimatedDate ?? "",
                          EXP: batch.EXP ?? "",
                        })
                      }
                    >
                      Cập nhật lô
                    </Button>
                  )}

                  {canApprove && (
                    <Button
                      size="small"
                      sx={{ ml: 1 }}
                      color="info"
                      onClick={() =>
                        handleOpenModal("updateState", {
                          ...batch,
                          expectedQuantity: batch.expectedQuantity ?? 0,
                          estimatedDate: batch.estimatedDate ?? "",
                          EXP: batch.EXP ?? "",
                        })
                      }
                    >
                      Cập nhật trạng thái
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {!approvedBatches?.length && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có lô đã duyệt để hiển thị.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 🪟 Modal */}
      <BatchModal
        open={modalOpen}
        mode={modalMode}
        batch={selectedBatch}
        onClose={() => setModalOpen(false)}
      />

      {/* ⚠️ Toast shortage alert */}
      {toast && (
        <Snackbar
          open
          autoHideDuration={8000}
          onClose={() => setToast(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert severity="warning" variant="filled">
            ⚠️ {toast.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};
