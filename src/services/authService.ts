// // import axios, { AxiosInstance, AxiosRequestConfig, isAxiosError } from "axios";
// // import Cookies from "js-cookie";
// // import {
// //   LoginRequest,
// //   LoginResponse,
// //   RefreshAccessResponse,
// //   VerifyOtpRequest,
// //   ApiResponse,
// //   RoleUser,
// // } from "@/types/auth";
// // import { log } from "node:console";

// // export interface AuthData {
// //   accessToken: string;
// //   refreshToken?: string;
// //   roles?: RoleUser[];
// //   userId?: string;
// //   expiresIn?: number;
// //   email?: string;
// //   userName?: string;
// //   phone?: string;
// // }

// // interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
// //   _retry?: boolean;
// // }

// // const API_URL = process.env.NEXT_PUBLIC_BE_API_BASE + "/api/authentication";

// // const api: AxiosInstance = axios.create({
// //   baseURL: process.env.NEXT_PUBLIC_BE_API_BASE,
// // });

// // const tokenService = {
// //   getAccessToken: () => Cookies.get("accessToken") || null,
// //   setAccessToken: (token: string) =>
// //     Cookies.set("accessToken", token, { expires: 1 }),
// //   clearAccessToken: () => Cookies.remove("accessToken"),
// // };

// // // --- refresh timeout ---
// // let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

// // function scheduleRefresh(expiresIn: number) {
// //   if (refreshTimeout) clearTimeout(refreshTimeout);

// //   // refresh sớm hơn 30s để tránh race condition
// //   const refreshDelay = (expiresIn - 30) * 1000;

// //   if (refreshDelay > 0) {
// //     refreshTimeout = setTimeout(() => {
// //       authService.refreshAccess().catch(() => authService.logout());
// //     }, refreshDelay);
// //   }
// // }

// // function saveUserCookies(data: LoginResponse | RefreshAccessResponse) {
// //   const { accessToken, refreshToken, userId, roles, expiresIn } = data;

// //   let email: string | undefined;
// //   let userName: string | undefined;
// //   let phone: string | undefined;

// //   if ("email" in data) email = data.email;
// //   if ("userName" in data) userName = data.userName;
// //   if ("phone" in data) phone = data.phone;

// //   if (accessToken) tokenService.setAccessToken(accessToken);
// //   if (refreshToken) Cookies.set("refreshToken", refreshToken, { expires: 7 });
// //   if (roles && roles.length > 0) {
// //     Cookies.set("roles", JSON.stringify(roles), { expires: 7 });
// //     Cookies.set("roleId", roles[0].roleId, { expires: 7 });
// //     Cookies.set("roleName", roles[0].roleName, { expires: 7 });
// //   }
// //   if (userId) Cookies.set("userId", String(userId), { expires: 7 });
// //   if (email) Cookies.set("email", email, { expires: 7 });
// //   if (userName) Cookies.set("userName", userName, { expires: 7 });
// //   if (phone) Cookies.set("phone", phone, { expires: 7 });

// //   if (expiresIn) {
// //     const expiresAt = Date.now() + expiresIn * 1000;
// //     Cookies.set("expiresAt", new Date(expiresAt).toISOString(), { expires: 7 });
// //     scheduleRefresh(expiresIn);
// //   }
// // }

// // // --- Axios interceptors ---
// // api.interceptors.request.use((config) => {
// //   const token = tokenService.getAccessToken();
// //   if (token) config.headers["Authorization"] = `Bearer ${token}`;
// //   return config;
// // });

// // api.interceptors.response.use(
// //   (response) => response,
// //   async (error) => {
// //     const originalRequest = error.config as AxiosRequestConfigWithRetry;
// //     if (error.response?.status === 401 && !originalRequest._retry) {
// //       originalRequest._retry = true;
// //       try {
// //         const newToken = await authService.refreshAccess();
// //         originalRequest.headers!["Authorization"] = `Bearer ${newToken}`;
// //         return api(originalRequest);
// //       } catch (_err) {
// //         authService.logout();
// //         return Promise.reject(_err);
// //       }
// //     }
// //     return Promise.reject(error);
// //   }
// // );

// // // --- Auth Service ---
// // export const authService = {
// //   api,

