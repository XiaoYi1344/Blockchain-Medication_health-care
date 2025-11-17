// "use client";
// import React, { useMemo, useState, useEffect } from "react";
// import {
//   Box,
//   Stack,
//   Typography,
//   Paper,
//   IconButton,
//   Tooltip,
// } from "@mui/material";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import HighlightOffIcon from "@mui/icons-material/HighlightOff";

// import { DataGrid, GridColDef } from "@mui/x-data-grid";

// import { useEntityPermission } from "@/hooks/database/useEntityPermission";
// import DrugFilter from "./DrugFilter";
// import DrugDetailModal from "./DrugDetailModal";
// import { backendService } from "@/services/drugService";

// import type { BackendProduct, DrugFilterValues } from "@/types/drug";

// // type ProductStatus = "sent" | "active" | "inactive";

// export default function DrugTablePending() {
//   const perms = useEntityPermission("product");
//   const canApprove = perms.canApprove || perms.canEdit;

//   const [products, setProducts] = useState<BackendProduct[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [filter, setFilter] = useState<DrugFilterValues>({});
//   const [selected, setSelected] = useState<BackendProduct | null>(null);
//   const [openDetail, setOpenDetail] = useState(false);

//   // ============================
//   // Fetch products pending approval
//   // ============================
//   useEffect(() => {
//     let isMounted = true;
//     const controller = new AbortController();

//     const fetchPendingProducts = async () => {
//       if (!isMounted) return;
//       setLoading(true);
//       try {
//         const userProducts = await backendService.getForUser({
//           signal: controller.signal,
//         });
//         const beProducts = userProducts.filter((p) => p.isActive === "sent");

//         if (isMounted) setProducts(beProducts);
//       } catch (err) {
//         if (isMounted) setProducts([]);
//         console.error("lỗi:", err);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchPendingProducts();

//     return () => {
//       isMounted = false;
//       controller.abort();
//     };
//   }, []);

//   // ============================
//   // Filter rows
//   // ============================
//   // const filtered = useMemo(() => {
//   //   console.log("🧮 Filtering...", { filter, products });
//   //   return products.filter((p) => {
//   //     if (
//   //       filter.name &&
//   //       !p.name?.toLowerCase().includes(filter.name.toLowerCase())
//   //     )
//   //       return false;
//   //     if (filter.companyCode && p.companyCode !== filter.companyCode)
//   //       return false;
//   //     if (filter.category && !p.categoryIds?.includes(filter.category))
//   //       return false;
//   //     if (filter.status && p.isActive !== filter.status) return false;
//   //     return true;
//   //   });
//   // }, [products, filter]);
//   const filtered = useMemo(() => products, [products]);

//   // ============================
//   // Approve / Reject
//   // ============================
//   const handleApprove = async (
//     row: BackendProduct,
//     status: "active" | "inactive"
//   ) => {
//     try {
//       await backendService.approveProduct(row._id!, status);
//       alert(`✅ Thuốc đã được ${status === "active" ? "duyệt" : "từ chối"}!`);
//       setProducts((prev) =>
//         prev.map((p) => (p._id === row._id ? { ...p, isActive: status } : p))
//       );
//     } catch (err) {
//       console.error(err);
//       alert("❌ Lỗi khi duyệt thuốc!");
//     }
//   };

//   // ============================
//   // Columns
//   // ============================
//   const columns: GridColDef[] = [
//     { field: "name", headerName: "Tên thuốc", flex: 1 },
//     { field: "companyCode", headerName: "Mã công ty", width: 150 },
//     { field: "gtin", headerName: "GTIN", width: 150 },
//     {
//       field: "actions",
//       headerName: "Hành động",
//       width: 240,
//       renderCell: (params) => {
//         const row = params.row as BackendProduct;
//         return (
//           <Stack direction="row" spacing={1}>
//             <Tooltip title="Xem chi tiết" arrow enterDelay={300} leaveDelay={0}>
//               <IconButton
//                 size="small"
//                 onClick={() => {
//                   setSelected(row);
//                   setOpenDetail(true);
//                 }}
//               >
//                 <VisibilityIcon />
//               </IconButton>
//             </Tooltip>

