"use client";

import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Avatar,
  Paper,
  IconButton,
  InputAdornment,
  Grid,
  useTheme,
} from "@mui/material";
import {
  LockPersonRounded,
  Person,
  Email,
  Phone,
  Home,
  Cake,
  Public,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { toast as toastHot } from "react-hot-toast";
import ChangePassword from "./change-password/ChangePassword";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import { ProfileUser, UpdateUserRequest } from "@/types/user";
// import { AxiosError } from "axios";
import { useThemeMode } from "@/components/theme/ThemeRegistry";

export default function AccountForm() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const router = useRouter();
  const [form, setForm] = useState<UpdateUserRequest>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [openChangePwd, setOpenChangePwd] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const data: ProfileUser = await userService.getUser({
          headers: { "Cache-Control": "no-cache" },
        });

        if (!isMounted) return; // <-- kiểm tra trước khi set state

        setForm({
          userName: data.userName,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          dob: data.dob ? new Date(data.dob).toISOString().slice(0, 10) : "",
          address: data.address,
          gender: data.gender,
          nationality: data.nationality,
        });

        setAvatarUrl(data.avatar ? `/api/avatar/${data.avatar}` : "");
      } catch (err) {
        console.error("Error fetching user:", err);
        toastHot.error("Không thể tải thông tin người dùng");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      isMounted = false; // component unmount
    };
  }, []);

  const handleChange = <K extends keyof UpdateUserRequest>(
    field: K,
    value: UpdateUserRequest[K]
  ) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    try {
      const payload: UpdateUserRequest = { ...form };
      if (avatarFile) payload.avatar = avatarFile;
      console.log("Payload sắp gửi:", payload); // <-- Thêm dòng này
      const res = await userService.updateUser(payload);
      toastHot.success("Cập nhật tài khoản thành công!");
      setAvatarFile(null);
      setAvatarPreview("");
      setAvatarUrl(res.avatar ? `/api/avatar/${res.avatar}` : avatarUrl);
    } catch (err: unknown) {
      let message = "Cập nhật thất bại";
      if (err instanceof Error) message = err.message;
      toastHot.error(message);
    }
  };

  const handleLogout = () => {
    authService.logout();
    toastHot.success("Đã đăng xuất!");
    router.push("/auth/login");
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography>Đang tải thông tin người dùng...</Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        py: 4,
        background:
          mode === "light"
            ? "linear-gradient(135deg, #e0f7f7 0%, #c7f0f5 100%)"
            : "linear-gradient(135deg, #071821 0%, #0a2421 100%)",
        transition: "background 0.3s ease",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 760,
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          backdropFilter: "blur(20px)",
          background:
            mode === "light" ? "rgba(255,255,255,0.9)" : "rgba(10,36,33,0.85)",
          boxShadow:
            mode === "light"
              ? "0 8px 24px rgba(0,0,0,0.1)"
              : "0 8px 24px rgba(0,0,0,0.6)",
          position: "relative",
          transition: "all 0.3s ease",
        }}
      >
        <IconButton
          onClick={() => setOpenChangePwd(true)}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            background: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            "&:hover": { background: theme.palette.primary.dark },
          }}
        >
          <LockPersonRounded />
        </IconButton>

        <Typography
          variant="h4"
          align="center"
          sx={{ mb: 4, fontWeight: 700, color: theme.palette.primary.main }}
        >
          Hồ sơ cá nhân
        </Typography>

        <Grid container spacing={3}>
          <Grid
            size={{ xs: 12, sm: 4 }}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Avatar
              src={
                avatarFile ? avatarPreview : avatarUrl || "/default-avatar.png"
              }
              sx={{
                width: 120,
                height: 120,
                border: `3px solid ${theme.palette.primary.main}`,
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                mb: 2,
                transition: "0.3s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            />
            <Button
              variant="outlined"
              component="label"
              sx={{
                textTransform: "none",
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                "&:hover": {
                  borderColor: theme.palette.primary.dark,
                  color: theme.palette.primary.dark,
                },
              }}
            >
              Thay ảnh
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setAvatarFile(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }}
              />
            </Button>
          </Grid>

          <Grid size={{ xs: 12, sm: 8 }}>
            <Grid container spacing={2}>
              {[
                { label: "Tên đăng nhập", key: "userName", icon: <Person /> },
                { label: "Họ và tên", key: "fullName", icon: <Person /> },
                { label: "Email", key: "email", icon: <Email /> },
                { label: "Số điện thoại", key: "phone", icon: <Phone /> },
                {
                  label: "Ngày sinh",
                  key: "dob",
                  icon: <Cake />,
                  type: "date",
                },
                { label: "Quốc tịch", key: "nationality", icon: <Public /> },
                { label: "Địa chỉ", key: "address", icon: <Home /> },
              ].map((field, idx) => (
                <Grid
                  size={{ xs: 12, md: idx < 5 || idx === 5 ? 6 : 12 }}
                  key={field.key}
                >
                  <TextField
                    label={field.label}
                    value={form[field.key as keyof UpdateUserRequest] || ""}
                    type={field.type || "text"}
                    onChange={(e) =>
                      handleChange(
                        field.key as keyof UpdateUserRequest,
                        e.target.value
                      )
                    }
                    fullWidth
                    InputLabelProps={
                      field.type === "date" ? { shrink: true } : undefined
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {field.icon}
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    sx={{
                      transition: "all 0.3s ease",
                      background: mode === "light" ? "#f6fbfb" : "#071821",
                    }}
                  />
                </Grid>
              ))}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Giới tính"
                  select
                  value={form.gender || ""}
                  onChange={(e) =>
                    handleChange(
                      "gender",
                      e.target.value as "male" | "female" | "other"
                    )
                  }
                  fullWidth
                  variant="outlined"
                  sx={{
                    transition: "all 0.3s ease",
                    background: mode === "light" ? "#f6fbfb" : "#071821",
                  }}
                >
                  <MenuItem value="male">Nam</MenuItem>
                  <MenuItem value="female">Nữ</MenuItem>
                  <MenuItem value="other">Khác</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          mt={4}
          gap={2}
        >
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              flex: 1,
              minWidth: 140,
              borderRadius: 3,
              py: 1.5,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              fontWeight: 600,
              boxShadow: `0 6px 20px ${theme.palette.primary.main}33`,
              "&:hover": {
                boxShadow: `0 8px 25px ${theme.palette.primary.main}55`,
              },
              transition: "all 0.3s ease",
            }}
          >
            Lưu thay đổi
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            sx={{
              flex: 1,
              minWidth: 140,
              borderRadius: 3,
              py: 1.5,
              fontWeight: 600,
              "&:hover": { background: "rgba(244,67,54,0.08)" },
              transition: "all 0.3s ease",
            }}
          >
            Đăng xuất
          </Button>
        </Box>

        <ChangePassword
          open={openChangePwd}
          onClose={() => setOpenChangePwd(false)}
        />
      </Paper>
    </Box>
  );
}