// //   async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
// //   const res = await api.post<ApiResponse<LoginResponse>>(`${API_URL}/login`, data);

// //   // Lưu cookies nếu có data
// //   if (res.data.data) saveUserCookies(res.data.data);

// //   console.log(res.data);

// //   // Trả luôn toàn bộ response, bao gồm success, message, data
// //   return res.data;
// // }
// // ,

// // //   async refreshAccess(): Promise<string> {
// // //   const res = await api.get<ApiResponse<{ accessToken: string }>>(
// // //     `${API_URL}/refresh-access`,
// // //     { withCredentials: true }
// // //   );

// // //   const payload = res.data.data;

// // //   if (payload.accessToken) {
// // //     tokenService.setAccessToken(payload.accessToken);
// // //   }

// // //   return payload.accessToken;
// // // },

// // async refreshAccess(): Promise<string> {
// //   const res = await api.get<ApiResponse<{ accessToken: string }>>(
// //     `${API_URL}/refresh-access`,
// //     { withCredentials: true }
// //   );

// //   const payload = res.data.data;

// //   if (payload.accessToken) {
// //     console.log("NEW ACCESS TOKEN:", payload.accessToken);
// //     console.log("OLD ACCESS TOKEN (cookie):", Cookies.get("accessToken"));
// //     tokenService.setAccessToken(payload.accessToken);
// //     console.log("UPDATED ACCESS TOKEN (cookie):", Cookies.get("accessToken"));
// //   }

// //   return payload.accessToken;
// // }
// // ,

// //   async verifyOtp(data: VerifyOtpRequest): Promise<void> {
// //     await api.post(`${API_URL}/verify-otp`, data);
// //   },

// //   logout() {
// //     tokenService.clearAccessToken();
// //     Cookies.remove("refreshToken");
// //     Cookies.remove("roles");
// //     Cookies.remove("roleId");
// //     Cookies.remove("roleName");
// //     Cookies.remove("userId");
// //     Cookies.remove("email");
// //     Cookies.remove("userName");
// //     Cookies.remove("phone");
// //     Cookies.remove("expiresAt");
// //     if (refreshTimeout) clearTimeout(refreshTimeout);
// //   },

// //   getUserInfo(): AuthData {
// //     const expiresAt = Cookies.get("expiresAt");
// //     const rolesString = Cookies.get("roles");
// //     const roles: RoleUser[] | undefined = rolesString
// //       ? JSON.parse(rolesString)
// //       : undefined;

// //     return {
// //       accessToken: tokenService.getAccessToken() || "",
// //       refreshToken: Cookies.get("refreshToken"),
// //       roles,
// //       userId: Cookies.get("userId"),
// //       expiresIn: expiresAt
// //         ? Math.floor(
// //             (new Date(expiresAt).getTime() - Date.now()) / 1000
// //           )
// //         : undefined,
// //       email: Cookies.get("email"),
// //       userName: Cookies.get("userName"),
// //       phone: Cookies.get("phone"),
// //     };
// //   },
// // };

// // // import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
// // // import Cookies from "js-cookie";
// // // import {
// // //   LoginRequest,
// // //   LoginResponse,
// // //   RefreshAccessResponse,
// // //   VerifyOtpRequest,
// // //   ApiResponse,
// // //   RoleUser,
// // // } from "@/types/auth";

// // // export interface AuthData {
// // //   accessToken: string;
// // //   refreshToken?: string;
// // //   roles?: RoleUser[];
// // //   userId?: string;
// // //   expiresIn?: number;
// // //   email?: string;
// // //   userName?: string;
// // //   phone?: string;
// // // }

// // // interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
// // //   _retry?: boolean;
// // // }

// // // const API_URL = process.env.NEXT_PUBLIC_BE_API_BASE + "/api/authentication";

// // // const api: AxiosInstance = axios.create({
// // //   baseURL: process.env.NEXT_PUBLIC_BE_API_BASE,
// // //   withCredentials: true, // ⚠️ Bắt buộc để gửi cookie refreshToken sang BE
// // // });

// // // // ===== TOKEN SERVICE =====
// // // const tokenService = {
// // //   getAccessToken: () => Cookies.get("accessToken") || null,
// // //   setAccessToken: (token: string) =>
// // //     Cookies.set("accessToken", token, { expires: 1 }),
// // //   clearAccessToken: () => Cookies.remove("accessToken"),
// // // };

