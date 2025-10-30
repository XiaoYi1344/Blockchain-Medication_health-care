// // services/categoryService.ts
// import axios from "axios";
// import {
//   Category,
//   CategoryAuditLog,
//   CategoryCreatePayload,
//   CategoryUpdatePayload,
// } from "@/types/category";

// const API_URL = process.env.NEXT_PUBLIC_BE_API_BASE + "/api/category-product";

// export const categoryService = {
//   getAll: async (isActive?: boolean): Promise<Category[]> => {
//     const params = isActive !== undefined ? { isActive } : {};
//     const res = await axios.get<{ result: Category[] }>(`${API_URL}/get-all`, {
//       params,
//     });
//     return res.data.result;
//   },

//   getOne: async (categoryId: string, isActive?: boolean): Promise<Category> => {
//     const params = isActive !== undefined ? { isActive } : {};
//     const res = await axios.get<{ result: Category }>(
//       `${API_URL}/get-one/${categoryId}`,
//       { params }
//     );
//     return res.data.result;
//   },

//   create: async (payload: CategoryCreatePayload): Promise<Category> => {
//     const res = await axios.post<{ result: Category }>(API_URL, payload);
//     return res.data.result;
//   },

//   update: async (payload: CategoryUpdatePayload): Promise<Category> => {
//     const res = await axios.put<{ result: Category }>(API_URL, payload);
//     return res.data.result;
//   },

//   delete: async (categoryId: string): Promise<void> => {
//     await axios.delete(`${API_URL}/${categoryId}`);
//   },

//   getAudit: async (categoryId: string): Promise<CategoryAuditLog[]> => {
//     const res = await axios.get<{ result: CategoryAuditLog[] }>(
//       `${API_URL}/audit/${categoryId}`
//     );
//     return res.data.result;
//   },
// };

// services/categoryService.ts
import axios from "axios";
import Cookies from "js-cookie";
import {
  Category,
  CategoryCreatePayload,
  CategoryUpdatePayload,
  CategoryAuditLog,
} from "@/types/category";

// Backend response for audit logs
interface CategoryAuditLogResponse {
  categoryId: string;
  id: string;
  action: string;
  user: string;
  createdAt: string;
}

// Backend response for categories
interface CategoryResponse {
  _id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface GetAllResponse {
  data: CategoryResponse[];
}

interface GetOneResponse {
  data: CategoryResponse;
}

interface GetAuditResponse {
  result: CategoryAuditLogResponse[];
}

const API_URL = process.env.NEXT_PUBLIC_BE_API_BASE + "/api/category-product";

// --- Helper to get auth headers from cookies ---
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
  };
};

// --- Category service ---
export const categoryService = {
  // Get all categories
  getAll: async (isActive: boolean): Promise<Category[]> => {
    const body = { isActive }; // luôn gửi true/false
    const res = await axios.post<GetAllResponse>(`${API_URL}/get-all-company`, body, {
      headers: getAuthHeaders(),
    });

    return res.data.data.map((item) => ({
      _id: item._id,
      name: item.name,
      description: item.description || "",
      isActive: Boolean(item.isActive),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  },

  // Get one category
  getOne: async (categoryId: string, isActive?: boolean): Promise<Category> => {
    const body = {
      categoryId,
      ...(isActive !== undefined ? { isActive } : {}),
    };
    const res = await axios.post<GetOneResponse>(`${API_URL}/get-one`, body, {
      headers: getAuthHeaders(),
    });
    const item = res.data.data;

    return {
      _id: item._id,
      name: item.name,
      description: item.description || "",
    };
  },

  // Create category
  create: async (payload: CategoryCreatePayload): Promise<void> => {
  const res = await axios.post(API_URL, payload, {
    headers: getAuthHeaders(),
  });

  if (!res.data.success) {
    throw new Error(res.data.message || "Created failed");
  }

  return; // chỉ xác nhận thành công
},


  // Update category
  // update: async (payload: CategoryUpdatePayload): Promise<Category> => {
  //   const res = await axios.put(API_URL, payload, {
  //     headers: getAuthHeaders(),
  //   });

  //   if (!res.data.success) {
  //     throw new Error(res.data.message || "Update failed");
  //   }

  //   const item = res.data.data;
  //   return {
  //     _id: item._id,
  //     name: item.name,
  //     description: item.description || "",
  //   };
  // },

  update: async (payload: CategoryUpdatePayload): Promise<void> => {
    const res = await axios.put(API_URL, payload, {
      headers: getAuthHeaders(),
    });

    if (!res.data.success) {
      throw new Error(res.data.message || "Update failed");
    }

    // ✅ không cần map ra Category vì API không trả về
    return;
  },

  // Delete category
  delete: async (categoryId: string): Promise<void> => {
    await axios.delete(`${API_URL}/${categoryId}`, {
      headers: getAuthHeaders(),
    });
  },

  // Approve / Activate / Deactivate category
  approve: async (categoryId: string, isActive: boolean): Promise<void> => {
    await axios.put(
      `${API_URL}/approval`,
      { categoryId, isActive },
      { headers: getAuthHeaders() }
    );
  },

  // Get audit logs
  getAudit: async (categoryId: string): Promise<CategoryAuditLog[]> => {
    const res = await axios.get<GetAuditResponse>(
      `${API_URL}/audit/${categoryId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    return res.data.result.map((item) => ({
      categoryId: item.categoryId,
      id: item.id,
      action: item.action,
      user: item.user,
      createdAt: item.createdAt,
    }));
  },
};
