import React, { useRef, useState } from "react";
import { Paper, Typography, Stack, Box, Button } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import type { Html5Qrcode } from "html5-qrcode";

type QRScannerProps = {
  onScan: (result: string) => void;
  onError?: (err: string | Error) => void;
  label?: string;
};

export default function QRScanner({
  onScan,
  onError,
  label = "QR Scanner",
}: QRScannerProps) {
  const html5QrRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);

  async function startScanner() {
    setScanning(true);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const config = { fps: 10, qrbox: 250 };
      const qrRegionId = "html5qr-scanner";
      html5QrRef.current = new Html5Qrcode(qrRegionId);
      await html5QrRef.current.start(
        { facingMode: "environment" },
        config,
        (decodedText: string) => onScan(decodedText),
        () => {} // callback vẫn cần, nhưng không dùng tham số
      );
    } catch (err) {
      onError?.(err instanceof Error ? err : String(err));
    }
  }

  async function stopScanner() {
    setScanning(false);
    try {
      if (html5QrRef.current) {
        await html5QrRef.current.stop();
        await html5QrRef.current.clear();
        html5QrRef.current = null;
      }
      const el = document.getElementById("html5qr-scanner");
      if (el) el.innerHTML = "";
    } catch {}
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      const QRScanner = (await import("qr-scanner")).default;
      const result = await QRScanner.scanImage(file); // ✅ bỏ returnDetailedScanResult
      if (result) onScan(result);
    } catch (err) {
      onError?.(err instanceof Error ? err : String(err));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <Paper
      elevation={3}
      sx={{ p: 2, borderRadius: 3, width: "100%", maxWidth: 420 }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>
        {label}
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
        <Button
          startIcon={<CameraAltIcon />}
          variant={scanning ? "outlined" : "contained"}
          onClick={() => (scanning ? stopScanner() : startScanner())}
        >
          {scanning ? "Dừng quét" : "Quét bằng camera"}
        </Button>
        <Button
          startIcon={<UploadFileIcon />}
          variant="outlined"
          component="label"
        >
          Quét từ ảnh
          <input
            ref={fileInputRef}
            hidden
            accept="image/*"
            type="file"
            onChange={onFileChange}
          />
        </Button>
      </Stack>
      <Box id="html5qr-scanner" sx={{ mt: 2 }} />
    </Paper>
  );
}