// // // // ===== AUTO REFRESH SCHEDULER =====
// // // let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

// // // function scheduleRefresh(expiresIn: number) {
// // //   if (refreshTimeout) clearTimeout(refreshTimeout);
// // //   const refreshDelay = Math.max((expiresIn - 30) * 1000, 0); // refresh sớm hơn 30s
// // //   refreshTimeout = setTimeout(() => {
// // //     authService.refreshAccess().catch(() => authService.logout());
// // //   }, refreshDelay);
// // // }

// // // function hasUserInfo(
// // //   data: LoginResponse | RefreshAccessResponse
// // // ): data is LoginResponse & { email: string; userName?: string; phone?: string } {
// // //   return "email" in data || "userName" in data || "phone" in data;
// // // }

// // // // ===== SAVE USER COOKIES =====
// // // function saveUserCookies(data: LoginResponse | RefreshAccessResponse) {
// // //   const { accessToken, refreshToken, userId, roles, expiresIn } = data;

// // //   if (accessToken) tokenService.setAccessToken(accessToken);
// // //   if (refreshToken) Cookies.set("refreshToken", refreshToken, { expires: 7 });
// // //   if (roles && roles.length > 0) {
// // //     Cookies.set("roles", JSON.stringify(roles), { expires: 7 });
// // //     Cookies.set("roleId", roles[0].roleId, { expires: 7 });
// // //     Cookies.set("roleName", roles[0].roleName, { expires: 7 });
// // //   }
// // //   if (userId) Cookies.set("userId", String(userId), { expires: 7 });

// // //   // ✅ dùng type guard thay cho as any
// // //   if (hasUserInfo(data)) {
// // //     if (data.email) Cookies.set("email", data.email, { expires: 7 });
// // //     if (data.userName) Cookies.set("userName", data.userName, { expires: 7 });
// // //     if (data.phone) Cookies.set("phone", data.phone, { expires: 7 });
// // //   }

// // //   if (expiresIn) {
// // //     const expiresAt = Date.now() + expiresIn * 1000;
// // //     Cookies.set("expiresAt", new Date(expiresAt).toISOString(), { expires: 7 });
// // //     scheduleRefresh(expiresIn);
// // //   }
// // // }

// // // // ===== AXIOS INTERCEPTORS =====
// // // api.interceptors.request.use((config) => {
// // //   const token = tokenService.getAccessToken();
// // //   if (token) config.headers["Authorization"] = `Bearer ${token}`;
// // //   return config;
// // // });

// // // let isRefreshing = false;
// // // let refreshSubscribers: ((token: string) => void)[] = [];

// // // function subscribeTokenRefresh(cb: (token: string) => void) {
// // //   refreshSubscribers.push(cb);
// // // }

// // // function onRefreshed(token: string) {
// // //   refreshSubscribers.forEach((cb) => cb(token));
// // //   refreshSubscribers = [];
// // // }

// // // api.interceptors.response.use(
// // //   (response) => response,
// // //   async (error) => {
// // //     const originalRequest = error.config as AxiosRequestConfigWithRetry;

// // //     // Nếu lỗi 401 mà chưa retry -> refresh token
// // //     if (error.response?.status === 401 && !originalRequest._retry) {
// // //       if (isRefreshing) {
// // //         // Nếu đang refresh → đợi token mới
// // //         return new Promise((resolve) => {
// // //           subscribeTokenRefresh((token: string) => {
// // //             originalRequest.headers!["Authorization"] = `Bearer ${token}`;
// // //             resolve(api(originalRequest));
// // //           });
// // //         });
// // //       }

// // //       originalRequest._retry = true;
// // //       isRefreshing = true;

// // //       try {
// // //         const newToken = await authService.refreshAccess();
// // //         isRefreshing = false;
// // //         onRefreshed(newToken);

// // //         originalRequest.headers!["Authorization"] = `Bearer ${newToken}`;
// // //         return api(originalRequest);
// // //       } catch (err) {
// // //         isRefreshing = false;
// // //         authService.logout();
// // //         return Promise.reject(err);
// // //       }
// // //     }

// // //     return Promise.reject(error);
// // //   }
// // // );

