"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Stack,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import {
  useCreateBatch,
  useUpdateBatch,
  useUpdateBatchState,
} from "@/hooks/database/useBatch";
import { MergedProduct } from "@/hooks/database/useDrug"; // giữ nguyên type
import { backendService } from "@/services/drugService"; // ⚡ import thêm
// import { contractService } from "@/services/contract/drugContract"; // ⚡ import thêm
import { BackendProduct } from "@/types/drug";

// ---------------- Batch interface ----------------
export interface Batch {
  batchCode: string;
  productCode: string;
  txHash: string;
  expectedQuantity: number;
  estimatedDate: string;
  EXP: string;
  state:
    | "DRAFT"
    | "APPROVAL"
    | "IN_PRODUCTION"
    | "IN_STOCK"
    | "SOLD_OUT"
    | "RECALL";
  images?: string[];
}

// ---------------- Form interface ----------------
interface BatchForm {
  batchCode?: string;
  productCode: string;
  txHash: string;
  expectedQuantity: number;
  estimatedDate: string;
  EXP: string;
  images: File[];
  deleteImages: string[];
  state: Batch["state"];
}

interface BatchModalProps {
  open: boolean;
  mode: "create" | "update" | "updateState";
  batch?: Batch;
  onClose: () => void;
}

export const BatchModal: React.FC<BatchModalProps> = ({
  open,
  mode,
  batch,
  onClose,
}) => {
  const createBatchMutation = useCreateBatch();
  const updateBatchMutation = useUpdateBatch();
  const updateStateMutation = useUpdateBatchState();

  // ⚡ Thay vì lấy từ useDrugServices
  const [products, setProducts] = useState<MergedProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  const [form, setForm] = useState<BatchForm>({
    productCode: "",
    txHash: "",
    expectedQuantity: 0,
    estimatedDate: "",
    EXP: "",
    images: [],
    deleteImages: [],
    state: "DRAFT",
  });

  // ⚡ Fetch product list chỉ khi mở modal tạo batch
  useEffect(() => {
    if (mode !== "create") return;

    let isMounted = true;
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const res: BackendProduct[] = await backendService.getApprovedProducts(
          "active"
        );
        const activeOnChain: MergedProduct[] = res
          .filter((p) => p.onChain)
          .map((p) => ({ ...p, onChainData: null }));

        if (isMounted) {
          setProducts(activeOnChain);
          console.log("✅ products set:", activeOnChain);
        }
      } catch (err) {
        console.error("❌ Lỗi khi load sản phẩm:", err);
      } finally {
        if (isMounted) setProductsLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [mode]);

  // -------------------------------------------------------
  // giữ nguyên logic form, handleChange, handleSubmit ...
  // -------------------------------------------------------
  useEffect(() => {
    if (!open) return;

    if (batch) {
      setForm({
        batchCode: batch.batchCode,
        productCode: batch.productCode,
        txHash: batch.txHash,
        expectedQuantity: batch.expectedQuantity ?? 0,
        estimatedDate: batch.estimatedDate ?? "",
        EXP: batch.EXP ?? "",
        images: [],
        deleteImages: [],
        state: batch.state,
      });
    } else {
      setForm({
        productCode: "",
        txHash: "",
        expectedQuantity: 0,
        estimatedDate: "",
        EXP: "",
        images: [],
        deleteImages: [],
        state: "DRAFT",
      });
    }
  }, [open, batch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setForm((prev) => ({ ...prev, images: Array.from(files) }));
  };

  const handleSubmit = async () => {
    const readFileAsBase64 = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    if (mode === "create") {
      const imagesBase64 = await Promise.all(form.images.map(readFileAsBase64));
      await createBatchMutation.mutateAsync({
        productCode: form.productCode,
        txHash: form.txHash,
        expectedQuantity: form.expectedQuantity,
        estimatedDate: form.estimatedDate,
        EXP: form.EXP,
        images: imagesBase64,
      });
    }

    if (mode === "update") {
      const imagesBase64 = await Promise.all(form.images.map(readFileAsBase64));
      if (!form.batchCode) return;
      await updateBatchMutation.mutateAsync({
        batchCode: form.batchCode,
        txHash: form.txHash,
        expectedQuantity: form.expectedQuantity,
        images: imagesBase64,
        deleteImages: form.deleteImages,
      });
    }

    if (mode === "updateState") {
      if (!form.batchCode) return;
      await updateStateMutation.mutateAsync({
        batchCode: form.batchCode,
        state: form.state,
      });
    }

    onClose();
  };

  // -------------------------------------------------------
  // UI: sửa phần Autocomplete để dùng `products` state cục bộ
  // -------------------------------------------------------
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === "create" && "Tạo Lô Mới"}
        {mode === "update" && "Cập nhật Lô"}
        {mode === "updateState" && "Cập nhật Trạng thái Lô"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {(mode === "create" || mode === "update") && (
            <>
              {mode === "create" ? (
                productsLoading ? (
                  <CircularProgress />
                ) : (
                  <Autocomplete
                    options={products}
                    getOptionLabel={(option) =>
                      `${option.name} (${option.productCode})`
                    }
                    value={
                      products.find(
                        (p) => p.productCode === form.productCode
                      ) || null
                    }
                    onChange={(_, newValue) =>
                      setForm((prev) => ({
                        ...prev,
                        productCode: newValue?.productCode || "",
                      }))
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Chọn sản phẩm" />
                    )}
                  />
                )
              ) : (
                <TextField
                  label="Mã sản phẩm"
                  name="productCode"
                  value={form.productCode}
                  fullWidth
                  disabled
                />
              )}

              <TextField
                label="TxHash"
                name="txHash"
                value={form.txHash}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Số lượng dự kiến"
                name="expectedQuantity"
                type="number"
                value={form.expectedQuantity}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Ngày dự kiến hoàn thành"
                name="estimatedDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={form.estimatedDate}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Ngày hêt hạn"
                name="EXP"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={form.EXP}
                onChange={handleChange}
                fullWidth
              />
              <InputLabel>Ảnh lô (tùy chọn)</InputLabel>
              <input type="file" multiple onChange={handleFileChange} />
            </>
          )}

          {mode === "updateState" && (
            <Select
              value={form.state}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  state: e.target.value as Batch["state"],
                }))
              }
              fullWidth
            >
              {[
                "DRAFT",
                "APPROVAL",
                "IN_PRODUCTION",
                "IN_STOCK",
                "SOLD_OUT",
                "RECALL",
              ].map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};
