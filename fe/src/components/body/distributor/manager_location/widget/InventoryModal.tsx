"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Location } from "@/types/location";
import { useInventory } from "@/hooks/database/useInventory";
import BatchFormModal from "./BatchFormModal";

interface Props {
  location: Location;
  onClose: () => void;
}

const InventoryModal: React.FC<Props> = ({ location, onClose }) => {
  const { data: inventoryLocations = [], isLoading } = useInventory();
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [inventoryId, setInventoryId] = useState<string | undefined>(undefined);
  const [openBatchForm, setOpenBatchForm] = useState(false);

  const inventoriesInLocation = useMemo(() => {
    const loc = inventoryLocations.find((loc) => loc.locationId === location._id);
    return loc?.inventories || [];
  }, [inventoryLocations, location._id]);

  const totalQuantity = useMemo(
    () => inventoriesInLocation.reduce((sum, inv) => sum + inv.currentQuantity, 0),
    [inventoriesInLocation]
  );

  if (isLoading) return <div>Loading...</div>;

  const openForm = (batchCode?: string, invId?: string) => {
    setSelectedBatch(batchCode ?? null);
    setInventoryId(invId);
    setOpenBatchForm(true);
  };

  return (
    <>
      <Dialog open onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Tồn kho: {location.name}</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            <strong>Tổng tồn kho hiện tại:</strong> {totalQuantity}
          </Typography>

          {/* Thêm tồn kho cho toàn kho */}
          <Button variant="contained" sx={{ mb: 2 }} onClick={() => openForm()}>
            Thêm tồn kho cho kho
          </Button>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Batch Code</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventoriesInLocation.map((inv) => (
                <TableRow key={inv.batchCode}>
                  <TableCell>{inv.batchCode}</TableCell>
                  <TableCell>{inv.currentQuantity}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => openForm(inv.batchCode, inv.inventoryId)}
                    >
                      Cập nhật tồn kho
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {openBatchForm && (
        <BatchFormModal
          batchCode={selectedBatch ?? undefined}
          inventoryId={inventoryId}
          locationId={location._id}
          onClose={() => setOpenBatchForm(false)}
        />
      )}
    </>
  );
};

export default InventoryModal;