// // // // ===== AUTH SERVICE =====
// // // export const authService = {
// // //   api,

// // //   async login(data: LoginRequest): Promise<LoginResponse> {
// // //     const res = await api.post<ApiResponse<LoginResponse>>(
// // //       `${API_URL}/login`,
// // //       data
// // //     );
// // //     const payload = res.data.data;
// // //     saveUserCookies(payload);
// // //     return payload;
// // //   },

// // //   async refreshAccess(): Promise<string> {
// // //     const res = await api.get<ApiResponse<{ accessToken: string }>>(
// // //       `${API_URL}/refresh-access`,
// // //       { withCredentials: true }
// // //     );

// // //     const payload = res.data.data;

// // //     if (payload.accessToken) {
// // //       tokenService.setAccessToken(payload.accessToken);
// // //       console.log("🔄 Refreshed token:", payload.accessToken);
// // //     }

// // //     return payload.accessToken;
// // //   },

// // //   async verifyOtp(data: VerifyOtpRequest): Promise<void> {
// // //     await api.post(`${API_URL}/verify-otp`, data);
// // //   },

// // //   logout() {
// // //     tokenService.clearAccessToken();
// // //     [
// // //       "refreshToken",
// // //       "roles",
// // //       "roleId",
// // //       "roleName",
// // //       "userId",
// // //       "email",
// // //       "userName",
// // //       "phone",
// // //       "expiresAt",
// // //     ].forEach((key) => Cookies.remove(key));
// // //     if (refreshTimeout) clearTimeout(refreshTimeout);
// // //   },

// // //   getUserInfo(): AuthData {
// // //     const expiresAt = Cookies.get("expiresAt");
// // //     const rolesString = Cookies.get("roles");
// // //     const roles: RoleUser[] | undefined = rolesString
// // //       ? JSON.parse(rolesString)
// // //       : undefined;

// // //     return {
// // //       accessToken: tokenService.getAccessToken() || "",
// // //       refreshToken: Cookies.get("refreshToken"),
// // //       roles,
// // //       userId: Cookies.get("userId"),
// // //       expiresIn: expiresAt
// // //         ? Math.floor(
// // //             (new Date(expiresAt).getTime() - Date.now()) / 1000
// // //           )
// // //         : undefined,
// // //       email: Cookies.get("email"),
// // //       userName: Cookies.get("userName"),
// // //       phone: Cookies.get("phone"),
// // //     };
// // //   },
// // // };

// import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
// import Cookies from "js-cookie";
// import {
//   LoginRequest,
//   LoginResponse,
//   VerifyOtpRequest,
//   ApiResponse,
//   RoleUser,
// } from "@/types/auth";

// interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
//   _retry?: boolean;
// }

// const API_URL = `${process.env.NEXT_PUBLIC_BE_API_BASE}/api/authentication`;

// const api: AxiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BE_API_BASE,
// });

// // ================= TOKEN SERVICE =================
// const tokenService = {
//   getAccessToken: () => Cookies.get("accessToken") || null,
//   setAccessToken: (token: string) => {
//     Cookies.set("accessToken", token, { expires: 1 });
//     console.log("[authService] ✅ Đã lưu accessToken vào cookie");
//   },
//   clearAccessToken: () => {
//     Cookies.remove("accessToken");
//     console.log("[authService] ❌ Đã xóa accessToken khỏi cookie");
//   },
// };

// // ================= AUTO REFRESH =================
// let countdownInterval: NodeJS.Timeout | null = null;

// /**
//  * Lên lịch refresh token trước khi accessToken hết hạn
//  * @param expiresInSeconds Thời gian còn lại của accessToken hiện tại (giây)
//  */
// function scheduleRefresh(expiresInSeconds: number) {
//   if (countdownInterval) {
//     console.log("[authService] ⏳ Refresh token đã có lịch, không tạo lại");
//     return;
//   }
//   const refreshThreshold = 60; // refresh trước 1 phút
//   const refreshDelay = Math.max(expiresInSeconds - refreshThreshold, 0) * 1000;

//   console.log(
//     `[authService] ⏱ Token còn ${expiresInSeconds}s → sẽ refresh sau ${Math.round(
//       refreshDelay / 1000
//     )}s`
//   );

//   if (countdownInterval) clearInterval(countdownInterval);

