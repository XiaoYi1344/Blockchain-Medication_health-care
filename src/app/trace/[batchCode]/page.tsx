// 'use client';

// import { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Card,
//   CardContent,
// } from "@mui/material";

// interface Batch {
//   _id: string;
//   batchCode: string;
//   initialQuantity: number;
//   state: string;
//   expiryDate?: string;
//   createdAt?: string;
// }

// interface ActiveIngredient {
//   name: string;
// }

// interface Product {
//   name: string;
//   productCode: string;
//   activeIngredient?: ActiveIngredient[];
// }

// interface TraceResponse {
//   batch: Batch;
//   product: Product;
// }

// const BACKEND_URL = process.env.NEXT_PUBLIC_BE_API_BASE;
// export default function TracePage({ params }: { params: { batchCode: string } }) {
//   const [data, setData] = useState<{ data?: TraceResponse } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch(
//           `${BACKEND_URL}/api/traceability`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ batchCode: params.batchCode }),
//           }
//         );
//         const json = await res.json();
//         if (!res.ok) throw new Error(json.error || "Lỗi không xác định");
//         setData(json);
//       } catch (err) {
//         if (err instanceof Error) setError(err.message);
//         else setError("Lỗi không xác định");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [params.batchCode]);

//   if (loading) return (
//     <Box sx={{ p: 8, textAlign: "center" }}>
//       <CircularProgress />
//     </Box>
//   );

//   if (error) return (
//     <Box sx={{ p: 8, textAlign: "center" }}>
//       <Typography color="error">{error}</Typography>
//     </Box>
//   );

//   if (!data?.data) return (
//     <Box sx={{ p: 8, textAlign: "center" }}>
//       <Typography>Không có dữ liệu truy xuất</Typography>
//     </Box>
//   );

//   const { product, batch } = data.data;

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h4" fontWeight="bold" mb={3}>
//         🔍 Truy xuất lô: {batch?.batchCode || "Chưa có"}
//       </Typography>

//       <Card sx={{ mb: 3 }}>
//         <CardContent>
//           <Typography variant="h6">Sản phẩm</Typography>
//           <Typography>{product?.name || "Chưa có tên"}</Typography>
//           <Typography>Mã SP: {product?.productCode || "Chưa có"}</Typography>
//           {product?.activeIngredient?.length ? (
//             <Typography>
//               Hoạt chất chính: {product.activeIngredient[0].name}
//               {product.activeIngredient.length > 1
//                 ? `, ${product.activeIngredient[1].name}`
//                 : ""}
//             </Typography>
//           ) : null}
//         </CardContent>
//       </Card>

//       <Card>
//         <CardContent>
//           <Typography variant="h6">Thông tin lô</Typography>
//           <Typography>Trạng thái: {batch?.state || "Chưa có"}</Typography>
//           <Typography>Ngày SX: {batch?.createdAt || "Chưa có"}</Typography>
//           <Typography>HSD: {batch?.expiryDate || "Chưa có"}</Typography>
//           <Typography>Số lượng ban đầu: {batch?.initialQuantity ?? "Chưa có"}</Typography>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

// 'use client';

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Card,
//   CardContent,
// } from "@mui/material";

// interface Batch {
//   _id: string;
//   batchCode: string;
//   initialQuantity: number;
//   state: string;
//   expiryDate?: string;
//   createdAt?: string;
// }

// interface ActiveIngredient {
//   name: string;
// }

// interface Product {
//   name: string;
//   productCode: string;
//   activeIngredient?: ActiveIngredient[];
// }

// interface TraceResponse {
//   batch: Batch;
//   product: Product;
// }

// export default function TracePage({ params }: { params: { batchCode: string } }) {
//   const searchParams = useSearchParams();
// const token = searchParams?.get("token") || ""; // ✅ null-safe

//   const [data, setData] = useState<TraceResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_BE_API_BASE}/api/traceability`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ batchCode: params.batchCode, token }),
//           }
//         );

//         if (!res.ok) {
//           const errText = await res.text();
//           throw new Error(errText || `Backend trả lỗi ${res.status}`);
//         }

//         const json: TraceResponse = await res.json();
//         setData(json);
//       } catch (err) {
//         if (err instanceof Error) setError(err.message);
//         else setError("Lỗi không xác định");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [params.batchCode, token]);

