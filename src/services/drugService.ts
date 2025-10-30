// // ================================
// // File: src/services/servicebe.ts
// // ================================

// import axios from "axios";
// import Cookies from "js-cookie";
// import type { BackendProduct } from "@/types/drug";

// // Base URL
// const API_BASE = process.env.NEXT_PUBLIC_BE_API_BASE || "http://localhost:4000";
// const API_URL = `${API_BASE}/api/product`;

// // ================================
// // 🔹 Hàm tạo header xác thực
// // ================================
// const getAuthHeaders = () => {
//   const accessToken = Cookies.get("accessToken");
//   const userId = Cookies.get("userId");
//   const roleName = Cookies.get("roleName");
//   const roleId = Cookies.get("roleId");

//   return {
//     Authorization: accessToken ? `Bearer ${accessToken}` : "",
//     "X-User-Id": userId || "",
//     "X-Role-Name": roleName || "",
//     "X-Role-Id": roleId || "",
//     "ngrok-skip-browser-warning": "true", // cần thiết khi chạy qua ngrok
//   };
// };

// // ================================
// // 🔹 Tạo instance axios riêng
// // ================================
// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true, // Cho phép cookie JWT nếu BE dùng session-based auth
// });

// // Interceptor để log request dễ debug
// api.interceptors.request.use((config) => {
//   console.log("📡 [Axios] Request:", config.method?.toUpperCase(), config.url);
//   console.log("📦 Headers:", config.headers);
//   return config;
// });

// // ================================
// // 🔹 Các hàm gọi API
// // ================================
// export const backendService = {
//   // 🟢 Tạo thuốc mới
//   createProduct: async (payload: FormData | Record<string, unknown>) => {
//     const isFormData = payload instanceof FormData;
//     const res = await api.post("", payload, {
//       headers: {
//         ...getAuthHeaders(),
//         ...(isFormData ? {} : { "Content-Type": "application/json" }),
//       },
//     });
//     return res.data;
//   },

//   // 🟠 Cập nhật thuốc
//   updateProduct: async (payload: FormData | Record<string, unknown>) => {
//     const isFormData = payload instanceof FormData;
//     const res = await api.put("", payload, {
//       headers: {
//         ...getAuthHeaders(),
//         ...(isFormData ? {} : { "Content-Type": "application/json" }),
//       },
//     });
//     return res.data;
//   },

//   // 🟣 Cập nhật ảnh đại diện
//   updatePrimaryImage: async (productId: string, imageFile: File) => {
//     const fd = new FormData();
//     fd.append("productId", productId);
//     fd.append("image", imageFile);

//     const res = await api.put("/update-primary", fd, {
//       headers: getAuthHeaders(),
//     });
//     return res.data;
//   },

//   // 🔵 Gửi thuốc lên quản lý
//   sendProductToManager: async (productId: string) => {
//     const res = await api.put(
//       `/${productId}`,
//       { productId },
//       {
//         headers: getAuthHeaders(),
//       }
//     );
//     return res.data;
//   },

//   // 🟡 Duyệt thuốc (active/inactive)
//   approveProduct: async (
//     productId: string,
//     isActive: "active" | "inactive"
//   ) => {
//     const res = await api.put(
//       "/approval",
//       { productId, isActive },
//       {
//         headers: getAuthHeaders(),
//       }
//     );
//     return res.data;
//   },

//   // 🔍 Lấy 1 thuốc
//   getOne: async (productId: string, isActive?: string) => {
//     const res = await api.get("/get-one", {
//       headers: getAuthHeaders(),
//       params: { productId, ...(isActive ? { isActive } : {}) },
//     });
//     return res.data;
//   },

//   // 👤 Lấy thuốc theo user
//   getForUser: async (): Promise<BackendProduct[]> => {
//     const res = await api.get("/get-for-user", {
//       headers: getAuthHeaders(),
//     });
//     console.log("✅ [Axios] getForUser result:", res.status, res.data);
//     return res.data.result ?? res.data ?? [];
//   },
// };
// // ================================
// // File: src/services/servicebe.ts
// // ================================

// import Cookies from "js-cookie";
// import type { BackendProduct } from "@/types/drug";

