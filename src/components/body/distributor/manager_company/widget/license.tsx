"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Button,
  Stack,
  TextField,
  Chip,
  CircularProgress,
  Box,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { toast } from "sonner";
import {
  useLicenseServices,
  MergedLicense,
  useCreateLicenseV6,
} from "@/hooks/database/useLicense";
import {
  LicenseV6,
  CreateLicensePayloadV6,
  LicenseOnChain,
} from "@/types/license";
import { licenseContractService } from "@/services/contract/licenseContract";
import { ethers } from "ethers";
// license.tsx
interface Props {
  companyId?: string | null;
}

// Interface cho ảnh đã upload từ backend
interface UploadedImage {
  public_id: string;
  hash: string;
  _id: string;
}

export const LicenseWidget: React.FC<Props> = ({ companyId }) => {
  const API_BASE =
    process.env.NEXT_PUBLIC_BE_API_BASE ||
    "https://aurelio-untoned-yadiel.ngrok-free.dev";

  // =======================
  // Hooks & state
  // =======================
  const {
    merged: licenses,
    loading,
    error,
  } = useLicenseServices(companyId ?? "");

  const createMutation = useCreateLicenseV6();

  const [name, setName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [type, setType] = useState<LicenseV6["type"]>("business_license");

  // File[] để gửi backend
  const [images, setImages] = useState<File[]>([]);

  // Modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<MergedLicense | null>(
    null
  );
  const [txLoading, setTxLoading] = useState(false);

  // =======================
  // Handle file upload
  // =======================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selectedFiles]);
  };

  // =======================
  // Create license
  // =======================
  const handleCreate = () => {
    if (!name || !expiryDate)
      return toast.error("Vui lòng nhập đầy đủ thông tin");

    const payload: CreateLicensePayloadV6 = { name, expiryDate, type, images };

    toast
      .promise(createMutation.mutateAsync(payload), {
        loading: "Đang tạo giấy phép...",
        success: "Tạo giấy phép thành công!",
        error: "Tạo giấy phép thất bại",
      })
      .finally(() => {
        setName("");
        setExpiryDate("");
        setType("business_license");
        setImages([]);
      });
  };

  // =======================
  // On-chain license
  // =======================
  // const handleOnChain = async (license: LicenseV6) => {
  //   if (!window.ethereum) {
  //     toast.error("⚠️ Vui lòng kết nối ví MetaMask!");
  //     return;
  //   }

  //   setTxLoading(true);
  //   const toastId = toast.loading("⏳ Đang gửi license lên blockchain...");

  //   try {
  //     const provider = new ethers.BrowserProvider(window.ethereum);
  //     const signer = await provider.getSigner();
  //     const network = await provider.getNetwork();

  //     if (network.chainId !== 5080n) {
  //       toast.dismiss(toastId);
  //       toast.error("⚠️ Sai mạng! Hãy chuyển sang PZO Network (ChainID 5080)");
  //       setTxLoading(false);
  //       return;
  //     }

  //     const statusIndex = ["active","expired","revoked"].indexOf(license.status);
  // const safeStatus = statusIndex >= 1 ? statusIndex : 1; // default = draft

  //     const payload: LicenseOnChain = {
  //   id: license._id || `LIC-${Date.now()}`, // map _id -> id
  //   name: license.name,
  //   companyId: license.companyId,
  //   licenseId: license.licenseId,
  //   docHash: license.txHash || "",
  //   images: [], // luôn rỗng
  //   expiryDate: Math.floor(new Date(license.expiryDate).getTime() / 1000),
  //   licenseType: license.type,
  //   status: safeStatus,
  // };

  // console.log("Sending status to contract:", safeStatus);

  //     console.log("Dữ liệu sẽ gửi lên blockchain:", payload);

  //     const receipt = await licenseContractService.createLicense(signer, payload);

  //     toast.dismiss(toastId);
  //     toast.success(`✅ License "${license.name}" đã được ghi nhận trên blockchain!`);
  //     console.log("📜 Tx hash:", receipt.transactionHash);

  //     setSelectedLicense(prev =>
  //       prev && prev._id === license._id
  //         ? { ...prev, txHash: receipt.transactionHash }
  //         : prev
  //     );

  //   } catch (err: unknown) {
  //     console.error("❌ Lỗi contract:", err);
  //     let reason = "Không xác định được nguyên nhân";

  //     if (typeof err === "object" && err !== null) {
  //       const errObj = err as Record<string, unknown>;
  //       reason = typeof errObj.reason === "string"
  //         ? errObj.reason
  //         : typeof errObj.message === "string"
  //         ? errObj.message
  //         : reason;
  //     }

  //     toast.dismiss(toastId);
  //     toast.error(`❌ Gửi license thất bại: ${reason}`);
  //   } finally {
  //     setTxLoading(false);
  //   }
  // };

  const handleOnChain = async (license: LicenseV6) => {
    if (!window.ethereum) {
      toast.error("⚠️ Vui lòng kết nối ví MetaMask!");
      return;
    }

    setTxLoading(true);
    const toastId = toast.loading("⏳ Đang gửi license lên blockchain...");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      if (network.chainId !== 5080n) {
        toast.dismiss(toastId);
        toast.error("⚠️ Sai mạng! Hãy chuyển sang PZO Network (ChainID 5080)");
        setTxLoading(false);
        return;
      }

      const statusIndex = ["draft", "active", "expired", "revoked"].indexOf(
        license.status
      );
      const safeStatus = statusIndex >= 0 ? statusIndex : 0;

      const payload: LicenseOnChain = {
        id: license._id || `LIC-${Date.now()}`,
        name: license.name,
        companyId: license.companyId,
        licenseId: license.licenseId,
        docHash: license.txHash || "",
        images: [],
        expiryDate: Math.floor(new Date(license.expiryDate).getTime() / 1000),
        licenseType: license.type,
        status: safeStatus,
      };

      console.log("Dữ liệu sẽ gửi lên blockchain:", payload);

      const receipt = await licenseContractService.createLicense(
        signer,
        payload
      );

      toast.dismiss(toastId);
      toast.success(
        `✅ License "${license.name}" đã được ghi nhận trên blockchain!`
      );
      console.log("📜 Tx hash:", receipt.transactionHash);

      setSelectedLicense((prev) =>
        prev && prev._id === license._id
          ? { ...prev, txHash: receipt.transactionHash }
          : prev
      );
    } catch (err: unknown) {
      console.error("❌ Lỗi contract:", err);
      let reason = "Không xác định được nguyên nhân";

      if (typeof err === "object" && err !== null) {
        const errObj = err as Record<string, unknown>;
        reason =
          typeof errObj.reason === "string"
            ? errObj.reason
            : typeof errObj.message === "string"
            ? errObj.message
            : reason;
      }

      toast.dismiss(toastId);
      toast.error(`❌ Gửi license thất bại: ${reason}`);
    } finally {
      setTxLoading(false);
    }
  };

  const isExpired = (expiry: string) => new Date(expiry) < new Date();

  // =======================
  // Render
  // =======================
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Card sx={{ p: 2, borderRadius: 3 }}>
      <CardHeader title="Danh sách giấy phép" />
      <CardContent>
        {/* License table */}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày hết hạn</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {licenses?.map((lic) => (
                <TableRow key={lic._id}>
                  <TableCell>{lic.name}</TableCell>
                  <TableCell>{lic.type}</TableCell>
                  <TableCell>
                    <Chip
                      label={lic.status}
                      color={lic.status === "active" ? "success" : "default"}
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                    />
                    {isExpired(lic.expiryDate) && (
                      <Chip
                        label="Hết hạn"
                        color="error"
                        size="small"
                        sx={{ ml: 0.5 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{lic.expiryDate}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setSelectedLicense(lic);
                          setOpenModal(true);
                        }}
                      >
                        Xem chi tiết
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleOnChain(lic)}
                      >
                        On-chain
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Create license form */}
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Tạo giấy phép mới
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Ngày hết hạn"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Loại"
              value={type}
              onChange={(e) => setType(e.target.value as LicenseV6["type"])}
              size="small"
              fullWidth
              SelectProps={{ native: true }}
            >
              <option value="business_license">Business License</option>
              <option value="GMP_certificate">GMP Certificate</option>
              <option value="GDP_certificate">GDP Certificate</option>
              <option value="drug_license">Drug License</option>
            </TextField>

            <Button variant="outlined" component="label">
              Thêm ảnh
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>

            {images.length > 0 && (
              <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                {images.map((file, idx) => (
                  <Avatar
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    variant="rounded"
                    sx={{ width: 80, height: 80 }}
                  />
                ))}
              </Stack>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleCreate}
              disabled={createMutation.status === "pending"}
            >
              {createMutation.status === "pending"
                ? "Đang tạo..."
                : "Tạo giấy phép"}
            </Button>
          </Stack>
        </Box>
      </CardContent>

      {/* License detail modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chi tiết giấy phép</DialogTitle>
        <DialogContent dividers>
          {selectedLicense && (
            <Stack spacing={2}>
              <Typography>
                <strong>ID:</strong> {selectedLicense._id}
              </Typography>
              <Typography>
                <strong>Company ID:</strong> {selectedLicense.companyId}
              </Typography>
              <Typography>
                <strong>License ID:</strong> {selectedLicense.licenseId}
              </Typography>
              <Typography>
                <strong>Tx Hash:</strong>{" "}
                {selectedLicense.txHash || "Chưa on-chain"}
              </Typography>
              <Typography>
                <strong>Tên:</strong> {selectedLicense.name}
              </Typography>
              <Typography>
                <strong>Loại:</strong> {selectedLicense.type}
              </Typography>
              <Typography>
                <strong>Trạng thái:</strong> {selectedLicense.status}
                {isExpired(selectedLicense.expiryDate) && (
                  <Chip
                    label="Hết hạn"
                    color="error"
                    size="small"
                    sx={{ ml: 0.5 }}
                  />
                )}
              </Typography>
              <Typography>
                <strong>Ngày hết hạn:</strong> {selectedLicense.expiryDate}
              </Typography>

              {/* Images */}
              {selectedLicense.images?.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                  {(selectedLicense.images as unknown as UploadedImage[]).map(
                    (img) => (
                      <Box key={img.public_id} textAlign="center">
                        <Avatar
                          src={`${API_BASE}/api/upload/${img.public_id}`}
                          alt={img.public_id}
                          variant="rounded"
                          sx={{ width: 80, height: 80 }}
                        />
                      </Box>
                    )
                  )}
                </Stack>
              )}

              {/* On-chain data */}
              {selectedLicense.onChainData && (
                <Box mt={2}>
                  <Typography variant="subtitle2">On-chain Data:</Typography>
                  <Typography variant="body2">
                    Status: {selectedLicense.onChainData.status}
                  </Typography>
                  <Typography variant="body2">
                    Expiry: {selectedLicense.onChainData.expiryDate}
                  </Typography>
                </Box>
              )}
              {/* Blockchain payload preview */}
              <Box
                mt={2}
                p={2}
                sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}
              >
                {/* Dữ liệu sẽ gửi lên blockchain */}
                {selectedLicense && (
                  <Box mt={2} p={2} sx={{ borderTop: "1px solid #ccc" }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Dữ liệu sẽ gửi lên blockchain:
                    </Typography>
                    <Stack spacing={1}>
                      <Typography variant="body2">
                        <strong>ID:</strong>{" "}
                        {selectedLicense._id || `LIC-${Date.now()}`}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Tên:</strong> {selectedLicense.name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Company ID:</strong> {selectedLicense.companyId}
                      </Typography>
                      <Typography variant="body2">
                        <strong>License ID:</strong> {selectedLicense.licenseId}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Doc Hash:</strong>{" "}
                        {selectedLicense.txHash || "Chưa có"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Images:</strong>{" "}
                        {selectedLicense.images?.length
                          ? selectedLicense.images.join(", ")
                          : "[]"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Ngày hết hạn (timestamp):</strong>{" "}
                        {Math.floor(
                          new Date(selectedLicense.expiryDate).getTime() / 1000
                        )}
                      </Typography>
                      <Typography variant="body2">
                        <strong>License Type:</strong> {selectedLicense.type}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Status:</strong>{" "}
                        {
                          ["draft", "active", "expired", "revoked"][
                            Math.max(
                              0,
                              ["draft", "active", "expired", "revoked"].indexOf(
                                selectedLicense.status
                              )
                            )
                          ]
                        }
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Đóng</Button>
          <Button
            variant="contained"
            onClick={() => selectedLicense && handleOnChain(selectedLicense)}
            disabled={txLoading}
          >
            {txLoading ? "Đang gửi..." : "On-chain"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};