//             {canApprove && (
//               <>
//                 <Tooltip
//                   title="Duyệt (Active)"
//                   arrow
//                   disableInteractive
//                   enterDelay={300}
//                   leaveDelay={0}
//                   slotProps={{
//                     popper: {
//                       modifiers: [
//                         { name: "preventOverflow", enabled: false },
//                         { name: "hide", enabled: false },
//                       ],
//                     },
//                   }}
//                   componentsProps={{
//                     tooltip: {
//                       sx: {
//                         bgcolor: "#5cc1a6", // nền xanh
//                         color: "#fff", // chữ trắng
//                         fontSize: 14,
//                         borderRadius: 4,
//                         padding: "6px 12px",
//                         boxShadow: "0px 3px 10px rgba(0,0,0,0.2)",
//                       },
//                     },
//                     arrow: {
//                       sx: {
//                         color: "#5cc1a6",
//                       },
//                     },
//                   }}
//                 >
//                   <IconButton
//                     color="success"
//                     size="small"
//                     onClick={() => handleApprove(row, "active")}
//                   >
//                     <CheckCircleIcon />
//                   </IconButton>
//                 </Tooltip>

//                 <Tooltip
//                   title="Từ chối"
//                   arrow
//                   disableInteractive
//                   enterDelay={0}
//                   leaveDelay={0}
//                   slotProps={{
//                     popper: {
//                       modifiers: [
//                         { name: "preventOverflow", enabled: false },
//                         { name: "hide", enabled: false },
//                       ],
//                     },
//                   }}
//                   componentsProps={{
//                     tooltip: {
//                       sx: {
//                         bgcolor: "#d32f2f", // nền xanh
//                         color: "#fff", // chữ trắng
//                         fontSize: 14,
//                         borderRadius: 4,
//                         padding: "6px 12px",
//                         boxShadow: "0px 3px 10px rgba(0,0,0,0.2)",
//                       },
//                     },
//                     arrow: {
//                       sx: {
//                         color: "#d32f2f",
//                       },
//                     },
//                   }}
//                 >
//                   <IconButton
//                     color="error"
//                     size="small"
//                     onClick={() => handleApprove(row, "inactive")}
//                   >
//                     <HighlightOffIcon />
//                   </IconButton>
//                 </Tooltip>

//               </>
//             )}
//           </Stack>
//         );
//       },
//     },
//   ];

//   // ============================
//   // Render
//   // ============================
//   return (
//     <Box>
//       <Stack
//         direction="row"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={2}
//       >
//         <Typography variant="h6">Thuốc chờ duyệt</Typography>
//       </Stack>

//       <Paper sx={{ p: 2 }}>
//         <DrugFilter value={filter} onChange={setFilter} />
//         <div style={{ height: 450, width: "100%" }}>
//           <DataGrid
//             rows={filtered}
//             columns={columns}
//             loading={loading}
//             pageSizeOptions={[10, 25]}
//             getRowId={(row) =>
//               row._id ?? row.productId ?? row.gtin ?? Math.random().toString()
//             }
//             sx={{
//               "& .MuiDataGrid-cell": {
//                 overflow: "visible !important", // cho phép tooltip không bị cắt
//               },
//               "& .MuiTooltip-popper": {
//                 zIndex: 1500, // tooltip nổi lên trên mọi thứ
//               },
//             }}
//           />
//         </div>
//       </Paper>

//       <DrugDetailModal
//         open={openDetail}
//         product={selected}
//         onClose={() => setOpenDetail(false)}
//       />
//     </Box>
//   );
// }

"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { useEntityPermission } from "@/hooks/database/useEntityPermission";
import DrugFilter from "./DrugFilter";
import DrugDetailModal from "./DrugDetailModal";
import { backendService } from "@/services/drugService";
import type { BackendProduct, DrugFilterValues } from "@/types/drug";
import toast from "react-hot-toast";

