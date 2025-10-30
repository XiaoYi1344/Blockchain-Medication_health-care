// import axios from "axios";
// import { getCookie } from "cookies-next";
// import { authService } from "@/services/authService";

// import { Role } from "@/types/staff";
// import { UpdateUserRequest, ProfileUser } from "@/types/user";
// import {
//   User,
//   CreateUserRequest,
//   PermissionType,
//   UpdateRoleRequest,
// } from "@/types/staff";

// const API_BASE = process.env.NEXT_PUBLIC_BE_API_BASE;
// const api = axios.create({
//   baseURL: `${API_BASE}/api`,
//   headers: {
//     "ngrok-skip-browser-warning": "true",
//     "Cache-Control": "no-cache",
//   },
// });

// // Gắn accessToken vào mọi request
// api.interceptors.request.use((config) => {
//   const token =
//     getCookie("accessToken") || authService.getUserInfo()?.accessToken;
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // ===== USER =====
// export const staffService = {
//   async getAllUsers() {
//     const res = await api.get<User[]>("/user/get-all"); // User từ staff.ts
//     return res.data;
//   },

//   async createUser(data: CreateUserRequest): Promise<User> {
//     const res = await api.post<User>("/user", data);
//     return res.data;
//   },

//   async lockUser(userId: string) {
//     await api.put(`/user/${userId}`, { userId, isActive: false });
//   },

//   async deleteUser(userId: string) {
//     await api.delete(`/user/${userId}`);
//   },

//   async assignPermissionToUser(payload: {
//     roleId: string;
//     permissionIds: string[];
//   }) {
//     await api.put("/authorization/assign-user-permission", payload);
//   },

//   async updateUser(data: UpdateUserRequest): Promise<void> {
//     let body: FormData | Record<string, string>;
//     let isFormData = false;

//     if (data.avatar instanceof File) {
//       isFormData = true;
//       const formData = new FormData();
//       Object.entries(data).forEach(([key, value]) => {
//         if (value === undefined || value === null || value === "") return;
//         if (value instanceof File) formData.append("avatar", value);
//         else formData.append(key, String(value));
//       });
//       body = formData;
//     } else {
//       const jsonBody: Record<string, string> = {};
//       Object.entries(data).forEach(([key, value]) => {
//         if (value !== undefined && value !== null && value !== "") {
//           jsonBody[key] = String(value);
//         }
//       });
//       body = jsonBody;
//     }

//     await api.put("/user", body, {
//       headers: isFormData ? {} : { "Content-Type": "application/json" },
//     });
//   },

//   // ===== ROLE =====
//   async getAllRoles(companyId: string) {
//     const res = await api.get<Role[]>(`/role/get-all/${companyId}`);
//     return res.data;
//   },

//   //   async updateRole(payload: {
//   //     roleId: string;
//   //     permissionIds: string[];
//   //     name: string;
//   //     displayName: string;
//   //   }) {
//   //     await api.put("/role/update-role", payload);
//   //   },

//   async updateRole(payload: UpdateRoleRequest) {
//     await api.put("/role/update-role", payload);
//   },

//   async deleteRole(roleId: string) {
//     await api.delete(`/role/${roleId}`);
//   },

//   // ===== PERMISSION =====
//   async getPermissionsByRole(roleId: string) {
//     const res = await api.get<PermissionType[]>(
//       `/permission/get-by-role/${roleId}`
//     );
//     return res.data;
//   },

//   async getPermissionsByUser(userId: string) {
//     const res = await api.get<PermissionType[]>(
//       `/permission/get-by-user/${userId}`
//     );
//     return res.data;
//   },
// };

// // staffService.ts
// import axios from "axios";
// import { getCookie } from "cookies-next";
// import { authService } from "@/services/authService";
// import { Role, UpdateRoleRequest, User, CreateUserRequest, PermissionType } from "@/types/staff";