// const API_BASE =
//   process.env.NEXT_PUBLIC_BE_API_BASE ||
//   "https://aurelio-untoned-yadiel.ngrok-free.dev";
// const API_URL = `${API_BASE}/api/product`;

// // 🔹 Tạo header xác thực
// const getAuthHeaders = () => {
//   const accessToken = Cookies.get("accessToken");

//   return {
//     Authorization: accessToken ? `Bearer ${accessToken}` : "",
//     "ngrok-skip-browser-warning": "true",
//   };
// };

// // 🔹 Helper fetch wrapper
// const fetchJSON = async (url: string, options: RequestInit = {}) => {
//   const res = await fetch(url, options);
//   if (!res.ok) throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
//   return res.json();
// };

// // ================================
// // Các hàm gọi API
// // ================================
// export const backendService = {
//   /** 🟢 Tạo product mới */
//   createProduct: async (payload: FormData | Record<string, unknown>) => {
//     const isFormData = payload instanceof FormData;

//     // Nếu payload là FormData, convert activeIngredient và storageConditions thành string
//     if (isFormData) {
//       const ai = payload.get("activeIngredient");
//       const sc = payload.get("storageConditions");
//       if (ai && typeof ai !== "string")
//         payload.set("activeIngredient", JSON.stringify(ai));
//       if (sc && typeof sc !== "string")
//         payload.set("storageConditions", JSON.stringify(sc));
//     }

//     return fetchJSON(`${API_URL}`, {
//       method: "POST",
//       headers: isFormData
//         ? getAuthHeaders()
//         : { ...getAuthHeaders(), "Content-Type": "application/json" },
//       body: isFormData ? payload : JSON.stringify(payload),
//     });
//   },

//   /** 🟠 Cập nhật product */
//   updateProduct: async (payload: FormData | Record<string, unknown>) => {
//     const isFormData = payload instanceof FormData;

//     if (isFormData) {
//       const ai = payload.get("activeIngredient");
//       const sc = payload.get("storageConditions");
//       if (ai && typeof ai !== "string")
//         payload.set("activeIngredient", JSON.stringify(ai));
//       if (sc && typeof sc !== "string")
//         payload.set("storageConditions", JSON.stringify(sc));
//     }

//     return fetchJSON(`${API_URL}`, {
//       method: "PUT",
//       headers: isFormData
//         ? getAuthHeaders()
//         : { ...getAuthHeaders(), "Content-Type": "application/json" },
//       body: isFormData ? payload : JSON.stringify(payload),
//     });
//   },

//   /** 🟣 Cập nhật ảnh đại diện của product */
//   updatePrimaryImage: async (productId: string, imageFile: File) => {
//     const fd = new FormData();
//     fd.append("productId", productId);
//     fd.append("image", imageFile);

//     return fetchJSON(`${API_URL}/update-primary`, {
//       method: "PUT",
//       headers: getAuthHeaders(),
//       body: fd,
//     });
//   },

//   /** 🔵 Gửi product cho quản lý */
//   sendProductToManager: async (productId: string) => {
//     return fetchJSON(`${API_URL}/${productId}`, {
//       method: "PUT",
//       headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
//       body: JSON.stringify({ productId }),
//     });
//   },

//   /** 🟡 Duyệt product (active/inactive) */
//   approveProduct: async (
//     productId: string,
//     isActive: "active" | "inactive"
//   ) => {
//     return fetchJSON(`${API_URL}/approval`, {
//       method: "PUT",
//       headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
//       body: JSON.stringify({ productId, isActive }),
//     });
//   },

//   /** 🔍 Lấy 1 product */
//   getOne: async (productId: string, isActive?: string) => {
//     const params = new URLSearchParams({
//       productId,
//       ...(isActive ? { isActive } : {}),
//     });
//     return fetchJSON(`${API_URL}/get-one?${params.toString()}`, {
//       method: "GET",
//       headers: getAuthHeaders(),
//     });
//   },

//   /** 📃 Lấy tất cả product của user */
//   getForUser: async (options: RequestInit = {}) => {
//     const res = await fetchJSON(`${API_URL}/get-for-user`, {
//       method: "GET",
//       headers: getAuthHeaders(),
//       ...options,
//     });
//     const data = res.data ?? res.result ?? [];
//     return Array.isArray(data) ? data : [];
//   },

