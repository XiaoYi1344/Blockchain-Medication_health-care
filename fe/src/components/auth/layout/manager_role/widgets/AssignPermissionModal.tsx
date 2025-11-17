"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Paper,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { PermissionType } from "@/types/staff";
import { useAssignUserPermission } from "@/hooks/database/useStaff";

type EntityType = "user" | "role";

type Props = {
  open: boolean;
  onClose: () => void;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  allPermissions: PermissionType[];
  currentPermissions?: string[];
};

export default function AssignPermissionModal({
  open,
  onClose,
  entityType,
  entityId,
  entityName,
  allPermissions,
  currentPermissions = [],
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const assignUserMutation = useAssignUserPermission();

  // ✅ Chỉ cập nhật state khi component còn mounted
  useEffect(() => {
    let isMounted = true;

    if (open && currentPermissions && isMounted) {
      setSelected(currentPermissions.map(String));
    }

    return () => {
      isMounted = false;
    };
  }, [open, currentPermissions]);

  const togglePermission = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    let isMounted = true;

    if (entityType === "user") {
      assignUserMutation.mutate(
        { userId: entityId, permissionIds: selected },
        {
          onSuccess: () => {
            if (isMounted) onClose();
          },
        }
      );
    } else if (entityType === "role") {
      console.warn("Gán quyền cho role chưa được hỗ trợ.");
      if (isMounted) onClose();
    }

    return () => {
      isMounted = false;
    };
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          bgcolor: "#4FC3F7",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "12px 12px 0 0",
        }}
      >
        Gán quyền cho {entityName}
      </DialogTitle>
      <DialogContent sx={{ bgcolor: "#E1F5FE", p: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Chọn Permissions:
        </Typography>
        <Paper sx={{ p: 2, bgcolor: "#F0F7FA", borderRadius: 2 }}>
          {allPermissions.map((p) => (
            <Chip
              key={p._id}
              label={p.displayName}
              clickable
              color={selected.includes(String(p._id)) ? "primary" : "default"}
              onClick={() => togglePermission(p._id)}
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            bgcolor: "#F5F5F5",
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            bgcolor: "#4FC3F7",
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
