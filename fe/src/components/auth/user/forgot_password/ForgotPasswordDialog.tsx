"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  IconButton,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import { userService } from "@/services/userService";
import { authService } from "@/services/authService";

export default function ForgotPasswordDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");

  const handleSendEmail = async () => {
    try {
      const res = await userService.forgotPassword({ email });
      setType(res.type);
      setActiveStep(1);
      setError("");
    } catch {
      setError("Không gửi được OTP. Vui lòng thử lại.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await authService.verifyOtp({ email, otp, type });
      setActiveStep(2);
      setError("");
    } catch {
      setError("OTP không đúng hoặc đã hết hạn.");
    }
  };

  const handleNewPassword = async () => {
    try {
      await userService.newPassword({ email, newPassword });
      alert("Đổi mật khẩu thành công!");
      onClose();
      setActiveStep(0);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setError("");
    } catch {
      setError("Không thể đổi mật khẩu.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, y: -30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
        sx: {
          borderRadius: 4,
          p: 1,
          background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
          boxShadow: "0 8px 24px rgba(33,150,243,0.2)",
          width: 400,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          color: "#1565c0",
          fontWeight: 600,
        }}
      >
        <LocalHospitalIcon sx={{ color: "#42a5f5" }} />
        Quên mật khẩu
        <IconButton
          onClick={onClose}
          sx={{ ml: "auto", color: "#90caf9" }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          mt: 1,
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel>
          <Step>
            <StepLabel>Nhập email</StepLabel>
          </Step>
          <Step>
            <StepLabel>Nhập OTP</StepLabel>
          </Step>
          <Step>
            <StepLabel>Mật khẩu mới</StepLabel>
          </Step>
        </Stepper>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {activeStep === 0 && (
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  background: "#f5faff",
                },
              }}
            />
          )}
          {activeStep === 1 && (
            <TextField
              label="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  background: "#f5faff",
                },
              }}
            />
          )}
          {activeStep === 2 && (
            <TextField
              label="Mật khẩu mới"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  background: "#f5faff",
                },
              }}
            />
          )}
        </Box>

        {error && (
          <Typography color="error" textAlign="center" fontSize={14}>
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: "#90a4ae" }}>
          Hủy
        </Button>
        {activeStep === 0 && (
          <Button
            onClick={handleSendEmail}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg,#42a5f5,#81d4fa)",
              borderRadius: 3,
            }}
          >
            Gửi OTP
          </Button>
        )}
        {activeStep === 1 && (
          <Button
            onClick={handleVerifyOtp}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg,#42a5f5,#81d4fa)",
              borderRadius: 3,
            }}
          >
            Xác nhận OTP
          </Button>
        )}
        {activeStep === 2 && (
          <Button
            onClick={handleNewPassword}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg,#42a5f5,#81d4fa)",
              borderRadius: 3,
            }}
          >
            Đặt mật khẩu
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