//   let secondsLeft = Math.round(refreshDelay / 1000);
//   countdownInterval = setInterval(() => {
//     secondsLeft -= 1;
//     if (secondsLeft % 5 === 0 || secondsLeft <= 5) {
//       console.log(`[authService] ⏳ Còn ${secondsLeft}s sẽ refresh token...`);
//     }
//     if (secondsLeft <= 0 && countdownInterval) clearInterval(countdownInterval);
//   }, 1000);

//   setTimeout(async () => {
//     if (countdownInterval) clearInterval(countdownInterval);
//     try {
//       console.log("[authService] 🔄 AccessToken sắp hết hạn → refresh ngay");
//       await authService.refreshAccess();
//     } catch (err) {
//       console.error("[authService] ❌ Refresh thất bại → logout", err);
//       authService.logout();
//     }
//   }, refreshDelay);
// }

// // ================= SAVE COOKIES =================

// function saveUserCookies(data: LoginResponse) {
//   const {
//     accessToken,
//     refreshToken,
//     userId,
//     roles,
//     expiresIn,
//     email,
//     userName,
//     phone,
//     ...rest
//   } = data;

//   console.log("[authService] 💾 Đang lưu thông tin đăng nhập...");

//   if (accessToken) tokenService.setAccessToken(accessToken);
//   if (refreshToken) Cookies.set("refreshToken", refreshToken, { expires: 7 });

//   if (roles?.length) {
//     Cookies.set("roles", JSON.stringify(roles), { expires: 7 });
//     Cookies.set("roleId", roles[0].roleId, { expires: 7 });
//     Cookies.set("roleName", roles[0].roleName, { expires: 7 });
//   }

//   if (userId) Cookies.set("userId", String(userId), { expires: 7 });
//   if (email) Cookies.set("email", email, { expires: 7 });
//   if (userName) Cookies.set("userName", userName, { expires: 7 });
//   if (phone) Cookies.set("phone", phone, { expires: 7 });

//     Object.entries(rest).forEach(([key, value]) => {
//     if (value) Cookies.set(key, String(value), { expires: 7 });
//   });

//   if (expiresIn) {
//     const expiresAt = Date.now() + expiresIn * 1000;
//     Cookies.set("expiresAt", new Date(expiresAt).toISOString(), { expires: 7 });
//     console.log(
//       `[authService] ⏱ Token hết hạn sau ${expiresIn}s → đặt lịch refresh`
//     );
//     scheduleRefresh(expiresIn);
//   }
// }

// // ================= AXIOS INTERCEPTORS =================
// api.interceptors.request.use((config) => {
//   const token = tokenService.getAccessToken();
//   if (token) config.headers["Authorization"] = `Bearer ${token}`;
//   return config;
// });

// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config as AxiosRequestConfigWithRetry;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         console.warn("[authService] ⚠️ Token hết hạn → đang refresh...");
//         const newToken = await authService.refreshAccess();
//         originalRequest.headers!["Authorization"] = `Bearer ${newToken}`;
//         return api(originalRequest);
//       } catch {
//         console.error("[authService] ❌ Refresh thất bại → logout");
//         authService.logout();
//         return Promise.reject(error);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// // ================= AUTH SERVICE =================
// export const authService = {
//   api,

//   async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
//     console.log("[authService] 🚀 Gọi API login...");
//     const res = await api.post<ApiResponse<LoginResponse>>(
//       `${API_URL}/login`,
//       data
//     );
//     if (res.data.data) saveUserCookies(res.data.data);
//     return res.data;
//   },

// // ================= REFRESH ACCESS =================
//   async refreshAccess(): Promise<string> {
//     const refreshToken = Cookies.get("refreshToken");
//     if (!refreshToken) throw new Error("Không có refresh token");

//     console.log("[authService] 🔄 Gọi API refresh-access...");

//     const res = await api.post<
//       ApiResponse<{ accessToken: string; expiresIn: number }>
//     >(`${API_URL}/refresh-access`, { refreshToken });

//     const payload = res.data.data;
//     if (!payload?.accessToken || !payload.expiresIn)
//       throw new Error("Refresh token API trả về không hợp lệ");

//     // ✅ Lưu accessToken mới
//     tokenService.setAccessToken(payload.accessToken);

