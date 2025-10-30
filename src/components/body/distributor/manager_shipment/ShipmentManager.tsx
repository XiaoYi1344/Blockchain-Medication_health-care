// src/app/(dashboard)/shipment/ShipmentManagerPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Box, Divider, Typography, CircularProgress } from "@mui/material";
import { ShipmentTable } from "./widget/ShipmentTable";
import { ShipmentFormModalV2 } from "./widget/ShipmentFormModal";
import { ShipmentOnChainList } from "./widget/ShipmentOnChainList";
import { Shipment } from "@/types/shipment";
import { useShipmentsByCompany } from "@/hooks/database/useShipment";
import { useShipmentsOnChain } from "@/hooks/contract/useShipmentOnChain";

export const ShipmentManagerPage: React.FC = () => {
  // ===========================
  // BE Shipments
  // ===========================
  const {
    data: shipmentsData = [],
    isLoading: isLoadingShipments,
    refetch: refetchShipments,
  } = useShipmentsByCompany();

  // ===========================
  // On-chain Shipments
  // ===========================
  const {
    data: onChainShipments = [],
    isLoading: isLoadingOnChain,
    refetch: refetchOnChain,
  } = useShipmentsOnChain();

  // ===========================
  // Local State
  // ===========================
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [preselectedBatchCode, setPreselectedBatchCode] = useState<string | null>(null);

  // Đồng bộ dữ liệu từ BE
  useEffect(() => {
    setShipments(shipmentsData);
  }, [shipmentsData]);

  // ===========================
  // Handlers
  // ===========================
  // const handleCreate = (batchCode?: string) => {
  //   setEditingShipment(null);
  //   setPreselectedBatchCode(batchCode || null);
  //   setOpenForm(true);
  // };

  // const handleEdit = (shipment: Shipment) => {
  //   setEditingShipment(shipment);
  //   setPreselectedBatchCode(null);
  //   setOpenForm(true);
  // };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingShipment(null);
    setPreselectedBatchCode(null);
  };

  const handleSubmitSuccess = (updatedShipment: Shipment) => {
    // Cập nhật local để tránh reload lại toàn bộ
    setShipments((prev) => {
      const exist = prev.find((s) => s._id === updatedShipment._id);
      if (exist)
        return prev.map((s) => (s._id === updatedShipment._id ? updatedShipment : s));
      else return [updatedShipment, ...prev];
    });

    setOpenForm(false);
    refetchShipments(); // làm mới BE
  };

  // ===========================
  // Render
  // ===========================
  if (isLoadingShipments) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2} fontWeight="bold">
        🚚 Quản lý chuyến vận chuyển
      </Typography>

      {/* Danh sách Shipment từ BE */}
      {/* <ShipmentTable
        shipments={shipments}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onUpdateShipments={setShipments}
      /> */}
      <ShipmentTable
  shipments={shipments}
  onUpdateShipments={setShipments}
/>


      {/* Modal form thêm / sửa shipment */}
      <ShipmentFormModalV2
        open={openForm}
        shipment={editingShipment}
        preselectedBatch={preselectedBatchCode}
        onClose={handleCloseForm}
        onSubmitSuccess={handleSubmitSuccess}
      />

      <Divider sx={{ my: 4 }} />

      {/* Danh sách On-chain */}
      <Box>
        <Typography variant="h6" mb={1}>
          🌐 Danh sách Shipment On-chain
        </Typography>
        {isLoadingOnChain ? (
          <Box display="flex" justifyContent="center" mt={3}>
            <CircularProgress />
          </Box>
        ) : (
          <ShipmentOnChainList data={onChainShipments} onRefresh={refetchOnChain} />
        )}
      </Box>
    </Box>
  );
};
