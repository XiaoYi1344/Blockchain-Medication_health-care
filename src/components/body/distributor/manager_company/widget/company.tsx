"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Chip,
  Divider,
  useTheme,
  Alert,
  // Box,
} from "@mui/material";
import {
  Business,
  LocationOn,
  Pending,
  // Sync,
  // CheckCircle,
  // Error as ErrorIcon,
} from "@mui/icons-material";
import { useCompanyV6, useUpdateCompanyV6 } from "@/hooks/database/useCompany";
import { GetCompanyQueryV6, UpdateCompanyPayloadV6 } from "@/types/company";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CompanyWidgetProps {
  companyId?: string | null;
}

// 👇 Component toast y tế thân thiện
// const ToastMedical = ({
//   title,
//   description,
//   icon,
// }: {
//   title: string;
//   description: string;
//   icon?: React.ReactNode;
// }) => {
//   const theme = useTheme();

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         alignItems: "flex-start",
//         gap: 1.5,
//         p: 1.5,
//         borderRadius: 2,
//         background:
//           theme.palette.mode === "light"
//             ? "linear-gradient(135deg, #E8F5F2, #FFFFFF)"
//             : "linear-gradient(135deg, #0B2B2A, #08211F)",
//         boxShadow:
//           theme.palette.mode === "light"
//             ? "0 3px 12px rgba(0, 169, 157, 0.1)"
//             : "0 3px 12px rgba(0, 169, 157, 0.25)",
//         border: "1px solid rgba(0,169,157,0.25)",
//         minWidth: 280,
//       }}
//     >
//       {icon}
//       <Stack spacing={0.3}>
//         <Typography
//           variant="subtitle2"
//           sx={{
//             color:
//               theme.palette.mode === "light"
//                 ? "#007C76"
//                 : theme.palette.info.light,
//             fontWeight: 600,
//           }}
//         >
//           {title}
//         </Typography>
//         <Typography
//           variant="body2"
//           sx={{ color: theme.palette.text.secondary, lineHeight: 1.4 }}
//         >
//           {description}
//         </Typography>
//       </Stack>
//     </Box>
//   );
// };

export const CompanyWidget: React.FC<CompanyWidgetProps> = ({ companyId }) => {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const query: GetCompanyQueryV6 = { companyId: companyId || undefined };
  const { data: company, isLoading, error } = useCompanyV6(query);
  const updateMutation = useUpdateCompanyV6();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false; // mark unmounted
    };
  }, []);

  useEffect(() => {
    if (company) {
      setName(company.name || "");
      setLocation(company.location || "");
    }
  }, [company]);

  // ✅ Hàm cập nhật với toast "y tế"
  const handleUpdate = () => {
    const payload: UpdateCompanyPayloadV6 = { name, location };

    toast.promise(
      updateMutation.mutateAsync(payload, {
        onSuccess: async () => {
          if (isMounted.current) {
            await queryClient.invalidateQueries({
              queryKey: ["company", { companyId }],
            });
          }
        },
      }),
      {
        loading: (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>
              Đang cập nhật... Hệ thống đang lưu dữ liệu công ty, vui lòng đợi
              giây lát.
            </Typography>
          </Stack>
        ),
        success: (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>
              Cập nhật thành công! Thông tin công ty đã được lưu an toàn.
            </Typography>
          </Stack>
        ),
        error: (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>
              Cập nhật thất bại. Đã xảy ra lỗi trong quá trình lưu dữ liệu.
            </Typography>
          </Stack>
        ),
      }
    );
  };

  const backgroundGradient =
    theme.palette.mode === "light"
      ? "linear-gradient(145deg, #E8F5FE 0%, #FFFFFF 100%)"
      : "linear-gradient(145deg, #1E293B 0%, #0F172A 100%)";

  if (isLoading)
    return (
      <Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
        <CircularProgress color="primary" />
        <Typography variant="body2" color="text.secondary">
          Đang tải thông tin công ty...
        </Typography>
      </Stack>
    );

  if (error)
    return (
      <Alert severity="error">
        Lỗi khi tải thông tin công ty: {error.message}
      </Alert>
    );

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        p: 2.5,
        background: backgroundGradient,
        transition: "background 0.4s ease",
      }}
    >
      <CardHeader
        sx={{ textAlign: "center", pb: 1 }}
        title={
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color:
                theme.palette.mode === "light"
                  ? theme.palette.primary.main
                  : theme.palette.info.light,
            }}
          >
            Thông tin công ty
          </Typography>
        }
        subheader={
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
          >
            Cập nhật dữ liệu nhanh chóng và an toàn
          </Typography>
        }
      />

      <Divider sx={{ my: 2 }} />

      <CardContent sx={{ pt: 0 }}>
        <Stack spacing={1.5}>
          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Business color="primary" fontSize="small" />
            <strong>Tên hiện tại:</strong>&nbsp;{company?.name || "Chưa có"}
          </Typography>

          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Pending color="action" fontSize="small" />
            <strong>Tên chờ duyệt:</strong>&nbsp;{company?.newName || "-"}
          </Typography>

          <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOn color="primary" fontSize="small" />
            <strong>Địa điểm:</strong>&nbsp;
            {company?.location || "Không xác định"}
          </Typography>

          <Typography variant="body2">
            <strong>Loại:</strong> {company?.type || "-"}
          </Typography>

          <Typography
            variant="body2"
            component="div"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <strong>Trạng thái:</strong>
            <Chip
              size="small"
              label={company?.status || "Không rõ"}
              color={company?.status === "active" ? "success" : "default"}
              sx={{ textTransform: "capitalize" }}
            />
          </Typography>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Cập nhật thông tin
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Tên công ty mới"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Địa điểm"
            variant="outlined"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            size="small"
            fullWidth
          />
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end", mt: 1 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          disabled={updateMutation.status === "pending"}
          startIcon={
            updateMutation.status === "pending" ? (
              <CircularProgress size={18} color="inherit" />
            ) : null
          }
        >
          {updateMutation.status === "pending"
            ? "Đang cập nhật..."
            : "Lưu thay đổi"}
        </Button>
      </CardActions>
    </Card>
  );
};
