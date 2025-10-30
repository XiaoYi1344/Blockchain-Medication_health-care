"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";

import { useEntityPermission } from "@/hooks/database/useEntityPermission";
import DrugFilter from "./DrugFilter";
import DrugDetailModal from "./DrugDetailModal";
import DrugForm from "./DrugForm";
import { MergedProduct, useDrugServices } from "@/hooks/database/useDrug";
import { backendService } from "@/services/drugService";

import type {
  BackendProduct,
  DraftProductRow,
  DrugFilterValues,
  ActiveIngredient,
  StorageCondition,
} from "@/types/drug";
import type { FormValues } from "./DrugForm";

type OpenFormState = null | {
  mode: "create" | "edit" | "editImage";
  initial?: FormValues;
};

export default function DrugTableApproved() {
  // ✅ Lấy thêm reload() từ hook
  const { merged, loading: mergedLoading, reload } = useDrugServices();
  const perms = useEntityPermission("product");
  const canCreate = perms.canCreate;
  const canUpdateImage = perms.canEdit;

  const [filter, setFilter] = useState<DrugFilterValues>({});
  const [selected, setSelected] = useState<
    MergedProduct | BackendProduct | DraftProductRow | null
  >(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openForm, setOpenForm] = useState<OpenFormState>(null);
  // const [products, setProducts] = useState<BackendProduct[]>([]);

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false; // khi unmount → đánh dấu false
    };
  }, []);

  const approvedRows = useMemo(() => {
    if (!merged) return [];
    return merged
      .filter((p) => canCreate || Boolean(p.onChainData))
      .map((p, index) => ({
        id: p._id || p.productCode || p.gtin || index,
        ...p,
      }));
  }, [merged, canCreate]);

  const filtered = useMemo(() => {
    return approvedRows.filter((r) => {
      if (
        filter.name &&
        !r.name?.toLowerCase().includes(filter.name.toLowerCase())
      )
        return false;
      if (filter.companyCode && r.companyCode !== filter.companyCode)
        return false;
      if (filter.category && !r.categoryIds?.includes(filter.category))
        return false;
      if (filter.status && r.isActive !== filter.status) return false;
      return true;
    });
  }, [approvedRows, filter]);

  const isDraft = (
    row: DraftProductRow | BackendProduct
  ): row is DraftProductRow => "data" in row && row.data !== undefined;

  const mapToFormValues = (
    row: DraftProductRow | BackendProduct
  ): FormValues => {
    const baseData: Partial<BackendProduct> = isDraft(row)
      ? (row.data as Partial<BackendProduct>)
      : row;

    const mapActiveIngredient = (
      ai?: ActiveIngredient
    ): FormValues["activeIngredient"][0] => ({
      name: ai?.name ?? "",
      strength: ai?.strength ?? "",
      route:
        (ai?.route as
          | "oral"
          | "injection"
          | "IV infusion"
          | "inhalation"
          | "rectal insertion") ?? "oral",
    });

    const mapStorageCondition = (
      sc?: StorageCondition
    ): FormValues["storageConditions"][0] => ({
      temperature: sc?.temperature ?? "",
      humidity: sc?.humidity ?? "",
      type: sc?.type ?? "domestic",
    });

    return {
      _id: baseData._id ?? "",
      name: baseData.name ?? "",
      description: baseData.description ?? "",
      categoryIds: baseData.categoryIds ?? [],
      images: Array.isArray(baseData.images) ? baseData.images : [],
      imagePrimary: baseData.imagePrimary
        ? Array.isArray(baseData.imagePrimary)
          ? baseData.imagePrimary[0] ?? null
          : (baseData.imagePrimary as File) // or convert to File if needed
        : null,

      uom: baseData.uom ?? "",
      uomQuantity: baseData.uomQuantity ? Number(baseData.uomQuantity) : 0,
      gtin: baseData.gtin ?? "",
      activeIngredient: (baseData.activeIngredient ?? []).map(
        mapActiveIngredient
      ),
      storageConditions: (baseData.storageConditions ?? []).map(
        mapStorageCondition
      ),
    };
  };

  // ✅ Gửi duyệt thuốc DB — reload sau khi thành công
  const sendForApprovalDB = async (product: BackendProduct) => {
    try {
      if (!product._id) return toast.error("Không tìm thấy productId!");

      await backendService.sendProductToManager(product._id);
      toast.success("✅ Đã gửi duyệt thành công!");

      if (isMounted.current) {
        await reload(); // chỉ reload khi component còn mount
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Gửi duyệt thất bại!");
    }
  };

  const handleSaved = async () => {
    try {
      await reload(); // reload danh sách
    } catch (err) {
      console.error(err);
    } finally {
      setOpenForm(null); // đóng form
    }
  };

  // ============================
  // Delete
  // ============================
  // const handleDeleteDraft = async (row: BackendProduct) => {
  //   if (!row._id) return;

  //   try {
  //     await backendService.deleteProduct(row._id);
  //     toast.success("✅ Thuốc draft đã được xóa!");

  //     // Cập nhật state để remove khỏi danh sách
  //     setProducts((prev) => prev.filter((p) => p._id !== row._id));
  //   } catch (err) {
  //     console.error("❌ Lỗi khi xóa draft:", err);
  //     toast.error("❌ Xóa thuốc thất bại!");
  //   }
  // };

  const handleDeleteDraft = async (row: BackendProduct) => {
  if (!row._id) return;

  try {
    await backendService.deleteProduct(row._id);
    toast.success("✅ Thuốc draft đã được xóa!");
    // reload danh sách thay vì setProducts
    await reload();
  } catch (err) {
    console.error("❌ Lỗi khi xóa draft:", err);
    toast.error("❌ Xóa thuốc thất bại!");
  }
};


  const getRowStatus = (
    row: MergedProduct | DraftProductRow
  ): "draft" | "sent" | "active" | "inactive" => {
    if ("data" in row && row.data) {
      return (
        (row.data.status as "draft" | "sent" | "active" | "inactive") || "draft"
      );
    }

    if ("isActive" in row) {
      return row.isActive || "inactive";
    }

    return "draft";
  };

  const getRowonChain = (
    row: MergedProduct | DraftProductRow
  ): "true" | "false" => {
    if ("data" in row && row.data) {
      const val = row.data.onChain;
      if (typeof val === "boolean") return val ? "true" : "false";
      if (typeof val === "string") return val === "true" ? "true" : "false";
      return "false";
    }

    if ("onChain" in row) {
      const val = row.onChain;
      if (typeof val === "boolean") return val ? "true" : "false";
      if (typeof val === "string") return val === "true" ? "true" : "false";
      return "false";
    }

    return "false";
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Tên", width: 180 },
    { field: "companyCode", headerName: "Mã công ty", width: 140 },
    { field: "gtin", headerName: "GTIN", width: 140 },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 120,
      renderCell: (params) => {
        const row = params.row as MergedProduct | DraftProductRow;
        const status = getRowStatus(row);

        let color: "default" | "success" | "warning" | "error" = "default";
        if (status === "draft") color = "warning";
        else if (status === "sent") color = "default";
        else if (status === "active") color = "success";
        else if (status === "inactive") color = "error";

        return <Chip label={status} color={color} size="small" />;
      },
    },
    {
      field: "onChain",
      headerName: "On-chain",
      width: 120,
      renderCell: (params) => {
        const row = params.row as MergedProduct | DraftProductRow;
        const onChain = getRowonChain(row);
        const label = onChain === "true" ? "onChain" : "offChain";
        const color: "default" | "success" | "warning" =
          onChain === "true" ? "success" : "default";
        return <Chip label={label} color={color} size="small" />;
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 240,
      renderCell: (params) => {
        const row = params.row as MergedProduct | DraftProductRow;
        const status = getRowStatus(row);

        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Xem chi tiết">
              <IconButton
                size="small"
                onClick={() => {
                  setSelected(row);
                  setOpenDetail(true);
                }}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>

            {status === "draft" && (
              <>
                <Button
                  size="small"
                  onClick={() =>
                    setOpenForm({ mode: "edit", initial: mapToFormValues(row) })
                  }
                >
                  Sửa
                </Button>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => sendForApprovalDB(row as BackendProduct)}
                >
                  Gửi duyệt
                </Button>

                <Tooltip
                  title="Xóa"
                  arrow
                  disableInteractive
                  enterDelay={300}
                  leaveDelay={0}
                  slotProps={{
                    popper: {
                      modifiers: [
                        { name: "preventOverflow", enabled: false },
                        { name: "hide", enabled: false },
                      ],
                    },
                  }}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: "#d32f2f", // nền xanh
                        color: "#fff", // chữ trắng
                        fontSize: 14,
                        borderRadius: 4,
                        padding: "6px 12px",
                        boxShadow: "0px 3px 10px rgba(0,0,0,0.2)",
                      },
                    },
                    arrow: {
                      sx: {
                        color: "#d32f2f",
                      },
                    },
                  }}
                >
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => {
                      if (confirm("⚠️ Bạn có chắc muốn xóa draft này không?")) {
                        handleDeleteDraft(row);
                      }
                    }}
                  >
                    <DeleteForeverOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}

            {"isActive" in row && canUpdateImage && (
              <Tooltip title="Sửa ảnh">
                <IconButton
                  size="small"
                  onClick={() =>
                    setOpenForm({
                      mode: "editImage",
                      initial: mapToFormValues(row),
                    })
                  }
                >
                  <ImageIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        );
      },
    },
  ];

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Thuốc đã duyệt</Typography>
        {canCreate && (
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => setOpenForm({ mode: "create" })}
          >
            Thêm thuốc
          </Button>
        )}
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <DrugFilter value={filter} onChange={setFilter} />
        <div style={{ height: 420, width: "100%" }}>
          <DataGrid
            rows={filtered}
            columns={columns}
            loading={mergedLoading}
            pageSizeOptions={[10, 25]}
          />
        </div>
        {filtered.length === 0 && !mergedLoading && (
          <Typography color="text.secondary" mt={1}>
            {!canCreate
              ? "Bạn không có quyền xem thuốc đã onChain."
              : "Không có thuốc đã duyệt để hiển thị."}
          </Typography>
        )}
      </Paper>

      {/* 🔍 Modal xem chi tiết */}
      <DrugDetailModal
        open={openDetail}
        product={selected}
        onClose={() => setOpenDetail(false)}
        onEdit={() =>
          selected &&
          setOpenForm({ mode: "edit", initial: mapToFormValues(selected) })
        }
      />

      {/* ✏️ Form thêm / sửa thuốc */}
      {openForm && (
        // <DrugForm
        //   open={!!openForm}
        //   mode={openForm.mode}
        //   initial={openForm.initial}
        //   onClose={() => setOpenForm(null)}
        //   onSaved={() => {
        //     reload(); // 🔁 Tự động reload lại danh sách sau khi lưu
        //     setOpenForm(null);
        //   }}
        // />
        <DrugForm
          open={!!openForm}
          mode={openForm.mode}
          initial={openForm.initial}
          onClose={() => setOpenForm(null)}
          onSaved={handleSaved}
        />
      )}
    </Box>
  );
}
