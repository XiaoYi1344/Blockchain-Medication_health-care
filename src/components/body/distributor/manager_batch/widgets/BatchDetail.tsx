"use client";
import React, { useEffect, useRef } from "react";
import {
  Modal,
  Box,
  Typography,
  Stack,
  Button,
  Divider,
  // Paper,
} from "@mui/material";
import QRCodeLib from "qrcode";
// import QRScanner from "./QRScanner";
import { useBatch } from "@/hooks/database/useBatch";
import { useTrace } from "@/hooks/database/useTrace"; // ✅ Hook quản lý mã truy xuất

interface BatchDetailModalProps {
  batchCode: string;
  open: boolean;
  onClose: () => void;
}

export const BatchDetailModal: React.FC<BatchDetailModalProps> = ({
  batchCode,
  open,
  onClose,
}) => {
  const { data: batch } = useBatch(batchCode);
  const trace = useTrace(batch?.batchCode); // ✅ lấy trace từ Supabase
  // const [scanResult, setScanResult] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ✅ Render QR khi có trace URL
  useEffect(() => {
    if (!trace?.traceUrl || !open) return;
    const drawQR = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      try {
        await QRCodeLib.toCanvas(canvas, trace.traceUrl, {
          width: 240,
          margin: 2,
          color: { dark: "#000000", light: "#ffffff" },
        });
        console.log("✅ QR đã render thành công:", trace.traceUrl);
      } catch (err) {
        console.error("❌ Lỗi khi tạo QR:", err);
      }
    };
    drawQR();
  }, [trace, open]);

  const handleDownloadQR = () => {
    if (!canvasRef.current || !batch) return;
    const link = document.createElement("a");
    link.href = canvasRef.current.toDataURL("image/png");
    link.download = `QR_${batch.batchCode}.png`;
    link.click();
  };

  if (!batch) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 3,
          background: "#fff",
          borderRadius: 2,
          maxWidth: 550,
          margin: "5vh auto",
          maxHeight: "90vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          boxShadow: 5,
        }}
      >
        <Typography variant="h6" textAlign="center" fontWeight={700}>
          Thông tin Lô: {batch.batchCode}
        </Typography>
        <Divider />

        {/* 🧾 Thông tin lô */}
        <Stack spacing={1}>
          <Typography>
            <strong>Mã sản phẩm:</strong> {batch.productCode}
          </Typography>
          <Typography>
            <strong>Trạng thái:</strong> {batch.state}
          </Typography>
          {batch.estimatedDate && (
            <Typography>
              <strong>Ngày sản xuất dự kiến:</strong> {batch.estimatedDate}
            </Typography>
          )}
          {batch.EXP && (
            <Typography>
              <strong>Hạn sử dụng:</strong> {batch.EXP}
            </Typography>
          )}
          {batch.txHash && (
            <Typography sx={{ wordBreak: "break-all" }}>
              <strong>TxHash:</strong> {batch.txHash}
            </Typography>
          )}
        </Stack>

        <Divider />

        {/* 🧭 QR truy xuất */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={1.5}
        >
          <canvas
            ref={canvasRef}
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              width: 240,
              height: 240,
            }}
          />
          <Typography variant="body2" fontWeight={600}>
            Mã truy xuất: {trace?.traceCode || "Đang tạo..."}
          </Typography>
          <Button
            variant="contained"
            size="small"
            disabled={!trace}
            onClick={handleDownloadQR}
          >
            📥 Tải mã QR PNG
          </Button>
          <Typography
            variant="caption"
            color="textSecondary"
            textAlign="center"
          >
            *Quét mã bằng Zalo, camera, hoặc app quét QR để xem thông tin thuốc*
          </Typography>
        </Box>

        <Divider />

        {/* 🔍 Thử quét */}
        {/*<Paper sx={{ p: 1.5, borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} mb={1}>
            Thử quét QR
          </Typography>
          <QRScanner
            onScan={(result) => setScanResult(result)}
            onError={(err) => console.error(err)}
          />
          {scanResult && (
            <Typography variant="body2" mt={1} sx={{ wordBreak: "break-all" }}>
              Kết quả: {scanResult}
            </Typography>
          )}
        </Paper>*/}

        <Button variant="outlined" sx={{ mt: 1 }} fullWidth onClick={onClose}>
          Đóng
        </Button>
      </Box>
    </Modal>
  );
};
