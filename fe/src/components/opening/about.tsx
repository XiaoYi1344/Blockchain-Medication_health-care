"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

import { Box, Card, Typography, Grid } from "@mui/material";

const roles = [
  {
    img: "/factory.avif",
    title: "Sản xuất",
    desc: "Quản lý lô hàng, chứng nhận & ngày sản xuất.",
  },
  {
    img: "/distribution.avif",
    title: "Phân phối",
    desc: "Kiểm soát nguồn hàng, tồn kho & lịch sử nhập.",
  },
  {
    img: "/transport.avif",
    title: "Vận chuyển",
    desc: "Theo dõi hành trình, điều kiện bảo quản & ETA.",
  },
];

export default function ExploreUs() {
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      AOS.init({ duration: 1000, once: true, easing: "ease-out-cubic" });
    }

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Box
      id="explore"
      sx={{
        py: { xs: 8, md: 11 },
        px: { xs: 2, md: 4 },
        my: "7.4%",
        mx: "auto",
        maxWidth: 1450,
        borderRadius: "28px",
        background: "linear-gradient(to bottom, #ffffff, #f0f7ff)", // ✅ dùng background
      }}
    >
      {/* Title */}
      <Box textAlign="center" mb={6}>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h4"
            component="h2"
            fontWeight="bold"
            color="primary"
          >
            Explore Us
          </Typography>

          <Typography mt={2} color="text.secondary" fontSize="1.1rem">
            3 vai trò – 1 hệ thống cho chuỗi cung ứng y tế
          </Typography>
        </motion.div>
      </Box>

      {/* Cards */}
      <Grid
        container
        spacing={4}
        maxWidth="lg"
        sx={{ margin: "0 auto" }}
        justifyContent="center"
      >
        {roles.map((role, i) => (
          <Grid size={{ xs: 12, md: 4 }} key={i}>
            <motion.div
              data-aos="fade-up"
              data-aos-delay={i * 100}
              whileHover={{ scale: 1.05 }}
              style={{ borderRadius: "16px", overflow: "hidden" }}
            >
              <Card
                sx={{
                  position: "relative",
                  borderRadius: 4,
                  boxShadow: 4,
                  overflow: "hidden",
                }}
              >
                {/* Lazy-load image */}
                <Box sx={{ position: "relative", height: 280 }}>
                  <Image
                    src={role.img}
                    alt={role.title}
                    fill
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                    }}
                    loading="lazy"
                    className="group-hover:scale-110"
                  />
                  {/* Overlay gradient */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(25, 118, 210, 0.25) 20%, transparent 100%)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      p: 3,
                      color: "white",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {role.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {role.desc}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
