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
  Typography,
} from "@mui/material";
import { useLocations } from "@/hooks/database/useLocations";
import { Location } from "@/types/location";
import LocationFormModal from "./widget/LocationFormModal";
import InventoryModal from "./widget/InventoryModal";
import { useEntityPermission } from "@/hooks/database/useEntityPermission";

export const LocationTable: React.FC = () => {
  const [openForm, setOpenForm] = useState(false);
  const [openInventory, setOpenInventory] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  const { data: locations = [], isLoading } = useLocations(true);

  const locationPermission = useEntityPermission("location");

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {/* Nút Thêm kho */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => {
          setSelectedLocation(null);
          setOpenForm(true);
        }}
        disabled={!locationPermission.canCreate}
      >
        Thêm kho
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên kho</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((loc) => (
              <TableRow key={loc._id}>
                <TableCell>{loc.name}</TableCell>
                <TableCell>{loc.address || "Chưa có"}</TableCell>
                <TableCell>{loc.type}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setOpenForm(true);
                    }}
                    disabled={!locationPermission.canEdit}
                  >
                    Sửa
                  </Button>

                  <Button
                    variant="outlined"
                    color="warning"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setOpenInventory(true);
                    }}
                    disabled={!locationPermission.canRead}
                  >
                    Tồn kho
                  </Button>

                  <Button
                    variant="outlined"
                    color="info"
                    size="small"
                    onClick={() => {
                      setSelectedLocation(loc);
                      setOpenDetail(true);
                    }}
                    disabled={!locationPermission.canRead}
                  >
                    Xem chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal thêm/sửa kho */}
      {openForm && (
        <LocationFormModal
          location={selectedLocation}
          onClose={() => setOpenForm(false)}
        />
      )}

      {/* Modal tồn kho */}
      {openInventory && selectedLocation && (
        <InventoryModal
          location={selectedLocation}
          onClose={() => setOpenInventory(false)}
        />
      )}

      {/* Modal chi tiết kho */}
      {openDetail && selectedLocation && (
        <Dialog
          open
          onClose={() => setOpenDetail(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Chi tiết kho: {selectedLocation.name}</DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            <Typography>
              <strong>Địa chỉ:</strong> {selectedLocation.address || "Chưa có"}
            </Typography>
            <Typography>
              <strong>Loại kho:</strong> {selectedLocation.type}
            </Typography>
            <Typography>
              <strong>Điều kiện bảo quản:</strong>{" "}
              {selectedLocation.preservationCapability}
            </Typography>
            <Typography>
              <strong>Tối đa lô:</strong> {selectedLocation.maximum}
            </Typography>
            <Typography>
              <strong>Tồn kho hiện tại:</strong>{" "}
              {selectedLocation.currentQuantity || 0}
            </Typography>
            <Typography>
              <strong>Chỗ trồng:</strong>{" "}
              {selectedLocation.maximum -
                (selectedLocation.currentQuantity ?? 0)}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDetail(false)}>Đóng</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};