//   /** 📃 Lấy tất cả product đã duyệt */
//   getApprovedProducts: async (isActive: "active" | "inactive") => {
//     const params = new URLSearchParams({ isActive });
//     const res = await fetchJSON(
//       `${API_URL}/get-approved?${params.toString()}`,
//       {
//         method: "GET",
//         headers: getAuthHeaders(),
//       }
//     );
//     const data = res.data ?? [];
//     return Array.isArray(data) ? data : [];
//   },

//   /** 📃 Lấy tất cả product chuẩn bị duyệt (cho quản lý) */
//   getProductsForApproval: async (
//     options: RequestInit = {}
//   ): Promise<BackendProduct[]> => {
//     const res = await fetchJSON(`${API_URL}/get-for-approval`, {
//       method: "GET",
//       headers: getAuthHeaders(),
//       ...options,
//     });
//     const data = res.result ?? [];
//     return Array.isArray(data) ? data : [];
//   },

//   /** ❌ Xóa product (chỉ draft) */
//   deleteProduct: async (productId: string) => {
//     return fetchJSON(`${API_URL}/${productId}`, {
//       method: "DELETE",
//       headers: getAuthHeaders(),
//     });
//   },
// };


// import Cookies from "js-cookie";
// import { supabase } from "@/lib/supabaseClient";
// import type { BackendProduct } from "@/types/drug";

// const API_BASE =
//   process.env.NEXT_PUBLIC_BE_API_BASE ||
//   "https://aurelio-untoned-yadiel.ngrok-free.dev";
// const API_URL = `${API_BASE}/api/product`;

// const getAuthHeaders = () => {
//   const accessToken = Cookies.get("accessToken");
//   return {
//     Authorization: accessToken ? `Bearer ${accessToken}` : "",
//     "ngrok-skip-browser-warning": "true",
//   };
// };

// const fetchJSON = async (url: string, options: RequestInit = {}) => {
//   const res = await fetch(url, options);
//   if (!res.ok) throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
//   return res.json();
// };

// export const backendService = {
//   /** 🔍 Lấy 1 sản phẩm — fallback sang Supabase nếu 401 */
//   async getOne(productCode: string): Promise<{ data: BackendProduct }> {
//     try {
//       const params = new URLSearchParams({ productCode });
//       const res = await fetchJSON(`${API_URL}/get-one?${params.toString()}`, {
//         method: "GET",
//         headers: getAuthHeaders(),
//       });
//       return res;
//     } catch (error: unknown) {
//       const message =
//         error instanceof Error ? error.message : String(error);

//       if (message.includes("401") || message.includes("Unauthorized")) {
//         console.warn("⚠️ Fallback sang Supabase (public truy xuất)");

//         const { data, error: sbError } = await supabase
//           .from("products")
//           .select("*")
//           .eq("productCode", productCode)
//           .single();

//         if (sbError || !data) {
//           console.error("❌ Supabase error:", sbError?.message);
//           throw new Error("Không tìm thấy thông tin sản phẩm trong Supabase");
//         }

//         console.log("✅ Supabase productData:", data);
//         return { data: data as BackendProduct };
//       }

//       throw error;
//     }
//   },
// };

// ================================
// File: src/services/servicebe.ts
// ================================

import Cookies from "js-cookie";
import type { BackendProduct } from "@/types/drug";

const API_BASE =
  process.env.NEXT_PUBLIC_BE_API_BASE ||
  "https://aurelio-untoned-yadiel.ngrok-free.dev";
const API_URL = `${API_BASE}/api/product`;

// 🔹 Tạo header xác thực
const getAuthHeaders = () => {
  const accessToken = Cookies.get("accessToken");
  const userId = Cookies.get("userId");
  const roleName = Cookies.get("roleName");
  const roleId = Cookies.get("roleId");

  return {
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
    "X-User-Id": userId || "",
    "X-Role-Name": roleName || "",
    "X-Role-Id": roleId || "",
    "ngrok-skip-browser-warning": "true",
  };
};