// const API_BASE = process.env.NEXT_PUBLIC_BE_API_BASE;
// const api = axios.create({
//   baseURL: `${API_BASE}/api`,
//   headers: {
//     "ngrok-skip-browser-warning": "true",
//     "Cache-Control": "no-cache",
//   },
// });

// // Gắn accessToken vào mọi request
// api.interceptors.request.use((config) => {
//   const token = getCookie("accessToken") || authService.getUserInfo()?.accessToken;
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export const staffService = {
//   // ===== USER =====
//   async getAllUsers() {
//     const res = await api.get<User[]>("/user/get-all");
//     return res.data;
//   },

//   async createUser(data: CreateUserRequest): Promise<User> {
//     const res = await api.post<User>("/user", data);
//     return res.data;
//   },

//   async lockUser(userId: string) {
//     await api.put(`/user/${userId}`, { userId, isActive: false });
//   },

//   async deleteUser(userId: string) {
//     await api.delete(`/user/${userId}`);
//   },

//   async assignPermissionToUser(payload: { roleId: string; permissionIds: string[] }) {
//     await api.put("/authorization/assign-user-permission", payload);
//   },

//   // ===== ROLE =====
//   async getAllRoles(companyId: string): Promise<Role[]> {
//     const res = await api.get<Role[]>(`/role/get-all/${companyId}`);
//     return res.data;
//   },

//   async createRole(payload: { name: string; displayName: string; permissionIds: string[] }): Promise<Role> {
//     const res = await api.post<Role>("/role", payload);
//     return res.data;
//   },

//   async updateRole(payload: UpdateRoleRequest) {
//     await api.put("/role/update-role", payload);
//   },

//   async deleteRole(roleId: string) {
//     await api.delete(`/role/${roleId}`);
//   },

//   // ===== PERMISSION =====
//   async getPermissionsByRole(roleId: string): Promise<PermissionType[]> {
//     const res = await api.get<PermissionType[]>(`/permission/get-by-role/${roleId}`);
//     return res.data;
//   },

//   async getPermissionsByUser(userId: string): Promise<PermissionType[]> {
//     const res = await api.get<PermissionType[]>(`/permission/get-by-user/${userId}`);
//     return res.data;
//   },
// };


// // services/staffService.ts
// import axios from "axios";
// import { getCookie } from "cookies-next";
// import {
//   User,
//   Role,
//   CreateUserRequest,
//   UpdateRoleRequest,
//   PermissionType,
//   CreateRoleRequest,
// } from "@/types/staff";
// import { AuditLog } from "@/types/auditLog";

// const API_BASE = process.env.NEXT_PUBLIC_BE_API_BASE;

// const api = axios.create({
//   baseURL: `${API_BASE}/api`,
//   headers: {
//     "ngrok-skip-browser-warning": "true",
//     "Cache-Control": "no-cache",
//   },
// });

// // Gắn token từ cookie
// api.interceptors.request.use((config) => {
//   const token = getCookie("accessToken");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export const staffService = {
//   // ===== USERS =====
//   async getAllUsers(): Promise<User[]> {
//   const res = await api.get("/user/get-all");
//   const allUsers: User[] = res.data.data;

//   // Lấy thông tin user đang đăng nhập từ cookie
//   const userCookie = getCookie("user");
//   if (!userCookie) return [];

//   let currentUser: User | null = null;
//   try {
//     currentUser = JSON.parse(userCookie as string);
//   } catch (err) {
//     console.error("❌ Không parse được cookie user", err);
//     return [];
//   }

//   // 👇 Chỉ giữ lại user hiện tại và user do user này tạo
//   return allUsers.filter(
//     (u) => u.id === currentUser?.id || u.createdBy === currentUser?.id
//   );
// },

//   async createUser(data: CreateUserRequest): Promise<User> {
//   const res = await api.post("/user", data);
//   const newUser: User = res.data.data;

//   // Lấy actor từ cookie
//   const userCookie = getCookie("user");
//   if (userCookie) {
//     try {
//       const actor = JSON.parse(userCookie as string);

//       const audit: AuditLog = {
//         id: 0, // backend tự sinh
//         actorUserId: actor.id,
//         action: "CREATE",
//         entityType: "User",
//         entityId: Number(newUser.id),
//         newValue: JSON.stringify(newUser),
//         ipAddress: "",    // có thể lấy từ request server
//         userAgent: typeof window !== "undefined" ? navigator.userAgent : "",
//       };

//       // gửi log sang backend
//       await api.post("/audit-log", audit);
//     } catch (err) {
//       console.error("❌ Lỗi khi ghi audit log:", err);
//     }
//   }

//   return newUser;
// },

//   async lockUser(userId: string) {
//   await api.put(`/user/${userId}`, { userId, isActive: false });

//   const userCookie = getCookie("user");
//   if (userCookie) {
//     const actor = JSON.parse(userCookie as string);
//     const audit: AuditLog = {
//       id: 0,
//       actorUserId: actor.id,
//       action: "UPDATE",
//       entityType: "User",
//       entityId: Number(userId),
//       oldValue: JSON.stringify({ isActive: true }),
//       newValue: JSON.stringify({ isActive: false }),
//       userAgent: typeof window !== "undefined" ? navigator.userAgent : "",
//     };
//     await api.post("/audit-log", audit);
//   }
// }
// ,

//   async deleteUser(userId: string) {
//     await api.delete(`/user/${userId}`);
//   },

//   async assignUserPermission(payload: { roleId: string; permissionIds: string[] }) {
//     // ⚠️ tùy backend, có thể là PUT hoặc POST
//     const res = await api.put("/authorization/assign-user-permission", payload);
//     return res.data;
//   },

//   // ===== ROLES =====
//   // async getAllRoles(companyId: string): Promise<Role[]> {
//   //   const res = await api.get(`/role/get-all/${companyId}`);
//   //   return res.data.data;
//   // },

//   async getAllRoles(): Promise<Role[]> {
//   const res = await api.get(`/role/get-all`);
//   return res.data.data;
// },

//   // async createRole(payload: {
//   //   name: string;
//   //   displayName: string;
//   //   permissionIds: string[];
//   // }): Promise<Role> {
//   //   const res = await api.post("/role", payload);
//   //   return res.data.data;
//   // },

//   async createRole(payload: CreateRoleRequest): Promise<Role> {
//   const res = await api.post("/role/create-role", payload);
//   return res.data.data;
// },

//   async updateRole(payload: UpdateRoleRequest) {
//     await api.put("/role/update-role", payload);
//   },

//   async deleteRole(roleId: string) {
//     await api.delete(`/role/${roleId}`);
//   },

//   // ===== PERMISSIONS =====
//   async getPermissionsByRole(roleId: string): Promise<PermissionType[]> {
//     const res = await api.get(`/permission/get-by-role/${roleId}`);
//     return res.data.data;
//   },

//   async getPermissionsByUser(userId: string): Promise<PermissionType[]> {
//     const res = await api.get(`/permission/get-by-user/${userId}`);
//     return res.data.data;
//   },

// //   async getPermissionsByType(): Promise<PermissionType[]> {
// //   let roleName: string | undefined;
// //   const userCookie = getCookie("user");

// //   console.log("📌 Cookie lấy được:", userCookie);

// //   if (userCookie) {
// //   try {
// //     const user = JSON.parse(userCookie as string);
// //     console.log("📌 user parse được:", user); // 👉 Xem key thật sự là gì
// //     roleName = user.roleName || user.role || user.roles?.[0]?.name;
// //   } catch (err) {
// //     console.error("❌ Cannot parse user cookie", err);
// //   }
// // }


// //   if (!roleName) {
// //     console.error("❌ Role name not found in cookie");
// //     return [];
// //   }

// //   const payload = { type: roleName };
// //   console.log("📡 Gọi API /permission/get với payload:", payload);

// //   const res = await api.post("/permission/get", payload);
// //   return res.data.data;
// // }

// async getPermissionsByType(): Promise<PermissionType[]> {
//   const roleName = getCookie("roleName") as string | undefined;

//   if (!roleName) {
//     console.error("❌ Role name not found in cookie");
//     return [];
//   }

//   const payload = { type: roleName };
//   console.log("📡 Gọi API /permission/get với payload:", payload);

//   const res = await api.post("/permission/get", payload);
//   return res.data.data;
// }
// };



// services/staffService.ts
import axios from "axios";
import { getCookie } from "cookies-next";
import {
  User,
  Role,
  CreateUserRequest,
  UpdateRoleRequest,
  PermissionType,
  CreateRoleRequest,
} from "@/types/staff";

const API_BASE = process.env.NEXT_PUBLIC_BE_API_BASE;

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Cache-Control": "no-cache",
  },
});

