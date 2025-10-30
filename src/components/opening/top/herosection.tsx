// "use client";

// import Image from "next/image";
// import {
//   Button,
//   Typography,
//   Box,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";

// export default function TrekkingHero() {
//   const theme = useTheme();

//   // responsive check
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });
//   console.log(isMdUp);

//   return (
//     <Box
//       component="section"
//       sx={{
//         mx: "auto",
//         maxWidth: 1450,
//         bgcolor: "white",
//         borderRadius: "28px",
//         boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
//         overflow: "hidden",
//         display: "grid",
//         gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
//         gap: { xs: 3, md: 6 },
//         px: { xs: 4, md: 7 },
//         pb: 5,
//         pt: 15,
//         my: "4.5%"
//       }}
//     >
//       {/* Left copy */}
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "flex-start",
//           height: "100%", // quan trọng để flex hoạt động
//         }}
//       >
//         {/* Title block */}
//         <Box sx={{ maxWidth: 270, textAlign: "center" }}>
//           <Typography
//             variant="h1"
//             sx={{
//               mt: -5,
//               ml: 5,
//               fontWeight: 800,
//               lineHeight: 1.0,
//               fontSize: "clamp(32px, 8vw, 120px)",
//               letterSpacing: "-0.5px",
//               background: "linear-gradient(90deg, #0D47A1, #42A5F5)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               display: "inline-block", // 👈 Fix mất chữ
//               fontFamily: "'Poppins', sans-serif",
//             }}
//           >
//             Health
//           </Typography>

//           <Typography
//             variant="h1"
//             sx={{
//               mt: -2,
//               ml: 22,
//               fontWeight: 700,
//               lineHeight: 1.0,
//               fontSize: "clamp(28px, 6vw, 70px)",
//               letterSpacing: "2px",
//               color: "#1976D2",
//               fontFamily: "'Poppins', sans-serif",
//             }}
//           >
//             &
//           </Typography>

//           <Typography
//             variant="h1"
//             sx={{
//               mt: -5,
//               ml: -2,
//               fontWeight: 800,
//               lineHeight: 1.0,
//               fontSize: "clamp(32px, 8vw, 110px)",
//               letterSpacing: "-0.5px",
//               background: "linear-gradient(90deg, #42A5F5, #0D47A1)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               fontFamily: "'Poppins', sans-serif",
//             }}
//           >
//             Care
//           </Typography>
//         </Box>

//         {/* Spacer */}
//         <Box sx={{ flexGrow: 1 }} />

//         {/* Subtitle + Button block */}
//         <Box sx={{ mb: 1 }}>
//           {" "}
//           {/* thêm mb nếu muốn cách đáy 1 chút */}
//           <Typography
//             sx={{
//               mb: 3,
//               color: "text.secondary",
//               fontSize: "clamp(14px, 2vw, 28px)",
//               maxWidth: "calc(100% - 5px)", // để chữ dài sát ảnh, cách 5px
//             }}
//           >
//             A perfect guide to your snow peak adventures
//           </Typography>
//           <Button
//             variant="contained"
//             sx={{
//               px: 4,
//               py: 1.5,
//               mb: 4,
//               borderRadius: "12px",
//               textTransform: "none",
//               fontWeight: 600,
//               width: "100%", // ép full
//               maxWidth: "calc(100% - 5px)", // trừ 5px
//               boxShadow: 2,
//               background: "linear-gradient(to right, #dc2626, #f97316)",
//               "&:hover": {
//                 background: "linear-gradient(to right, #0D47A1, #1976D2, #42A5F5)",
//               },
//             }}
//           >
//             Explored Us
//           </Button>
//         </Box>
//       </Box>

//       {/* Right visual (2/3 width) */}
//       <Box
//         sx={{
//           position: "relative",
//           height: { xs: 420, md: 520 },
//           width: { xs: 420, md: 790 },
//         }}
//       >
//         <Box className="mountain-clip w-full h-full relative">
//           <Image
//             src="/banner1.jpg"
//             alt="Mountain"
//             fill
//             priority
//             style={{ objectFit: "cover" }}
//           />

//           {/* Trek path */}
//           {/* <svg
//             className="absolute inset-0 pointer-events-none"
//             viewBox="0 0 100 100"
//             preserveAspectRatio="none"
//           >
//             <path
//               d="M10 78 C 30 62, 55 48, 75 30"
//               fill="none"
//               stroke="white"
//               strokeWidth="2.4"
//               strokeDasharray="1 4"
//               opacity="0.95"
//             />
//             <circle cx="10" cy="78" r="2.2" fill="#f97316" />
//             <circle cx="40" cy="58" r="2.2" fill="white" />
//             <circle cx="75" cy="30" r="3" fill="white" />
//           </svg> */}
//         </Box>

