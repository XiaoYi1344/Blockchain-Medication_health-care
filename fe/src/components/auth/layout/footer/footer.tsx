"use client";

import { Box, Typography, Stack, Divider } from "@mui/material";
// import EmailIcon from "@mui/icons-material/Email";
// import SchoolIcon from "@mui/icons-material/School";
// import GroupsIcon from "@mui/icons-material/Groups";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(180deg, #f9fafb 0%, #eef2f6 100%)",
        py: { xs: 3, md: 4 },
        // px: { xs: 3, md: 10 },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        flexDirection: "column",
        gap: 2,
        mt: "auto",
      }}
    >
      {/* Left Section */}
      <Stack
        spacing={1}
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          flexDirection: "row",
          px: { xs: 2, md: 5 }, // chừa nhẹ 16–40px mỗi bên cho cân đối
          gap: 3,
        }}
      >
        {/* Bên trái: Tên nhóm */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography
            variant="subtitle1"
            fontWeight={700}
            color="text.primary"
            sx={{ whiteSpace: "nowrap", px: { xs: 2, md: 10 } }}
          >
            Blockchain & Medication
          </Typography>
        </Stack>

        {/* Bên phải: Thông tin liên hệ */}
        <Stack>
          {/* <Stack direction="row" spacing={1} alignItems="center">
            <EmailIcon sx={{ fontSize: 16, color: "#00796B" }} />
            <Typography variant="body2" color="text.secondary">
              jadedohuynh8713@gmail.com
            </Typography>
          </Stack> */}

          <Stack direction="row" spacing={1} alignItems="center">
            {/* <SchoolIcon sx={{ fontSize: 16, color: "#00796B" }} /> */}
            <Typography variant="body2" color="text.secondary">
              Trường Cao đẳng Công nghệ Thông tin TP. Hồ Chí Minh
            </Typography>
            {/* <Typography
          variant="subtitle2"
          sx={{ color: "#004D40", fontWeight: 600, mb: 0.5,}}
        >
          Dự án dự thi Sinh viên Nghiên cứu Khoa học 2025
        </Typography> */}
          </Stack>
        </Stack>
      </Stack>

      <Divider sx={{ borderColor: "rgba(0, 121, 107, 0.1)", width: "100%" }} />

      {/* Right Section */}
      <Stack sx={{ textAlign: { xs: "left", md: "right" } }}>
        <Typography
          variant="caption"
          sx={{ color: "text.disabled", display: "block", mt: 1 }}
        >
          © {new Date().getFullYear()} Blockchain & Medication — All rights
          reserved.
        </Typography>
      </Stack>
    </Box>
  );
}
