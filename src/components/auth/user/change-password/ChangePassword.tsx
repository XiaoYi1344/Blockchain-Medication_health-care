"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff, Vaccines, Favorite } from "@mui/icons-material";
import { userService } from "@/services/userService";
import { toast } from "react-hot-toast";
import { authService } from "@/services/authService";

interface ChangePasswordProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangePassword({ open, onClose }: ChangePasswordProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
  if (!oldPassword || !newPassword) {
    toast.error("Vui lòng nhập đủ thông tin");
    return;
  }

  const userInfo = authService.getUserInfo(); // 👈 Lấy user info đã login
  const userId = userInfo?.userId; // hoặc userInfo?.userId tùy backend trả về gì

  if (!userId) {
    toast.error("Không tìm thấy userId, vui lòng đăng nhập lại");
    return;
  }

  setLoading(true);
  try {
    await userService.changePassword({ userId, oldPassword, newPassword });
    toast.success("Đổi mật khẩu thành công!");
    setOldPassword("");
    setNewPassword("");
    onClose();
  } catch (err) {
    console.error(err);
    toast.error("Đổi mật khẩu thất bại");
  } finally {
    setLoading(false);
  }
};
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
          minWidth: 320,
          maxWidth: 400,
          background: "linear-gradient(145deg,#f5faff,#e0f0ff)",
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: "#1976d2" }}>
        <Vaccines color="primary" /> <Typography fontWeight={600}>Đổi mật khẩu</Typography>
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Mật khẩu cũ"
          type={showOld ? "text" : "password"}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowOld(!showOld)}>
                  {showOld ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Mật khẩu mới"
          type={showNew ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowNew(!showNew)}>
                  {showNew ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleChangePassword}
          startIcon={<Favorite />}
          sx={{
            borderRadius: 2,
            bgcolor: "#1976d2",
            "&:hover": { bgcolor: "#115293" },
          }}
          disabled={loading}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