// Gắn token từ cookie
api.interceptors.request.use((config) => {
  const token = getCookie("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const staffService = {
  // ===== USERS =====
  async getAllUsers(): Promise<User[]> {
    const res = await api.get("/user/get-all");
    return res.data.data;
  },

  async createUser(data: CreateUserRequest): Promise<User> {
    const res = await api.post("/user", data);
    return res.data.data;
  },

  async lockUser(userId: string, isActive: boolean) {
    // Đúng API: /user/update-state
    await api.put("/user/update-state", { userId, isActive });
  },

  async deleteUser(userId: string) {
    await api.delete(`/user/${userId}`);
  },

  async assignUserPermission(payload: { userId: string; permissionIds: string[] }) {
    const res = await api.post("/authorization/assign-user-permission", payload);
    return res.data;
  },

  // ===== ROLES =====
  async getAllRolesByCompany(): Promise<Role[]> {
    const res = await api.get(`/role/get-all-company`);
    return res.data.data;
  },

  async createRole(payload: CreateRoleRequest): Promise<Role> {
    const res = await api.post("/role/create-role", payload);
    return res.data.data;
  },

//   // Sửa role
// async updateRole(payload: UpdateRoleRequest) {
//   // Đảm bảo gửi tất cả trường bắt buộc
//   if (!payload.roleId) throw new Error("roleId is required");
//   if (!payload.permissionIds) payload.permissionIds = [];
//   return await api.put("/role/update-role", payload);
// }
// ,

// ✅ services/staffService.ts
async updateRole(payload: UpdateRoleRequest & { userId: string }) {
  if (!payload.roleId) throw new Error("roleId is required");

  // lấy accessToken từ cookie (đã tự động thêm vào header)
  const token = getCookie("accessToken");
  if (!token) throw new Error("Missing accessToken");

  // bảo đảm gửi đầy đủ danh sách permission
  if (!Array.isArray(payload.permissionIds)) payload.permissionIds = [];

  const res = await api.put("/role/update-role", payload);
  return res.data;
},



// Xóa role
async deleteRole(roleId: string) {
  if (!roleId) throw new Error("roleId is required");
  return await api.delete(`/role/${roleId}`);
},


  // ===== PERMISSIONS =====
  async getPermissionsByRole(roleId: string): Promise<PermissionType[]> {
    const res = await api.get(`/permission/get-by-role/${roleId}`);
    return res.data.data;
  },

  async getPermissionsByUser(userId: string): Promise<PermissionType[]> {
    const res = await api.get(`/permission/get-by-user/${userId}`);
    return res.data.data;
    console.log("🧩 Permissions thực tế của user:", res);
  },

  async getPermissionsByType(): Promise<PermissionType[]> {
    const roleName = getCookie("roleName") as string | undefined;
    if (!roleName) return [];
    const res = await api.post("/permission/get", { type: roleName });
    return res.data.data;
  },

  // ====COMPANY===
  async getAllCompanies() {
    const res = await api.get("/company/get-all", { params: { select: true } });
    return res.data.result; // theo mô tả response
  },

  async getRolesByCompany(companyId: string) {
    if (!companyId) throw new Error("companyId is required");
    const res = await api.get("/role/get-all-company", { params: { companyId } });
    return res.data.data; // trả về array role
  },
};