//   if (loading) return (
//     <Box sx={{ p: 8, textAlign: "center" }}>
//       <CircularProgress />
//     </Box>
//   );

//   if (error) return (
//     <Box sx={{ p: 8, textAlign: "center" }}>
//       <Typography color="error">{error}</Typography>
//     </Box>
//   );

//   if (!data) return (
//     <Box sx={{ p: 8, textAlign: "center" }}>
//       <Typography>Không có dữ liệu truy xuất</Typography>
//     </Box>
//   );

//   const { product, batch } = data;

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h4" fontWeight="bold" mb={3}>
//         🔍 Truy xuất lô: {batch?.batchCode || "Chưa có"}
//       </Typography>

//       <Card sx={{ mb: 3 }}>
//         <CardContent>
//           <Typography variant="h6">Sản phẩm</Typography>
//           <Typography>{product?.name || "Chưa có tên"}</Typography>
//           <Typography>Mã SP: {product?.productCode || "Chưa có"}</Typography>
//           {product?.activeIngredient?.length ? (
//             <Typography>
//               Hoạt chất chính: {product.activeIngredient.map(ai => ai.name).join(", ")}
//             </Typography>
//           ) : null}
//         </CardContent>
//       </Card>

//       <Card>
//         <CardContent>
//           <Typography variant="h6">Thông tin lô</Typography>
//           <Typography>Trạng thái: {batch?.state || "Chưa có"}</Typography>
//           <Typography>Ngày SX: {batch?.createdAt || "Chưa có"}</Typography>
//           <Typography>HSD: {batch?.expiryDate || "Chưa có"}</Typography>
//           <Typography>Số lượng ban đầu: {batch?.initialQuantity ?? "Chưa có"}</Typography>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

// 'use client';

// import { useSearchParams } from "next/navigation";
// import { Box, Typography, Card, CardContent, Skeleton } from "@mui/material";
// import { useQuery } from "@tanstack/react-query";

// interface Batch {
//   batchCode: string;
//   state: string;
//   initialQuantity: number;
//   createdAt?: string;
//   expiryDate?: string;
// }

// interface ActiveIngredient {
//   name: string;
//   strength?: string;
// }

// interface Product {
//   name: string;
//   productCode: string;
//   activeIngredient?: ActiveIngredient[];
//   description?: string;
//   uom?: string;
//   uomQuantity?: number;
// }

// interface TraceResponse {
//   batch: Batch;
//   product: Product;
// }

// interface BackendTraceResponse {
//   success: boolean;
//   message: string;
//   data: TraceResponse;
// }

// async function fetchTrace(batchCode: string, token: string): Promise<BackendTraceResponse> {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_BE_API_BASE}/api/traceability`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ batchCode, token }),
//   });

//   if (!res.ok) {
//     const errText = await res.text();
//     throw new Error(errText || `Backend trả lỗi ${res.status}`);
//   }

//   return res.json();
// }

// export default function TracePage({ params }: { params: { batchCode: string } }) {
//   const searchParams = useSearchParams();
//   const token = searchParams?.get("token") || "";

//   const { data, isLoading, error } = useQuery<BackendTraceResponse, Error>({
//     queryKey: ["trace", params.batchCode, token],
//     queryFn: () => fetchTrace(params.batchCode, token),
//     staleTime: 5 * 60 * 1000, // cache 5 phút
//   });

//   if (isLoading) {
//     return (
//       <Box sx={{ p: 4 }}>
//         <Skeleton variant="text" height={50} width="60%" />
//         <Skeleton variant="rectangular" height={120} sx={{ my: 2 }} />
//         <Skeleton variant="rectangular" height={120} sx={{ my: 2 }} />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: 8, textAlign: "center" }}>
//         <Typography color="error">{error.message}</Typography>
//       </Box>
//     );
//   }

//   if (!data?.data) {
//     return (
//       <Box sx={{ p: 8, textAlign: "center" }}>
//         <Typography>Không có dữ liệu truy xuất</Typography>
//       </Box>
//     );
//   }

//   const { product, batch } = data.data;

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h4" fontWeight="bold" mb={3}>
//         🔍 Truy xuất lô: {batch?.batchCode || "Chưa có"}
//       </Typography>

