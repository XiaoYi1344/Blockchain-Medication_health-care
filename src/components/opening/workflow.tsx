"use client";

import { Box, Typography, Card, CardContent } from "@mui/material";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const steps = [
  { id: 1, title: "Sản xuất", desc: "Tạo lô hàng – kiểm định & chứng nhận." },
  { id: 2, title: "Phân phối", desc: "Kiểm duyệt & kiểm soát nguồn hàng." },
  { id: 3, title: "Vận chuyển", desc: "Vận chuyển lạnh – theo dõi ETA." },
  {
    id: 4,
    title: "Người tiêu dùng",
    desc: "Người dùng cuối nhận sản phẩm an toàn.",
  },
];

export default function SmartTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const totalLengthRef = useRef<number>(0);
  const [stepPositions, setStepPositions] = useState<
    { x: number; y: number; length: number }[]
  >([]);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [hoverStep, setHoverStep] = useState<number | null>(null);
  const controls = useAnimation();

  // === Tính vị trí các step trên path ===
  useEffect(() => {
    if (!pathRef.current) return;
    let mounted = true;

    const path = pathRef.current;
    const totalLength = path.getTotalLength();
    totalLengthRef.current = totalLength;

    const positions: { x: number; y: number; length: number }[] = [];
    steps.forEach((_, i) => {
      const len = (totalLength / (steps.length - 1)) * i;
      const point = path.getPointAtLength(len);
      positions.push({ x: point.x, y: point.y, length: len });
    });

    if (mounted) setStepPositions(positions);

    return () => {
      mounted = false;
    };
  }, []);

  // === Auto chạy qua từng step ===
  useEffect(() => {
    if (!stepPositions.length || hoverStep) return;

    let cancelled = false;
    let idx = activeStep - 1;

    const runSteps = async () => {
      while (!cancelled) {
        const targetStep = steps[idx];
        const targetLen = stepPositions[idx].length;

        // chạy line đến step
        await controls.start({
          strokeDashoffset: totalLengthRef.current - targetLen,
          transition: { duration: 1.5, ease: "easeInOut" },
        });

        if (cancelled) break; // check before state update
        setActiveStep(targetStep.id);

        // dừng lại 3s để đọc
        await new Promise((res) => setTimeout(res, 3000));
        if (cancelled) break;

        idx = (idx + 1) % steps.length;
      }
    };

    runSteps();

    return () => {
      cancelled = true;
    };
  }, [stepPositions, hoverStep, controls, activeStep]);

  // === Hover thì chạy tới đúng step ===
  useEffect(() => {
    if (!hoverStep || !stepPositions.length) return;

    let cancelled = false;
    const idx = steps.findIndex((s) => s.id === hoverStep);
    if (idx === -1) return;

    const targetLen = stepPositions[idx].length;

    controls
      .start({
        strokeDashoffset: totalLengthRef.current - targetLen,
        transition: { duration: 1.2, ease: "easeInOut" },
      })
      .then(() => {
        if (!cancelled) setActiveStep(hoverStep);
      });

    return () => {
      cancelled = true;
    };
  }, [hoverStep, stepPositions, controls]);

  // === Quan sát khi scroll vào viewport thì reset về step 1 ===
  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!mounted) return; // <--- check if still mounted
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // reset về step 1
            setActiveStep(1);
            controls.set({
              strokeDashoffset:
                totalLengthRef.current - (stepPositions[0]?.length || 0),
            });
          }
        });
      },
      { threshold: 0.4 } // vào 40% viewport thì reset
    );

    observer.observe(containerRef.current);

    return () => {
      mounted = false; // mark unmounted
      observer.disconnect(); // clean up observer
    };
  }, [stepPositions, controls]);

  return (
    <Box
      ref={containerRef}
      sx={{
        py: 8,
        px: 4,
        textAlign: "center",
        position: "relative",
        background: "linear-gradient(180deg,#e3f2fd,#ffffff)",
        my: "5%",
        borderRadius: "2rem",
        mx: "5%",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{
          background: "linear-gradient(90deg,#1976d2,#f50057)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          mb: 8,
        }}
      >
        Quy trình hoạt động
      </Typography>

      <Box sx={{ position: "relative", width: "100%", height: 380 }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 300"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Đường timeline mờ */}
          <path
            ref={pathRef}
            d="M50,150 C200,50 400,250 600,150 C800,50 900,250 950,150"
            stroke="#ddd"
            strokeWidth="6"
            fill="none"
          />

          {/* Highlight chạy theo step */}
          <motion.path
            d="M50,150 C200,50 400,250 600,150 C800,50 900,250 950,150"
            stroke="url(#gradient)"
            strokeWidth="6"
            fill="none"
            strokeDasharray={
              stepPositions.length ? stepPositions.at(-1)!.length : 2000
            }
            strokeDashoffset={
              stepPositions.length ? stepPositions.at(-1)!.length : 2000
            }
            animate={controls}
          />

          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1976d2" />
              <stop offset="100%" stopColor="#f50057" />
            </linearGradient>
          </defs>

          {/* Các Step Circles */}
          {stepPositions.map((pos, i) => {
            const step = steps[i];
            const isActive =
              hoverStep === step.id || (!hoverStep && activeStep === step.id);

            return (
              <g
                key={step.id}
                onMouseEnter={() => setHoverStep(step.id)}
                onMouseLeave={() => setHoverStep(null)}
                style={{ cursor: "pointer" }}
              >
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isActive ? 22 : 16}
                  fill={isActive ? "#1976d2" : "#bbb"}
                  stroke="#fff"
                  strokeWidth="4"
                  animate={{
                    filter: isActive
                      ? "drop-shadow(0px 0px 12px rgba(25,118,210,0.7))"
                      : "drop-shadow(0px 0px 0px transparent)",
                  }}
                  transition={{ duration: 0.4 }}
                />
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                >
                  {step.id}
                </text>

                {/* Card overlay */}
                {isActive && (
                  <foreignObject
                    x={Math.min(Math.max(pos.x - 120, 20), 760)}
                    y={pos.y + 40}
                    width={240}
                    height={140}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card
                        sx={{
                          borderRadius: 3,
                          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                          background: "linear-gradient(135deg,#fff,#f3f9ff)",
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
                          >
                            {step.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {step.desc}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>
      </Box>
    </Box>
  );
}
