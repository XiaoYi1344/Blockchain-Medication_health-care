"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Location } from "@/types/location";
import {
  useCreateInventory,
  useUpdateInventory,
} from "@/hooks/database/useInventory";
import { useLocations } from "@/hooks/database/useLocations";
import { useBatches } from "@/hooks/database/useBatch";

interface Props {
  locationId: string;
  inventoryId?: string; // có = cập nhật batch
  batchCode?: string; // chỉ khi update (ẩn)
  onClose: () => void;
}

const BatchFormModal: React.FC<Props> = ({
  locationId,
  inventoryId,
  batchCode,
  onClose,
}) => {
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(locationId);
  const [selectedBatch, setSelectedBatch] = useState(batchCode ?? "");

  const createInventory = useCreateInventory();
  const updateInventory = useUpdateInventory();
  const { data: locations = [] } = useLocations(true);
  const { data: batches = [] } = useBatches();

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setSelectedLocation(locationId);
      if (batchCode) setSelectedBatch(batchCode);
    }

    return () => {
      isMounted = false;
    };
  }, [locationId, batchCode]);

  const handleSubmit = async () => {
    let isMounted = true;

    try {
      if (inventoryId) {
        if (!reason) {
          alert("Vui lòng nhập lý do cập nhật tồn kho");
          return;
        }
        await updateInventory.mutateAsync({
          inventoryId,
          locationId: selectedLocation,
          quantity,
          reason,
        });
      } else {
        if (!selectedBatch) {
          alert("Vui lòng chọn batch");
          return;
        }
        if (quantity <= 0) {
          alert("Số lượng phải lớn hơn 0");
          return;
        }
        await createInventory.mutateAsync({
          batchCode: selectedBatch,
          locationId: selectedLocation,
          currentQuantity: quantity,
          uom: "box",
        });
      }

      if (isMounted) onClose(); // ✅ chỉ gọi onClose nếu còn mounted
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra. Kiểm tra console để biết chi tiết.");
    }

    return () => {
      isMounted = false;
    };
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>
        {inventoryId ? "Cập nhật tồn kho" : "Thêm tồn kho"}
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        {/* Chọn kho */}
        <FormControl fullWidth>
          <InputLabel>Chọn kho</InputLabel>
          <Select
            value={selectedLocation}
            label="Chọn kho"
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {locations.map((loc: Location) => (
              <MenuItem key={loc._id} value={loc._id}>
                {loc.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Chọn batch nếu thêm */}
        {!inventoryId && (
          <FormControl fullWidth>
            <InputLabel>Chọn thuốc/batch</InputLabel>
            <Select
              value={selectedBatch}
              label="Chọn batch"
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              {batches.map((b) => (
                <MenuItem key={b.batchCode} value={b.batchCode}>
                  {b.batchCode}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Số lượng */}
        <TextField
          type="number"
          label={inventoryId ? "Số lượng (+/-)" : "Số lượng"}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          fullWidth
        />

        {/* Lý do khi update */}
        {inventoryId && (
          <TextField
            type="text"
            label="Lý do"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {inventoryId ? "Cập nhật" : "Thêm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BatchFormModal;