//     // expiresIn từ server sẽ là 7 ngày (theo yêu cầu)
//     const expiresAt = Date.now() + payload.expiresIn * 1000;
//     Cookies.set("expiresAt", new Date(expiresAt).toISOString(), { expires: 7 });

//     // Lên lịch refresh tiếp
//     scheduleRefresh(payload.expiresIn);

//     console.log(
//       `[authService] ✅ AccessToken mới có hạn ${payload.expiresIn}s`
//     );
//     return payload.accessToken;
//   },

//   async verifyOtp(data: VerifyOtpRequest) {
//     await api.post(`${API_URL}/verify-otp`, data);
//   },

//   logout() {
//     console.log("[authService] 🚪 Logout được gọi → xóa toàn bộ cookies...");
//     tokenService.clearAccessToken();
//     [
//       "refreshToken",
//       "roles",
//       "roleId",
//       "roleName",
//       "userId",
//       "email",
//       "userName",
//       "phone",
//       "expiresAt",
//     ].forEach((k) => Cookies.remove(k));

//     if (countdownInterval) clearInterval(countdownInterval);

//     if (typeof window !== "undefined") {
//       window.location.href = "/auth/login";
//     }
//   },

//   getUserInfo() {
//     const expiresAt = Cookies.get("expiresAt");
//     const rolesString = Cookies.get("roles");
//     const roles: RoleUser[] | undefined = rolesString
//       ? JSON.parse(rolesString)
//       : undefined;

//     return {
//       accessToken: tokenService.getAccessToken() || "",
//       refreshToken: Cookies.get("refreshToken"),
//       roles,
//       userId: Cookies.get("userId"),
//       expiresIn: expiresAt
//         ? Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)
//         : undefined,
//       email: Cookies.get("email"),
//       userName: Cookies.get("userName"),
//       phone: Cookies.get("phone"),
//     };
//   },

//   async resumeSession() {
//     const accessToken = Cookies.get("accessToken");
//     const expiresAt = Cookies.get("expiresAt");
//     const refreshToken = Cookies.get("refreshToken");

//     console.log("[authService] ♻️ resumeSession() đang kiểm tra phiên...");

//     if (!accessToken || !expiresAt || !refreshToken) {
//       console.warn("[authService] ⚠️ Không tìm thấy token hoặc refreshToken");
//       return false;
//     }

//     const expTime = new Date(expiresAt).getTime();
//     const now = Date.now();
//     const remaining = (expTime - now) / 1000;

//     console.log(`[authService] 🕐 Token còn hạn ${Math.floor(remaining)}s`);

//     if (remaining > 60) {
//       scheduleRefresh(remaining);
//       return true;
//     }

//     try {
//       console.log("[authService] 🔄 Token sắp hết hạn → refresh ngay");
//       await this.refreshAccess();
//       return true;
//     } catch (err) {
//       console.error("[authService] ❌ Refresh thất bại → logout", err);
//       this.logout();
//       return false;
//     }
//   },
// };

// services/authService.ts
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import {
  LoginRequest,
  LoginResponse,
  VerifyOtpRequest,
  ApiResponse,
  RoleUser,
} from "@/types/auth";

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

const API_URL = `${process.env.NEXT_PUBLIC_BE_API_BASE}/api/authentication`;

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BE_API_BASE,
  // withCredentials: true, // gửi cookie refreshToken sang BE
});

// ================= TOKEN SERVICE =================
const tokenService = {
  getAccessToken: () => Cookies.get("accessToken") || null,
  setAccessToken: (token: string) =>
    Cookies.set("accessToken", token, { expires: 1 }),
  clearAccessToken: () => Cookies.remove("accessToken"),
};

// ================= AUTO REFRESH =================
let countdownInterval: NodeJS.Timeout | null = null;

function scheduleRefresh(expiresInSeconds: number) {
  if (countdownInterval) clearInterval(countdownInterval);

  const refreshThreshold = 60; // refresh trước 1 phút
  const refreshDelay = Math.max(expiresInSeconds - refreshThreshold, 0) * 1000;

  countdownInterval = setInterval(() => {}, 1000); // optional: log countdown

  setTimeout(async () => {
    if (countdownInterval) clearInterval(countdownInterval);
    try {
      await authService.refreshAccess();
    } catch {
      authService.logout();
    }
  }, refreshDelay);
}