//       {/* Sản phẩm */}
//       <Card sx={{ mb: 3 }}>
//         <CardContent>
//           <Typography variant="h6">Sản phẩm</Typography>
//           <Typography>Tên: {product?.name || "Chưa có"}</Typography>
//           <Typography>Mã SP: {product?.productCode || "Chưa có"}</Typography>
//           {product?.description && <Typography>Mô tả: {product.description}</Typography>}
//           {product?.uom && product?.uomQuantity && (
//             <Typography>
//               Đơn vị: {product.uom}, Số lượng/đơn vị: {product.uomQuantity}
//             </Typography>
//           )}
//           {product?.activeIngredient?.length ? (
//             <Typography>
//               Hoạt chất: {product.activeIngredient.map((ai) => `${ai.name} ${ai.strength || ""}`).join(", ")}
//             </Typography>
//           ) : null}
//         </CardContent>
//       </Card>

//       {/* Lô */}
//       <Card>
//         <CardContent>
//           <Typography variant="h6">Thông tin lô</Typography>
//           <Typography>Trạng thái: {batch?.state || "Chưa có"}</Typography>
//           <Typography>Ngày SX: {batch?.createdAt || "Chưa có"}</Typography>
//           <Typography>HSD: {batch?.expiryDate || "Chưa có"}</Typography>
//           <Typography>Số lượng ban đầu: {batch?.initialQuantity ?? "Chưa có"}</Typography>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Skeleton,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Avatar,
} from "@mui/material";
import {
  CheckCircle,
  Pending,
  Medication,
  Factory,
  LocalHospital,
} from "@mui/icons-material";
import { useParams, useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_BE_API_BASE || "";

// ===== Types =====
interface StorageCondition {
  _id: string;
  temperature?: string;
  humidity?: string;
  type?: string;
}
interface ActiveIngredient {
  _id: string;
  name: string;
  strength?: string;
  route?: string;
  storageConditions?: StorageCondition[];
}
interface LicenseDocumentImage {
  public_id: string;
  hash: string;
  _id: string;
}
interface LicenseDocument {
  _id: string;
  name: string;
  type?: string;
  licenseId?: string;
  images?: LicenseDocumentImage[];
  txHash?: string;
  expiryDate?: string;
  createdAt?: string;
}
interface Product {
  _id: string;
  productCode: string;
  name: string;
  description?: string;
  uom?: string;
  uomQuantity?: number;
  images?: string[];
  imagePrimary?: string;
  txHash?: string;
  gtin?: string;
  activeIngredient?: ActiveIngredient[];
  categoryIds?: string[];
}
interface Manufacturer {
  _id: string;
  name: string;
  companyCode?: string;
  location?: string;
  phone?: string;
  images?: string[];
  licenseDocuments?: LicenseDocument[];
}
interface Batch {
  _id: string;
  batchCode: string;
  initialQuantity: number;
  state: string;
  manufactureDate?: string;
  EXP?: string;
  manufacturer?: Manufacturer;
}
interface Category {
  _id: string;
  name: string;
}
interface Hospital {
  _id: string;
  name: string;
  location?: string;
  phone?: string;
  images?: string[];
  companyCode?: string;
}
interface TraceResponse {
  product: Product;
  batch: Batch;
  manufacturer?: Manufacturer;
  hospitals?: Hospital[];
  categories?: Category[];
}
interface BackendTraceResponse {
  success: boolean;
  message: string;
  data?: TraceResponse;
}

// ===== Page Component =====
export default function TracePage() {
   const params = useParams(); // ✅ hook trả về { batchCode: "..." }
  const searchParams = useSearchParams(); // ✅ hook trả về đối tượng URLSearchParams

  const batchCode = params?.batchCode as string; // ép kiểu an toàn
  const token = searchParams?.get("token") || "";

  const [data, setData] = useState<TraceResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!batchCode) return;

    fetch(`${API_BASE}/api/traceability`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batchCode, token }),
    })
      .then((res) => res.json() as Promise<BackendTraceResponse>)
      .then((resJson) => {
        if (resJson.success && resJson.data) setData(resJson.data);
      })
      .catch((err) => console.error("Fetch trace error:", err))
      .finally(() => setLoading(false));
  }, [batchCode, token]);

  if (loading)
    return (
      <Box p={4}>
        <Skeleton variant="text" height={50} width="60%" />
        <Skeleton variant="rectangular" height={200} sx={{ my: 2 }} />
        <Skeleton variant="rectangular" height={200} sx={{ my: 2 }} />
      </Box>
    );

  if (!data)
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6" color="text.secondary">
          Không có dữ liệu truy xuất
        </Typography>
      </Box>
    );

  const { product, batch, hospitals, categories } = data;

  const renderPrimaryImage = (
    imagePrimary?: string,
    fallbackImages?: string[]
  ) => {
    const imageSrc = imagePrimary
      ? `${API_BASE}/api/upload/${imagePrimary}`
      : fallbackImages?.length
      ? `${API_BASE}/api/upload/${fallbackImages[0]}`
      : "/no-image.png";
    return (
      <Box mt={1} textAlign="center">
        <Avatar
          src={imageSrc}
          alt="Ảnh đại diện"
          variant="rounded"
          sx={{ width: 160, height: 120 }}
        />
      </Box>
    );
  };

  const renderImages = (images?: string[]) => {
    if (!images?.length) return null;
    return (
      <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
        {images.map((img, idx) => (
          <Box
            key={idx}
            component="img"
            src={`${API_BASE}/api/upload/${img}`}
            alt="image"
            sx={{
              width: 80,
              height: 80,
              objectFit: "cover",
              borderRadius: 1,
              border: "1px solid #ddd",
            }}
          />
        ))}
      </Stack>
    );
  };

  const categoryNames = product.categoryIds?.map((id) => {
    const cat = categories?.find((c) => c._id === id);
    return cat ? cat.name : id;
  });

  const steps = [
    {
      label: "Sản phẩm",
      content: (
        <Stack spacing={1}>
          {renderPrimaryImage(product.imagePrimary)}
          <Typography>
            <strong>Tên:</strong> {product.name}
          </Typography>
          <Typography>
            <strong>Mã SP:</strong> {product.productCode}
          </Typography>
          {product.description && (
            <Typography>
              <strong>Mô tả:</strong> {product.description}
            </Typography>
          )}
          {product.uom && product.uomQuantity && (
            <Typography>
              <strong>Đơn vị:</strong> {product.uom}, SL/đơn vị:{" "}
              {product.uomQuantity}
            </Typography>
          )}
          {product.gtin && (
            <Typography>
              <strong>GTIN:</strong> {product.gtin}
            </Typography>
          )}
          {product.txHash && (
            <Typography>
              <strong>TxHash:</strong> {product.txHash}
            </Typography>
          )}
          {categoryNames?.length && (
            <Typography>
              <strong>Danh mục:</strong> {categoryNames.join(", ")}
            </Typography>
          )}
          {product.activeIngredient?.length && (
            <>
              <Typography>
                <strong>Hoạt chất:</strong>
              </Typography>
              {product.activeIngredient.map((ai) => (
                <Box key={ai._id} ml={2} mb={1}>
                  <Typography>
                    - {ai.name} {ai.strength && `(${ai.strength})`}
                  </Typography>
                  {ai.route && (
                    <Typography ml={2}>Route: {ai.route}</Typography>
                  )}
                </Box>
              ))}
            </>
          )}
          {renderImages(product.images)}
        </Stack>
      ),
    },
    {
      label: "Lô",
      content: (
        <Stack spacing={1}>
          <Chip
            label={batch.state}
            color={batch.state === "delivering" ? "success" : "warning"}
            icon={batch.state === "delivering" ? <CheckCircle /> : <Pending />}
          />
          <Typography>
            <strong>Số lượng ban đầu:</strong> {batch.initialQuantity}
          </Typography>
          {batch.manufactureDate && (
            <Typography>
              <strong>Ngày SX:</strong>{" "}
              {new Date(batch.manufactureDate).toLocaleDateString()}
            </Typography>
          )}
          {batch.EXP && (
            <Typography>
              <strong>HSD:</strong> {new Date(batch.EXP).toLocaleDateString()}
            </Typography>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        textAlign="center"
        sx={{ color: "#0288d1" }}
      >
        🔍 Truy xuất lô: {batch.batchCode}
      </Typography>

      <Stepper orientation="vertical" nonLinear activeStep={steps.length}>
        {steps.map((step) => (
          <Step key={step.label} completed>
            <StepLabel
              icon={
                step.label === "Sản phẩm" ? <Medication /> : <CheckCircle />
              }
              sx={{
                "& .MuiStepLabel-label": { typography: "h6", color: "#0288d1" },
              }}
            >
              {step.label}
            </StepLabel>
            <Card
              variant="outlined"
              sx={{ borderColor: "#81d4fa", my: 1, boxShadow: 2 }}
            >
              <CardContent>{step.content}</CardContent>
            </Card>
          </Step>
        ))}
      </Stepper>

      <Box mt={4} textAlign="center">
        <a
          href="http://192.168.157.1:3001/trace/welcome"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            backgroundColor: "#0288d1",
            color: "white",
            padding: "14px 28px",
            borderRadius: "12px",
            fontWeight: 600,
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          🔗 Join Us
        </a>
      </Box>
    </Box>
  );
}

// "use client";

// import { useQuery } from "@tanstack/react-query";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Stack,
//   Skeleton,
// } from "@mui/material";

// interface Batch {
//   batchCode: string;
//   state: string;
//   initialQuantity: number;
//   createdAt?: string;
//   expiryDate?: string;
// }
// interface ActiveIngredient {
//   name: string;
//   strength?: string;
// }
// interface Product {
//   name: string;
//   productCode: string;
//   description?: string;
//   uom?: string;
//   uomQuantity?: number;
//   activeIngredient?: ActiveIngredient[];
// }
// interface Manufacturer {
//   name: string;
//   companyCode: string;
//   location?: string;
//   phone?: string;
// }
// interface Hospital {
//   name: string;
//   location?: string;
//   phone?: string;
// }
// interface TraceResponse {
//   batch: Batch;
//   product: Product;
//   manufacturer?: Manufacturer;
//   categories?: { name: string }[];
//   hospitals?: Hospital[];
// }

// export default function TracePage({
//   params,
//   searchParams,
// }: {
//   params: { batchCode: string };
//   searchParams: { token?: string };
// }) {
//   const token = searchParams.token || "";

//   const { data, isLoading } = useQuery({
//   queryKey: ["trace", params.batchCode],
//   queryFn: () =>
//     fetch("/api/tracebility", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ batchCode: params.batchCode, token }),
//     }).then(
//       (res) =>
//         res.json() as Promise<{ success: boolean; data: TraceResponse }>
//     ),
//   staleTime: 60000, // cache 1 phút
// });

//   if (isLoading) {
//     return (
//       <Box p={4}>
//         <Skeleton variant="text" height={50} width="60%" />
//         <Skeleton variant="rectangular" height={200} sx={{ my: 2 }} />
//         <Skeleton variant="rectangular" height={200} sx={{ my: 2 }} />
//       </Box>
//     );
//   }

//   if (!data?.success || !data.data) {
//     return (
//       <Box p={4}>
//         <Typography>Không có dữ liệu truy xuất</Typography>
//       </Box>
//     );
//   }

//   const { batch, product, manufacturer, hospitals } = data.data;

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h4" fontWeight="bold" mb={3}>
//         🔍 Truy xuất lô: {batch?.batchCode || "Chưa có"}
//       </Typography>

//       <Stack spacing={2}>
//         {/* Sản phẩm */}
//         <Card variant="outlined" sx={{ borderColor: "#81d4fa", boxShadow: 1 }}>
//           <CardContent>
//             <Typography variant="subtitle1" fontWeight="bold" color="primary">
//               Sản phẩm
//             </Typography>
//             <Typography>Tên: {product?.name}</Typography>
//             <Typography>Mã SP: {product?.productCode}</Typography>
//             {product?.description && (
//               <Typography>Mô tả: {product.description}</Typography>
//             )}
//             {product?.uom && product?.uomQuantity && (
//               <Typography>
//                 Đơn vị: {product.uom}, Số lượng/đơn vị: {product.uomQuantity}
//               </Typography>
//             )}
//             {product?.activeIngredient?.length && (
//               <Typography>
//                 Hoạt chất:{" "}
//                 {product.activeIngredient
//                   .map((ai) => `${ai.name} ${ai.strength || ""}`)
//                   .join(", ")}
//               </Typography>
//             )}
//           </CardContent>
//         </Card>

//         {/* Lô */}
//         <Card variant="outlined" sx={{ borderColor: "#4fc3f7", boxShadow: 1 }}>
//           <CardContent>
//             <Typography variant="subtitle1" fontWeight="bold" color="primary">
//               Lô
//             </Typography>
//             <Typography>Trạng thái: {batch?.state}</Typography>
//             <Typography>Số lượng ban đầu: {batch?.initialQuantity}</Typography>
//             {batch.createdAt && (
//               <Typography>Ngày SX: {batch.createdAt}</Typography>
//             )}
//             {batch.expiryDate && (
//               <Typography>HSD: {batch.expiryDate}</Typography>
//             )}
//           </CardContent>
//         </Card>

//         {/* Nhà sản xuất */}
//         {manufacturer && (
//           <Card
//             variant="outlined"
//             sx={{ borderColor: "#29b6f6", boxShadow: 1 }}
//           >
//             <CardContent>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary">
//                 Nhà sản xuất
//               </Typography>
//               <Typography>Tên: {manufacturer.name}</Typography>
//               <Typography>Mã công ty: {manufacturer.companyCode}</Typography>
//               {manufacturer.location && (
//                 <Typography>Địa chỉ: {manufacturer.location}</Typography>
//               )}
//               {manufacturer.phone && (
//                 <Typography>Điện thoại: {manufacturer.phone}</Typography>
//               )}
//             </CardContent>
//           </Card>
//         )}

//         {/* Hospitals */}
//         <Card variant="outlined" sx={{ borderColor: "#29b6f6", boxShadow: 1 }}>
//           <CardContent>
//             <Typography variant="subtitle1" fontWeight="bold" color="primary">
//               Bệnh viện
//             </Typography>
//             {hospitals && hospitals.length
//               ? hospitals.map((h) => (
//                   <Typography key={h.name}>
//                     {h.name} {h.location && `- ${h.location}`}{" "}
//                     {h.phone && `(${h.phone})`}
//                   </Typography>
//                 ))
//               : "Chưa có bệnh viện"}
//           </CardContent>
//         </Card>
//       </Stack>
//     </Box>
//   );
// }

// "use client";

// import React, { use } from "react";
// import { useQuery } from "@tanstack/react-query";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Stack,
//   Skeleton,
// } from "@mui/material";

// // ===== Types =====
// interface Batch {
//   batchCode: string;
//   state: string;
//   initialQuantity: number;
//   createdAt?: string;
//   expiryDate?: string;
// }
// interface ActiveIngredient {
//   name: string;
//   strength?: string;
// }
// interface Product {
//   name: string;
//   productCode: string;
//   description?: string;
//   uom?: string;
//   uomQuantity?: number;
//   activeIngredient?: ActiveIngredient[];
// }
// interface Manufacturer {
//   name: string;
//   companyCode: string;
//   location?: string;
//   phone?: string;
// }
// interface Hospital {
//   name: string;
//   location?: string;
//   phone?: string;
// }
// interface TraceResponse {
//   batch: Batch;
//   product: Product;
//   manufacturer?: Manufacturer;
//   categories?: { name: string }[];
//   hospitals?: Hospital[];
// }

// export default function TracePage({
//   params,
//   searchParams,
// }: {
//   params: { batchCode: string };
//   searchParams: { token?: string };
// }) {
//   // ✅ Unwrap params & searchParams (Next.js 14+)
//   const resolvedParams = use(params);
//   const resolvedSearch = use(searchParams);

//   const batchCode = resolvedParams.batchCode;
//   const token = resolvedSearch.token || "";

//   interface TracePageSearchParams {
//   token?: string;
// }

//   params: { batchCode: string };
//   searchParams: TracePageSearchParams;
// }) {
//   const { batchCode } = params;
//   const token = searchParams.token || ""; // ✅ Không lỗi
// }

//   // ✅ React Query fetch + cache
//   const { data, isLoading } = useQuery({
//     queryKey: ["trace", batchCode],
//     queryFn: () =>
//       fetch("/api/tracebility", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ batchCode, token }),
//       }).then(
//         (res) =>
//           res.json() as Promise<{ success: boolean; data: TraceResponse }>
//       ),
//     staleTime: 60000, // cache 1 phút
//   });

//   // Loading skeleton
//   if (isLoading) {
//     return (
//       <Box p={4}>
//         <Skeleton variant="text" height={50} width="60%" />
//         <Skeleton variant="rectangular" height={200} sx={{ my: 2 }} />
//         <Skeleton variant="rectangular" height={200} sx={{ my: 2 }} />
//       </Box>
//     );
//   }

//   if (!data?.success || !data.data) {
//     return (
//       <Box p={4}>
//         <Typography>Không có dữ liệu truy xuất</Typography>
//       </Box>
//     );
//   }

//   const { batch, product, manufacturer, hospitals } = data.data;

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h4" fontWeight="bold" mb={3}>
//         🔍 Truy xuất lô: {batch?.batchCode || "Chưa có"}
//       </Typography>

//       <Stack spacing={2}>
//         {/* Sản phẩm */}
//         <Card variant="outlined" sx={{ borderColor: "#81d4fa", boxShadow: 1 }}>
//           <CardContent>
//             <Typography variant="subtitle1" fontWeight="bold" color="primary">
//               Sản phẩm
//             </Typography>
//             <Typography>Tên: {product?.name}</Typography>
//             <Typography>Mã SP: {product?.productCode}</Typography>
//             {product?.description && (
//               <Typography>Mô tả: {product.description}</Typography>
//             )}
//             {product?.uom && product?.uomQuantity && (
//               <Typography>
//                 Đơn vị: {product.uom}, Số lượng/đơn vị: {product.uomQuantity}
//               </Typography>
//             )}
//             {product?.activeIngredient?.length && (
//               <Typography>
//                 Hoạt chất:{" "}
//                 {product.activeIngredient
//                   .map((ai) => `${ai.name} ${ai.strength || ""}`)
//                   .join(", ")}
//               </Typography>
//             )}
//           </CardContent>
//         </Card>

//         {/* Lô */}
//         <Card variant="outlined" sx={{ borderColor: "#4fc3f7", boxShadow: 1 }}>
//           <CardContent>
//             <Typography variant="subtitle1" fontWeight="bold" color="primary">
//               Lô
//             </Typography>
//             <Typography>Trạng thái: {batch?.state}</Typography>
//             <Typography>Số lượng ban đầu: {batch?.initialQuantity}</Typography>
//             {batch.createdAt && (
//               <Typography>Ngày SX: {batch.createdAt}</Typography>
//             )}
//             {batch.expiryDate && (
//               <Typography>HSD: {batch.expiryDate}</Typography>
//             )}
//           </CardContent>
//         </Card>

//         {/* Nhà sản xuất */}
//         {manufacturer && (
//           <Card
//             variant="outlined"
//             sx={{ borderColor: "#29b6f6", boxShadow: 1 }}
//           >
//             <CardContent>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary">
//                 Nhà sản xuất
//               </Typography>
//               <Typography>Tên: {manufacturer.name}</Typography>
//               <Typography>Mã công ty: {manufacturer.companyCode}</Typography>
//               {manufacturer.location && (
//                 <Typography>Địa chỉ: {manufacturer.location}</Typography>
//               )}
//               {manufacturer.phone && (
//                 <Typography>Điện thoại: {manufacturer.phone}</Typography>
//               )}
//             </CardContent>
//           </Card>
//         )}

//         {/* Hospitals */}
//         <Card variant="outlined" sx={{ borderColor: "#29b6f6", boxShadow: 1 }}>
//           <CardContent>
//             <Typography variant="subtitle1" fontWeight="bold" color="primary">
//               Bệnh viện
//             </Typography>
//             {hospitals && hospitals.length
//               ? hospitals.map((h) => (
//                   <Typography key={h.name}>
//                     {h.name} {h.location && `- ${h.location}`}{" "}
//                     {h.phone && `(${h.phone})`}
//                   </Typography>
//                 ))
//               : "Chưa có bệnh viện"}
//           </CardContent>
//         </Card>
//       </Stack>
//     </Box>
//   );
// }
