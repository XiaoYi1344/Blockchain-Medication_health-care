"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useDrugServices } from "@/hooks/database/useDrug";
import { contractService } from "@/services/contract/drugContract";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { useAppKitAccount } from "@reown/appkit/react";
import { BackendProduct, ProductType } from "@/types/drug";
import DrugDetailModal from "./DrugDetailModal";
import { backendService } from "@/services/drugService";

export default function DrugTableOnchain() {
  const { merged, loading, setBackendProducts } = useDrugServices();

  const { address, isConnected } = useAppKitAccount();

  // 🔹 State cho modal chi tiết
  const [selectedProduct, setSelectedProduct] =
    useState<BackendProduct | null>(null);
  const [openModal, setOpenModal] = useState(false);

  // =============================
  // 🧩 Lọc thuốc chờ onchain
  // =============================
  const waitingOnchain = useMemo(() => {
  if (!merged) return [];
  return merged.filter(
    (p) => p.isActive === "active" && p.onChain === false
  );
}, [merged]);


  // =============================
  // 🧩 Upload function
  // =============================
 const handleUploadToChain = async (row: BackendProduct & { origin?: string; productType?: ProductType }) => {
  if (!isConnected || !window.ethereum) {
    toast.error("⚠️ Vui lòng kết nối ví trước khi đẩy lên blockchain!");
    return;
  }

  const toastId = toast.loading("⏳ Đang gửi giao dịch lên blockchain...");

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();

    if (Number(network.chainId) !== 5080) {
      toast.dismiss(toastId);
      toast.error("⚠️ Sai mạng! Hãy chuyển sang PZO Network (ChainID 5080)");
      return;
    }

    // 🧩 1. Gọi smart contract để on-chain
    const tx = await contractService.createProduct(signer, {
      name: row.name,
      uom: row.uom || "viên",
      uomQuantity: row.uomQuantity || 1,
      companyCode: row.companyCode ?? "",
      productType: row.productType || "domestic",
      gtin: row.gtin ?? "",
      origin: row.origin || "",
      description: row.description || "",
      txHash: row.txHash || "",
    });

    toast.dismiss(toastId);
    toast.success(`✅ Thuốc "${row.name}" đã được đưa lên blockchain!`);

   // 🧩 Cập nhật ngay frontend — không cần reload
setBackendProducts((prev) =>
  (prev ?? []).map((item) =>
    item._id === row._id ? { ...item, onChain: true } : item
  )
);


    console.log("📦 Tx:", tx);
    console.log("📜 Hash:", tx?.hash || tx?.transactionHash);

    // 🧩 2. Gọi API backend cập nhật
    await backendService.updateProduct({
      productId: row._id,
      name: row.name,
      gtin: row.gtin,
      type: row.productType || "domestic",
      onChain: true,
    });

    toast.success("✅ Backend đã cập nhật trạng thái onChain!");
  } catch (err) {
    console.error("❌ Lỗi:", err);
    toast.dismiss(toastId);
    toast.error(`❌ Giao dịch thất bại: ${String(err)}`);
  }
};



  // =============================
  // 🧩 Columns setup
  // =============================
  const columns: GridColDef[] = [
    { field: "name", headerName: "Tên thuốc", flex: 1 },
    { field: "companyCode", headerName: "Mã công ty", width: 150 },
    { field: "gtin", headerName: "GTIN", width: 150 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 180,
      renderCell: (params) => {
        const row = params.row;
        const disabled = !isConnected;

        return (
          <Stack direction="row" spacing={1}>
            {/* 👁️ Nút xem chi tiết */}
            <Tooltip title="Xem chi tiết thuốc">
              <IconButton
                size="small"
                onClick={() => {
                  setSelectedProduct(row);
                  setOpenModal(true);
                }}
              >
                <VisibilityIcon color="info" />
              </IconButton>
            </Tooltip>

            {/* ☁️ Upload lên blockchain */}
            <Tooltip
              title={
                disabled
                  ? "⚠️ Vui lòng kết nối ví trước!"
                  : "Đưa thuốc này lên blockchain"
              }
            >
              <span>
                <IconButton
                  size="small"
                  onClick={() => handleUploadToChain(row)}
                  disabled={disabled}
                  color={disabled ? "default" : "primary"}
                >
                  <CloudUploadIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  // =============================
  // 🧩 Render
  // =============================
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Thuốc chờ onchain</Typography>
        <Button variant="outlined" color={isConnected ? "success" : "primary"}>
          {isConnected
            ? `Đã kết nối: ${address?.slice(0, 6)}...${address?.slice(-4)}`
            : "Chưa kết nối ví"}
        </Button>
      </Stack>

      <Paper sx={{ p: 2 }}>
        <div style={{ height: 450, width: "100%" }}>
          <DataGrid
            rows={waitingOnchain}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10, 25]}
            getRowId={(row) =>
              row._id ?? row.productId ?? row.gtin ?? Math.random().toString()
            }
          />
        </div>
      </Paper>

      {/* Modal chi tiết thuốc */}
      <DrugDetailModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        product={selectedProduct}
      />
    </Box>
  );
}