// 🔹 Helper fetch wrapper
const fetchJSON = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
  return res.json();
};

// ================================
// Các hàm gọi API
// ================================
export const backendService = {
  /** 🟢 Tạo product mới */
  createProduct: async (payload: FormData | Record<string, unknown>) => {
    const isFormData = payload instanceof FormData;

    if (isFormData) {
      const ai = payload.get("activeIngredient");
      const sc = payload.get("storageConditions");
      if (ai && typeof ai !== "string") payload.set("activeIngredient", JSON.stringify(ai));
      if (sc && typeof sc !== "string") payload.set("storageConditions", JSON.stringify(sc));
    }

    return fetchJSON(`${API_URL}`, {
      method: "POST",
      headers: isFormData
        ? getAuthHeaders()
        : { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: isFormData ? payload : JSON.stringify(payload),
    });
  },

  /** 🟠 Cập nhật product */
  updateProduct: async (payload: FormData | Record<string, unknown>) => {
    const isFormData = payload instanceof FormData;

    if (isFormData) {
      const ai = payload.get("activeIngredient");
      const sc = payload.get("storageConditions");
      if (ai && typeof ai !== "string") payload.set("activeIngredient", JSON.stringify(ai));
      if (sc && typeof sc !== "string") payload.set("storageConditions", JSON.stringify(sc));
    }

    return fetchJSON(`${API_URL}`, {
      method: "PUT",
      headers: isFormData
        ? getAuthHeaders()
        : { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: isFormData ? payload : JSON.stringify(payload),
    });
  },

  /** 🟣 Cập nhật ảnh đại diện của product */
  updatePrimaryImage: async (productId: string, imageFile: File) => {
    const fd = new FormData();
    fd.append("productId", productId);
    fd.append("image", imageFile);

    return fetchJSON(`${API_URL}/update-primary`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: fd,
    });
  },

  /** 🔵 Gửi product cho quản lý */
  sendProductToManager: async (productId: string) => {
    return fetchJSON(`${API_URL}/${productId}`, {
      method: "PUT",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
  },

  /** 🟡 Duyệt product (active/inactive) */
  approveProduct: async (productId: string, isActive: "active" | "inactive") => {
    return fetchJSON(`${API_URL}/approval`, {
      method: "PUT",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ productId, isActive }),
    });
  },

  /** 🔍 Lấy 1 product */
  getOne: async (productId: string, isActive?: string) => {
    const params = new URLSearchParams({ productId, ...(isActive ? { isActive } : {}) });
    return fetchJSON(`${API_URL}/get-one?${params.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
  },

  /** 📃 Lấy tất cả product của user */
  // getForUser: async () => {
  //   const res = await fetchJSON(`${API_URL}/get-for-user`, {
  //     method: "GET",
  //     headers: getAuthHeaders(),
  //   });
  //   const data = res.data ?? res.result ?? [];
  //   return Array.isArray(data) ? data : [];
  // },
  /** 📃 Lấy tất cả product của user */
getForUser: async (options?: { signal?: AbortSignal }) => {
  const res = await fetchJSON(`${API_URL}/get-for-user`, {
    method: "GET",
    headers: getAuthHeaders(),
    signal: options?.signal, // ✅ thêm signal ở đây
  });
  const data = res.data ?? res.result ?? [];
  return Array.isArray(data) ? data : [];
},


  /** 📃 Lấy tất cả product đã duyệt */
  getApprovedProducts: async (isActive: "active" | "inactive") => {
    const params = new URLSearchParams({ isActive });
    const res = await fetchJSON(`${API_URL}/get-approved?${params.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    const data = res.data ?? [];
    return Array.isArray(data) ? data : [];
  },

  /** 📃 Lấy tất cả product chuẩn bị duyệt (cho quản lý) */
  getProductsForApproval: async (): Promise<BackendProduct[]> => {
    const res = await fetchJSON(`${API_URL}/get-for-approval`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    const data = res.result ?? [];
    return Array.isArray(data) ? data : [];
  },

  /** ❌ Xóa product (chỉ draft) */
  deleteProduct: async (productId: string) => {
    return fetchJSON(`${API_URL}/${productId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  },
};
