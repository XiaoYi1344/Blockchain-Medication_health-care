"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, Stop, Add, Edit } from "@mui/icons-material";
import { useEntityPermission } from "@/hooks/database/useEntityPermission";
import { Shipment } from "@/types/shipment";
import { ShipmentFormModalV2 } from "./ShipmentFormModal";
import { useStopShipment } from "@/hooks/database/useShipment";
import { useSyncShipmentToOrder } from "@/hooks/database/useSyncShipmentToOrder";

interface ShipmentTableProps {
  shipments: Shipment[];
  onUpdateShipments?: React.Dispatch<React.SetStateAction<Shipment[]>>;
}

export const ShipmentTable: React.FC<ShipmentTableProps> = ({
  shipments,
  onUpdateShipments,
}) => {
  const { canEdit, canDelete } = useEntityPermission("shipment");
  const stopShipment = useStopShipment();
  const syncShipmentToOrder = useSyncShipmentToOrder();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Mở modal cho Create hoặc Edit
  const openModalForShipment = (shipment?: Shipment) => {
    setSelectedShipment(shipment ?? null);
    setModalOpen(true);
  };

  // Cập nhật trạng thái shipment (local + prop)
  const updateShipmentStatus = (shipmentId: string, status: Shipment["status"]) => {
    if (onUpdateShipments) {
      onUpdateShipments((prev) =>
        prev.map((s) => (s._id === shipmentId ? { ...s, status } : s))
      );
    }
  };

  // Stop shipment (chuyển sang delivering)
  const handleStop = async (shipmentId?: string, orderCode?: string) => {
    if (!shipmentId || !canDelete) return;
    try {
      await stopShipment.mutateAsync(shipmentId);
      updateShipmentStatus(shipmentId, "delivering");

      if (orderCode) {
        await syncShipmentToOrder.mutateAsync({ orderCode, status: "delivering" });
      }
      setNotification("✅ Shipment và Order đã được cập nhật thành công");
    } catch (err: unknown) {
      if (err instanceof Error) setNotification(`❌ Cập nhật thất bại: ${err.message}`);
      else if (typeof err === "string") setNotification(`❌ Cập nhật thất bại: ${err}`);
      else setNotification("❌ Cập nhật thất bại: Lỗi không xác định");
      console.error(err);
    }
  };

  // Sau submit trong modal
  const handleSubmitSuccess = (updatedShipment: Shipment) => {
    if (onUpdateShipments) {
      onUpdateShipments((prev) => {
        const exist = prev.find((s) => s._id === updatedShipment._id);
        if (exist) return prev.map((s) => (s._id === updatedShipment._id ? updatedShipment : s));
        else return [updatedShipment, ...prev];
      });
    }
    setModalOpen(false);
  };

  // Helper render button + tooltip
  const ActionButton = ({
    title,
    icon,
    color,
    onClick,
    disabled = false,
  }: {
    title: string;
    icon: React.ReactNode;
    color: "primary" | "error";
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <Tooltip title={title}>
      <span>
        <IconButton size="small" color={color} onClick={onClick} disabled={disabled}>
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );

  return (
    <>
      <Box mb={2} display="flex" justifyContent="flex-end">
        <Button variant="contained" startIcon={<Add />} onClick={() => openModalForShipment()}>
          Tạo Shipment
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ship Code</TableCell>
              <TableCell>Order Code</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.map((s) => (
              <TableRow key={s._id}>
                <TableCell>{s.shipCode}</TableCell>
                <TableCell>{s.orderCode}</TableCell>
                <TableCell>{s.fromCompanyId}</TableCell>
                <TableCell>{s.toCompanyId}</TableCell>
                <TableCell>
                  <Chip
                    label={s.status}
                    color={
                      s.status === "processing"
                        ? "warning"
                        : s.status === "delivering"
                        ? "info"
                        : s.status === "delivered"
                        ? "success"
                        : s.status === "canceled"
                        ? "error"
                        : "default"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <ActionButton
                      title="Xem chi tiết"
                      icon={<Visibility />}
                      color="primary"
                      onClick={() => openModalForShipment(s)}
                    />
                    {canEdit && (
                      <ActionButton
                        title="Sửa"
                        icon={<Edit />}
                        color="primary"
                        onClick={() => openModalForShipment(s)}
                      />
                    )}
                    {canDelete && s.status === "processing" && (
                      <ActionButton
                        title="Chuyển Delivering"
                        icon={<Stop />}
                        color="error"
                        onClick={() => handleStop(s._id, s.orderCode)}
                      />
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ShipmentFormModalV2
        open={modalOpen}
        shipment={selectedShipment}
        onClose={() => setModalOpen(false)}
        onSubmitSuccess={handleSubmitSuccess}
      />

      <Snackbar
        open={!!notification}
        autoHideDuration={4000}
        onClose={() => setNotification(null)}
      >
        <Alert severity={notification?.includes("❌") ? "error" : "success"} sx={{ width: "100%" }}>
          {notification}
        </Alert>
      </Snackbar>
    </>
  );
};