//         {/* Card 100k */}
//         <Box
//           sx={{
//             position: "absolute",
//             bottom: 13,
//             right: 12,
//             bgcolor: "white",
//             borderRadius: "16px",
//             boxShadow: 3,
//             px: 2,
//             py: 1.5,
//             display: "flex",
//             alignItems: "center",
//             gap: 1.5,
//           }}
//         >
//           <Box sx={{ display: "flex", "& > *": { ml: -1.5 } }}>
//             <Image
//               src="/avatar1.jpg"
//               alt="a1"
//               width={36}
//               height={36}
//               className="rounded-full border-2 border-white"
//             />
//             <Image
//               src="/avatar2.jpg"
//               alt="a2"
//               width={36}
//               height={36}
//               className="rounded-full border-2 border-white"
//             />
//             <Image
//               src="/avatar3.jpg"
//               alt="a3"
//               width={36}
//               height={36}
//               className="rounded-full border-2 border-white"
//             />
//           </Box>
//           <Box sx={{ lineHeight: 1 }}>
//             <Typography fontWeight={600}>100k</Typography>
//             <Typography variant="body2" color="text.secondary">
//               People have explored
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

"use client";

import Image from "next/image";
import {
  Button,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { ArrowRightAlt } from "@mui/icons-material";
import { useInView } from "react-intersection-observer";

export default function SupplyChainHero() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.3 });

  const controlsLeft = useAnimation();
  const controlsRight = useAnimation();

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (inView) {
        controlsLeft.start({ opacity: 1, x: 0, transition: { duration: 0.8 } });
        controlsRight.start({
          opacity: 1,
          x: 0,
          transition: { duration: 0.8 },
        });
      } else {
        controlsLeft.set({ opacity: 0, x: -40 });
        controlsRight.set({ opacity: 0, x: 40 });
      }
    }

    return () => {
      mounted = false; // mark unmounted
    };
  }, [inView, controlsLeft, controlsRight]);

  return (
    <Box
      ref={ref}
      component="section"
      sx={{
        mx: "auto",
        maxWidth: 1450,
        borderRadius: "28px",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        alignItems: "center",
        position: "relative",
        background: "linear-gradient(135deg, #f0f9ff, #ffffff)",
        minHeight: { xs: 600, md: 700 },
        my: "5%",
      }}
    >
      {/* Left Copy */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, x: -40 }}
        animate={controlsLeft}
        sx={{
          px: { xs: 4, md: 8 },
          py: { xs: 6, md: 10 },
          textAlign: isMdUp ? "left" : "center", // 🔹 dùng isMdUp
          // height: isMdUp ? 500 : 300
          zIndex: 2,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 800,
            fontSize: "clamp(32px, 7vw, 70px)",
            lineHeight: 1.2,
            background: "linear-gradient(90deg, #0D47A1, #42A5F5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          Minh bạch Chuỗi Cung Ứng Y Tế
        </Typography>

        <Typography
          sx={{
            fontSize: "clamp(16px, 2vw, 22px)",
            color: "text.secondary",
            maxWidth: 500,
            mb: 4,
            mx: { xs: "auto", md: 0 },
          }}
        >
          Nâng cao niềm tin bằng dữ liệu minh bạch, quản lý tồn kho dễ dàng, vận
          chuyển đúng điều kiện bảo quản.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <Button
            variant="contained"
            endIcon={<ArrowRightAlt />}
            component={motion.button}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.96 }}
            sx={{
              px: 5,
              py: 2,
              fontSize: "1.1rem",
              borderRadius: "14px",
              textTransform: "none",
              fontWeight: 700,
              background:
                "linear-gradient(270deg, #22c55e, #16a34a, #3b82f6, #2563eb)",
              backgroundSize: "300% 300%",
              animation: "gradientMove 5s ease infinite",
              "@keyframes gradientMove": {
                "0%": { backgroundPosition: "0% 50%" },
                "50%": { backgroundPosition: "100% 50%" },
                "100%": { backgroundPosition: "0% 50%" },
              },
            }}
          >
            Khám phá ngay
          </Button>

          <Button
            variant="outlined"
            sx={{
              px: 4,
              py: 2,
              fontSize: "1.05rem",
              borderRadius: "14px",
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#1976D2",
              color: "#1976D2",
              "&:hover": { bgcolor: "#E3F2FD" },
            }}
          >
            Tìm hiểu thêm
          </Button>
        </Box>
      </Box>

      {/* Right Visual */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, x: 40 }}
        animate={controlsRight}
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          minHeight: { xs: 300, md: 500 },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            clipPath: {
              xs: "none",
              md: "path('M0 0 C 0 300, 160 450, 0 760 L 1000 800 L 1000 0 Z')",
            },
            filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))",
          }}
        >
          <Image
            src="/banner1.jpg" // 👉 thay bằng mockup dashboard hoặc logistics illustration
            alt="Supply Chain Dashboard"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </Box>
      </Box>
    </Box>
  );
}