// ================= SAVE COOKIES =================
function saveUserCookies(data: LoginResponse) {
  const {
    accessToken,
    refreshToken,
    userId,
    roles,
    expiresIn,
    email,
    userName,
    phone,
    ...rest
  } = data;

  if (accessToken) tokenService.setAccessToken(accessToken);
  if (refreshToken) Cookies.set("refreshToken", refreshToken, { expires: 7 });

  if (roles?.length) {
    Cookies.set("roles", JSON.stringify(roles), { expires: 7 });
    Cookies.set("roleId", roles[0].roleId, { expires: 7 });
    Cookies.set("roleName", roles[0].roleName, { expires: 7 });
  }

  if (userId) Cookies.set("userId", String(userId), { expires: 7 });
  if (email) Cookies.set("email", email, { expires: 7 });
  if (userName) Cookies.set("userName", userName, { expires: 7 });
  if (phone) Cookies.set("phone", phone, { expires: 7 });

  Object.entries(rest).forEach(
    ([k, v]) => v && Cookies.set(k, String(v), { expires: 7 })
  );

  if (expiresIn) {
    const expiresAt = Date.now() + expiresIn * 1000;
    Cookies.set("expiresAt", new Date(expiresAt).toISOString(), { expires: 7 });
    scheduleRefresh(expiresIn);
  }
}

// ================= AXIOS INTERCEPTORS =================
api.interceptors.request.use((config) => {
  const token = tokenService.getAccessToken();
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await authService.refreshAccess();
        originalRequest.headers!["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        authService.logout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

// ================= AUTH SERVICE =================
export const authService = {
  api,

  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const res = await api.post<ApiResponse<LoginResponse>>(
      `${API_URL}/login`,
      data
    );
    if (res.data.data) saveUserCookies(res.data.data);
    return res.data;
  },

  async refreshAccess(): Promise<string> {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) throw new Error("Không có refresh token");

    const res = await api.post<
      ApiResponse<{ accessToken: string; expiresIn: number }>
    >(`${API_URL}/refresh-access`, { refreshToken });

    const payload = res.data.data;
    if (!payload?.accessToken || !payload.expiresIn)
      throw new Error("Refresh token API trả về không hợp lệ");

    tokenService.setAccessToken(payload.accessToken);

    const expiresAt = Date.now() + payload.expiresIn * 1000;
    Cookies.set("expiresAt", new Date(expiresAt).toISOString(), { expires: 7 });

    scheduleRefresh(payload.expiresIn);

    return payload.accessToken;
  },

  async verifyOtp(data: VerifyOtpRequest) {
    await api.post(`${API_URL}/verify-otp`, data);
  },

  logout() {
    tokenService.clearAccessToken();
    [
      "refreshToken",
      "roles",
      "roleId",
      "roleName",
      "userId",
      "email",
      "userName",
      "phone",
      "expiresAt",
    ].forEach((k) => Cookies.remove(k));

    if (countdownInterval) clearInterval(countdownInterval);
    if (typeof window !== "undefined") window.location.href = "/auth/login";
  },

  getUserInfo() {
    const expiresAt = Cookies.get("expiresAt");
    const rolesString = Cookies.get("roles");
    const roles: RoleUser[] | undefined = rolesString
      ? JSON.parse(rolesString)
      : undefined;

    return {
      accessToken: tokenService.getAccessToken() || "",
      refreshToken: Cookies.get("refreshToken"),
      roles,
      userId: Cookies.get("userId"),
      expiresIn: expiresAt
        ? Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)
        : undefined,
      email: Cookies.get("email"),
      userName: Cookies.get("userName"),
      phone: Cookies.get("phone"),
    };
  },

  async resumeSession() {
    const accessToken = Cookies.get("accessToken");
    const expiresAt = Cookies.get("expiresAt");
    const refreshToken = Cookies.get("refreshToken");

    if (!accessToken || !expiresAt || !refreshToken) return false;

    const remaining = (new Date(expiresAt).getTime() - Date.now()) / 1000;
    if (remaining > 60) {
      scheduleRefresh(remaining);
      return true;
    }

    try {
      await this.refreshAccess();
      return true;
    } catch {
      this.logout();
      return false;
    }
  },
};