export default function DrugTablePending() {
  const perms = useEntityPermission("product");
  const canApprove = perms.canApprove || perms.canEdit;

  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DrugFilterValues>({});
  const [selected, setSelected] = useState<BackendProduct | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  // ============================
  // Fetch products pending approval
  // ============================
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchPendingProducts = async () => {
      setLoading(true);
      try {
        const userProducts = await backendService.getForUser({
          signal: controller.signal,
        });

        // Lọc sản phẩm trạng thái "sent" và chưa xóa (isActive === "sent")
        const beProducts = userProducts.filter(
          (p) => p.isActive === "sent" && p.onChain === false
        );

        if (isMounted) setProducts(beProducts);
      } catch (err) {
        console.error("Lỗi fetch sản phẩm:", err);
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPendingProducts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // ============================
  // Filter rows
  // ============================
  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (
        filter.name &&
        !p.name?.toLowerCase().includes(filter.name.toLowerCase())
      )
        return false;
      if (filter.companyCode && p.companyCode !== filter.companyCode)
        return false;
      if (filter.category && !p.categoryIds?.includes(filter.category))
        return false;
      if (filter.status && p.isActive !== filter.status) return false;
      return true;
    });
  }, [products, filter]);

  // ============================
  // Approve / Reject
  // ============================
  // const handleApprove = async (row: BackendProduct, status: "active" | "inactive") => {
  //   try {
  //     await backendService.approveProduct(row._id!, status);
  //     toast.success(`✅ Thuốc đã được ${status === "active" ? "duyệt" : "từ chối"}!`);
  //     setProducts((prev) =>
  //       prev.map((p) => (p._id === row._id ? { ...p, isActive: status } : p))
  //     );
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("❌ Lỗi khi duyệt thuốc!");
  //   }
  // };
  const handleApprove = async (
    row: BackendProduct,
    status: "active" | "inactive"
  ) => {
    try {
      await backendService.approveProduct(row._id!, status);
      toast.success(
        `✅ Thuốc đã được ${status === "active" ? "duyệt" : "từ chối"}!`
      );

      // ✅ Cập nhật state local, loại bỏ nếu đã không còn pending
      setProducts(
        (prev) =>
          prev
            .map((p) => (p._id === row._id ? { ...p, isActive: status } : p))
            .filter((p) => p.isActive === "sent") // chỉ giữ những sản phẩm vẫn pending
      );
    } catch (err) {
      console.error(err);
      toast.error("❌ Lỗi khi duyệt thuốc!");
    }
  };

  // ============================
  // Columns
  // ============================
  const columns: GridColDef[] = [
    { field: "name", headerName: "Tên thuốc", flex: 1 },
    { field: "companyCode", headerName: "Mã công ty", width: 150 },
    { field: "gtin", headerName: "GTIN", width: 150 },
    // { field: "txHash", headerName: "Tx Hash", width: 50 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 240,
      renderCell: (params) => {
        const row = params.row as BackendProduct;
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Xem chi tiết" arrow>
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

            {canApprove && (
              <>
                <Tooltip title="Duyệt (Active)" arrow>
                  <IconButton
                    color="success"
                    size="small"
                    onClick={() => handleApprove(row, "active")}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Từ chối" arrow>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleApprove(row, "inactive")}
                  >
                    <HighlightOffIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Stack>
        );
      },
    },
  ];

  // ============================
  // Render
  // ============================
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Thuốc chờ duyệt</Typography>
      </Stack>

      <Paper sx={{ p: 2 }}>
        <DrugFilter value={filter} onChange={setFilter} />
        <div style={{ height: 450, width: "100%" }}>
          <DataGrid
            rows={filtered}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10, 25]}
            getRowId={(row) =>
              row._id ?? row.productId ?? row.gtin ?? Math.random().toString()
            }
            sx={{
              "& .MuiDataGrid-cell": { overflow: "visible !important" },
              "& .MuiTooltip-popper": { zIndex: 1500 },
            }}
          />
        </div>
      </Paper>

      <DrugDetailModal
        open={openDetail}
        product={selected}
        onClose={() => setOpenDetail(false)}
      />
    </Box>
  );
}
