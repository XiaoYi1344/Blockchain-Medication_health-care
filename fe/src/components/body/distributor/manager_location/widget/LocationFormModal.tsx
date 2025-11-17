"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  Location,
  CreateLocationReq,
  UpdateLocationReq,
  LocationType,
  preservationCapability,
} from "@/types/location";
import {
  useCreateLocation,
  useUpdateLocation,
} from "@/hooks/database/useLocations";
import { useCreateInventory } from "@/hooks/database/useInventory";
import axios from "axios";

interface Props {
  location?: Location | null;
  onClose: () => void;
}

const LocationFormModal: React.FC<Props> = ({ location, onClose }) => {
  const isEdit = !!location;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState<LocationType>("warehouse");
  const [preservation, setPreservation] =
    useState<preservationCapability>("NORMAL");
  const [maximum, setMaximum] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const createLocation = useCreateLocation();
  const updateLocation = useUpdateLocation();
  const createInventory = useCreateInventory();

  // Load dữ liệu khi edit
  useEffect(() => {
    if (!location) return;
    let isMounted = true;

    if (isMounted) {
      setName(location.name);
      setDescription(location.description ?? "");
      setAddress(location.address);
      setType(location.type);
      setPreservation(location.preservationCapability);
      setMaximum(location.maximum);
    }

    return () => {
      isMounted = false;
    };
  }, [location]);

  // Submit form
  const handleSubmit = async () => {
    // Validation cơ bản
    if (!name.trim()) return alert("Tên kho không được để trống");
    if (!address.trim()) return alert("Địa chỉ không được để trống");
    if (maximum <= 0) return alert("Số lượng tối đa lô phải lớn hơn 0");

    // Payload chuẩn API
    const payload: CreateLocationReq | UpdateLocationReq = {
      name: name.trim(),
      description: description ? description.trim() : undefined,
      address: address.trim(),
      type,
      preservationCapability: preservation,
      maximum,
      ...(isEdit ? { locationId: location!._id, isActive: true } : {}),
    };

    try {
      if (isEdit) {
        await updateLocation.mutateAsync(payload as UpdateLocationReq);
      } else {
        const newLocation = await createLocation.mutateAsync(
          payload as CreateLocationReq
        );

        // Tạo tồn kho ban đầu nếu nhập
        if (quantity > 0) {
          await createInventory.mutateAsync({
            locationId: newLocation._id,
            batchCode: "INITIAL_BATCH",
            currentQuantity: quantity,
            uom: "box",
          });
        }
      }

      onClose();
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response) {
        alert(err.response.data?.message || "Có lỗi xảy ra. Kiểm tra console.");
      } else {
        alert("Có lỗi xảy ra. Kiểm tra console.");
      }
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{isEdit ? "Sửa kho" : "Thêm kho"}</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          label="Tên kho"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Mô tả (tùy chọn)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />
        <TextField
          label="Địa chỉ"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Loại kho</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as LocationType)}
          >
            <MenuItem value="warehouse">Warehouse</MenuItem>
            <MenuItem value="store">Store</MenuItem>
            <MenuItem value="vehicle">Vehicle</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Điều kiện bảo quản</InputLabel>
          <Select
            value={preservation}
            onChange={(e) =>
              setPreservation(e.target.value as preservationCapability)
            }
          >
            <MenuItem value="COOL">Cool</MenuItem>
            <MenuItem value="FREEZE">Freeze</MenuItem>
            <MenuItem value="NORMAL">Normal</MenuItem>
            <MenuItem value="ROOM_TEMP">Room Temp</MenuItem>
          </Select>
        </FormControl>
        <TextField
          type="number"
          label="Số lượng tối đa lô"
          value={maximum}
          onChange={(e) => setMaximum(Number(e.target.value))}
        />
        {!isEdit && (
          <TextField
            type="number"
            label="Số lượng tồn kho ban đầu"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationFormModal;
