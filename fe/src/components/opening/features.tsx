"use client";

import { Box, Typography, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Inventory2,
  LocalShipping,
  Verified,
} from "@mui/icons-material";

const features = [
  {
    icon: <CheckCircle fontSize="large" color="primary" />,
    title: "Minh bạch dữ liệu",
    desc: "Ứng dụng Blockchain để đảm bảo dữ liệu rõ ràng, không thể chỉnh sửa.",
  },
  {
    icon: <Inventory2 fontSize="large" color="primary" />,
    title: "Quản lý tồn kho",
    desc: "Theo dõi và kiểm soát tồn kho dễ dàng, giảm rủi ro thiếu hụt.",
  },
  {
    icon: <LocalShipping fontSize="large" color="primary" />,
    title: "Vận chuyển đúng điều kiện",
    desc: "Đảm bảo vận chuyển theo đúng điều kiện bảo quản và thời gian ETA.",
  },
  {
    icon: <Verified fontSize="large" color="primary" />,
    title: "Tăng niềm tin",
    desc: "Nâng cao uy tín với bệnh viện & nhà thuốc thông qua hệ thống minh bạch.",
  },
];

export default function FeaturesFlow() {
  return (
    <Box
      sx={{
        py: { xs: 4, md: 8 },
        px: { xs: 2, md: 6 },
        background: "linear-gradient(180deg, #f9fcff, #eef7ff)",
        borderRadius: "2rem",
        my: "9%",
        position: "relative",
        mx: "25%",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        fontWeight="bold"
        color="primary"
        gutterBottom
      >
        Lợi ích nổi bật
      </Typography>

      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Giải pháp toàn diện cho chuỗi cung ứng y tế
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4, // giảm khoảng cách
          position: "relative",
          maxWidth: "800px", // giới hạn chiều rộng tổng
          mx: "auto", // căn giữa toàn bộ
        }}
      >
        {/* Đường đứt khúc ngắn hơn */}
        <Box
          component="svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300 600"
          preserveAspectRatio="none"
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 200,
            height: "100%",
            zIndex: 0,
          }}
        >
          <path
            d="M150 20 C 120 100, 180 160, 150 240 
     C 120 320, 180 400, 150 480 
     C 120 540, 180 560, 150 580"
            stroke="#ccc"
            strokeWidth="2"
            strokeDasharray="8,8"
            fill="none"
          />
        </Box>

        {features.map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            style={{
              zIndex: 1,
              width: "100%",
              display: "flex",
              justifyContent: i % 2 === 0 ? "flex-start" : "flex-end",
              position: "relative",
              minHeight: "140px", // giảm chiều cao
            }}
          >
            <Card
              sx={{
                width: 280, // rộng hơn
                transform: i % 2 === 0 ? "rotate(-1.5deg)" : "rotate(1.5deg)", // giảm độ nghiêng
                borderRadius: "1.75rem",
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)", // bóng mềm hơn
                p: 3,
                position: "relative",
                backgroundColor: "white",
                marginLeft: i % 2 === 0 ? "calc(50% - 300px)" : 0,
                marginRight: i % 2 !== 0 ? "calc(50% - 300px)" : 0,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 6,
                  left: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "text.secondary",
                }}
              >
                0{i + 1}
              </Box>

              <CardContent sx={{ textAlign: "center", p: 1.5 }}>
                <Box sx={{ mb: 1 }}>{f.icon}</Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {f.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {f.desc}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}
