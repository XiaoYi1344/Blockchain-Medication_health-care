
// import { authService } from "@/services/authService";
// import { User, UpdateUserRequest, ChangePasswordRequest, ForgotPasswordRequest, NewPasswordRequest } from "@/types/user";

// const API_URL = process.env.NEXT_PUBLIC_BE_API_BASE + "/api";

// export const userService = {
//   async getUser(): Promise<User> {
//     const token = authService.getUserInfo().accessToken;
//     if (!token) {
//       console.warn("Không có token, fallback từ cookie/localStorage");
//       const userFromCookie = authService.getUserInfo();
//       return {
//         userName: userFromCookie.userName || "",
//         email: userFromCookie.email || "",
//         phone: userFromCookie.phone || "",
//         fullName: userFromCookie.userName || "",
//         dob: "",
//         address: "",
//         gender: undefined,
//         nationality: "",
//         avatar: "",
//       };
//     }

//     try {
//       const res = await authService.api.get<User>(`${API_URL}/user`);
//       return res.data;
//     } catch (err) {
//       console.warn("Không thể tải user từ server, fallback từ cookie.", err);
//       const userFromCookie = authService.getUserInfo();
//       return {
//         userName: userFromCookie.userName || "",
//         email: userFromCookie.email || "",
//         phone: userFromCookie.phone || "",
//         fullName: userFromCookie.userName || "",
//         dob: "",
//         address: "",
//         gender: undefined,
//         nationality: "",
//         avatar: "",
//       };
//     }
//   },

//   async updateUser(data: UpdateUserRequest): Promise<User> {
//     const formData = new FormData();
//     Object.entries(data).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         if (value instanceof File) formData.append(key, value);
//         else if (typeof value === "string" && value.trim() !== "") formData.append(key, value);
//       }
//     });

//     const res = await authService.api.put<User>(`${API_URL}/user`, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return res.data;
//   },

//   async changePassword(data: ChangePasswordRequest): Promise<void> {
//     await authService.api.put(`${API_URL}/user/change-password`, data);
//   },

//   async forgotPassword(data: ForgotPasswordRequest): Promise<{ type: string }> {
//     const res = await authService.api.post<{ type: string }>(`${API_URL}/user/forgot-password`, data);
//     return res.data;
//   },

//   async newPassword(data: NewPasswordRequest): Promise<void> {
//     await authService.api.post(`${API_URL}/user/new-password`, data);
//   },
// };



// import { getCookie } from "cookies-next";
// import axios from "axios";
// import {
//   UpdateUserRequest,
//   ForgotPasswordRequest,
//   NewPasswordRequest,
//   ProfileUser,
// } from "@/types/user";
// import { authService } from "@/services/authService";

// const API_BASE = process.env.NEXT_PUBLIC_BE_API_BASE;
// const API_URL = `${API_BASE}/api/user`;

// // function fallbackUser(): ProfileUser {
// //   const user = authService.getUserInfo();
// //   return {
// //     userName: user.userName || "",
// //     email: user.email || "",
// //     phone: user.phone || "",
// //     fullName: user.userName || "",
// //     dob: "",
// //     address: "",
// //     gender: undefined,
// //     nationality: "",
// //     avatar: "",
// //     company: "", // optional, không bắt buộc
// //   };
// // }

// function fallbackUser(): ProfileUser {
//   const user = authService.getUserInfo();
//   return {
//     userName: user.userName || "",
//     email: user.email || "",
//     phone: user.phone || "",
//     fullName: user.userName || "",
//     dob: "",
//     address: "",
//     gender: undefined,
//     nationality: "",
//     avatar: "",
//     company: "",
//   };
// }


// // async function fetchAvatarUrl(avatarId: string, token: string): Promise<string> {
// //   try {
// //     const res = await axios.get(`${API_BASE}/api/upload/${avatarId}`, {
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //         "ngrok-skip-browser-warning": "true", // bỏ cảnh báo ngrok
// //         "Cache-Control": "no-cache",           // tránh cache
// //       },
// //       responseType: "blob",                     // nhận blob để tạo object URL
// //     });

// //     // Tạo URL cho <Avatar>
// //     return URL.createObjectURL(res.data);
// //   } catch (err) {
// //     console.error("❌ Lỗi fetch avatar:", err);
// //     return "";
// //   }
// // }


// export const userService = {
  
// // async getUser(): Promise<ProfileUser> {
// //     try {
// //       const userInfo = authService.getUserInfo();
// //       const res = await axios.get<{ data: ProfileUser }>(API_URL, {
// //         headers: {
// //           Authorization: `Bearer ${userInfo?.accessToken}`,
// //           "ngrok-skip-browser-warning": "true",
// //           "Cache-Control": "no-cache",
// //         },
// //       });

// //       const user = res.data.data ?? fallbackUser();

// //       // Nếu avatar là ID → dùng proxy Next.js
// //       const avatarUrl = user.avatar
// //   ? `${process.env.NEXT_PUBLIC_BE_API_BASE}/api/upload/${user.avatar}`
// //   : "";


// //       return { ...user, avatar: avatarUrl };
// //     } catch (err) {
// //       console.warn("Error fetching user:", err);
// //       return fallbackUser();
// //     }
// //   },

// // async getUser(): Promise<ProfileUser> {
// //   try {
// //     const userInfo = authService.getUserInfo();
// //     const res = await axios.get<{ data: ProfileUser }>(API_URL, {
// //       headers: {
// //         Authorization: `Bearer ${userInfo?.accessToken}`,
// //         "ngrok-skip-browser-warning": "true",
// //         "Cache-Control": "no-cache",
// //       },
// //     });

// //     const user = res.data.data ?? fallbackUser();

// //     // ✅ Nếu có avatarId → gọi BE lấy secure_url
// //     if (user.avatar) {
// //       try {
// //         const avatarRes = await axios.get<{ secure_url: string }>(
// //           `${process.env.NEXT_PUBLIC_BE_API_BASE}/api/upload/${user.avatar}`,
// //           {
// //             headers: {
// //               Authorization: `Bearer ${userInfo?.accessToken}`,
// //               "ngrok-skip-browser-warning": "true",
// //             },
// //           }
// //         );

// //         user.avatar = avatarRes.data.secure_url; // gán secure_url cho FE
// //       } catch (err) {
// //         console.error("❌ Lỗi khi tải avatar:", err);
// //         user.avatar = "";
// //       }
// //     }

// //     return user;
// //   } catch (err) {
// //     console.warn("Error fetching user:", err);
// //     return fallbackUser();
// //   }
// // }
// // ,


// //   async updateUser(data: UpdateUserRequest): Promise<void> {
// //     const token = getCookie("accessToken") || authService.getUserInfo()?.accessToken;
// //     if (!token) throw new Error("Không tìm thấy accessToken để xác thực");

// //     let body: FormData | Record<string, string>;
// //     let isFormData = false;

// //     if (data.avatar instanceof File) {
// //       isFormData = true;
// //       const formData = new FormData();
// //       Object.entries(data).forEach(([key, value]) => {
// //         if (!value) return;
// //         if (value instanceof File) formData.append("avatar", value);
// //         else if (key === "gender") formData.append("gender", String(value).toUpperCase());
// //         else formData.append(key, String(value));
// //       });
// //       body = formData;
// //     } else {
// //       const jsonBody: Record<string, string> = {};
// //       Object.entries(data).forEach(([key, value]) => {
// //         if (!value) return;
// //         if (key === "gender") jsonBody.gender = String(value).toUpperCase();
// //         else jsonBody[key] = String(value);
// //       });
// //       body = jsonBody;
// //     }

// //     await axios.put(API_URL, body, {
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //         ...(isFormData ? {} : { "Content-Type": "application/json" }),
// //         "ngrok-skip-browser-warning": "true",
// //       },
// //     });
// //   },


// async getUser(): Promise<ProfileUser> {
//     const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

//     try {
//       const res = await axios.get<{ data: ProfileUser }>(`${API_BASE}/api/user`, {
//         headers: {
//           Authorization: `Bearer ${userInfo?.accessToken}`,
//           "ngrok-skip-browser-warning": "true",
//         },
//       });

//       const user = res.data.data;

//       // Nếu có avatarId → trả về proxy URL
//       if (user?.avatar) {
//         user.avatar = `/api/avatar/${user.avatar}`;
//       }

//       return user;
//     } catch (err) {
//       console.error("Error fetching user:", err);
//       return {
//         userName: "",
//         fullName: "",
//         email: "",
//         phone: "",
//         dob: "",
//         address: "",
//         gender: "other",
//         nationality: "",
//         avatar: "",
//       };
//     }
//   },

//   // Cập nhật user + avatar
//   async updateUser(payload: UpdateUserRequest) {
//     const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

//     const formData = new FormData();
//     Object.entries(payload).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         formData.append(key, value as any);
//       }
//     });

//     try {
//       const res = await axios.put(`${API_BASE}/api/user`, formData, {
//         headers: {
//           Authorization: `Bearer ${userInfo?.accessToken}`,
//           "ngrok-skip-browser-warning": "true",
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       return res.data;
//     } catch (err) {
//       console.error("Error updating user:", err);
//       throw err;
//     }
//   },
//   async uploadAvatar(file: File) {
//   const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

//   const formData = new FormData();
//   formData.append("avatar", file);

//   const res = await axios.post(`/api/avatar/upload`, formData, {
//     headers: {
//       Authorization: `Bearer ${userInfo?.accessToken}`,
//     },
//   });

//   return res.data;
// },

// async changePassword(data: { userId: string; oldPassword: string; newPassword: string }): Promise<void> {
//   if (!data.oldPassword || !data.newPassword) {
//     throw new Error("Bạn phải nhập mật khẩu cũ và mật khẩu mới");
//   }

//   const token = getCookie("accessToken") || authService.getUserInfo()?.accessToken;
//   if (!token) throw new Error("Không tìm thấy accessToken để xác thực");

//   const payload = {
//     userId: data.userId,
//     oldPassword: data.oldPassword,
//     newPassword: data.newPassword,
//   };

//   console.log("👉 Payload gửi lên server:", payload);

//   const res = await axios.put(`${API_BASE}/api/user/change-password`, payload, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "ngrok-skip-browser-warning": "true",
//     },
//   });

//   if (!res.data || (res.data.success !== true && !res.data.message)) {
//     throw new Error("Đổi mật khẩu thất bại");
//   }
// }
// ,

//   async forgotPassword(data: ForgotPasswordRequest): Promise<{ type: string }> {
//     const res = await axios.post<{ type: string }>(
//       `${API_BASE}/api/user/forgot-password`,
//       data
//     );
//     return res.data;
//   },

//   async newPassword(data: NewPasswordRequest): Promise<void> {
//     await axios.post(`${API_BASE}/api/user/new-password`, data);
//   },
// };


import { getCookie } from "cookies-next";
import axios from "axios";
import {
  UpdateUserRequest,
  ForgotPasswordRequest,
  NewPasswordRequest,
  ProfileUser,
} from "@/types/user";
import { authService } from "@/services/authService";

const API_BASE = process.env.NEXT_PUBLIC_BE_API_BASE;
const API_URL = `${API_BASE}/api/user`;

// Fallback khi không có dữ liệu user
function fallbackUser(): ProfileUser {
  const user = authService.getUserInfo();
  return {
    userName: user?.userName || "",
    fullName: user?.userName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dob: "",
    address: "",
    gender: "other",
    nationality: "",
    avatar: "",
    company: "",
  };
}

export const userService = {
  // Lấy thông tin user, avatar proxy qua Next.js
  // async getUser(): Promise<ProfileUser> {
  //   try {
  //     const token = getCookie("accessToken") || authService.getUserInfo()?.accessToken;
  //     if (!token) throw new Error("Không tìm thấy accessToken");

  //     // const res = await axios.get<{ data: ProfileUser }>(API_URL, {
  //     //   headers: {
  //     //     Authorization: `Bearer ${token}`,
  //     //     "ngrok-skip-browser-warning": "true",
  //     //   },
  //     // });

  //     const res = await axios.get<{ data: ProfileUser }>(API_URL, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "ngrok-skip-browser-warning": "true",
  //       ...config?.headers, // merge với headers tuỳ chọn
  //     },
  //   });

  //     const user = res.data.data ?? fallbackUser();

  //     // Nếu có avatar ID → dùng proxy route Next.js
  //     if (user.avatar) {
  //       user.avatar = `/${user.avatar}`;
  //     }

  //     return user;
  //   } catch (err) {
  //     console.error("Error fetching user:", err);
  //     return fallbackUser();
  //   }
  // },
  async getUser(config?: { headers?: Record<string, string> }): Promise<ProfileUser> {
  try {
    const token = getCookie("accessToken") || authService.getUserInfo()?.accessToken;
    if (!token) throw new Error("Không tìm thấy accessToken");

    const res = await axios.get<{ data: ProfileUser }>(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
        ...config?.headers, // ✅ merge với headers tùy chọn
      },
    });

    const user = res.data.data ?? fallbackUser();

    return user;
  } catch (err) {
    console.error("Error fetching user:", err);
    return fallbackUser();
  }
}
,

  // Cập nhật profile, bao gồm avatar (multipart/form-data)
//   async updateUser(payload: UpdateUserRequest) {
//   try {
//     const token = getCookie("accessToken") || authService.getUserInfo()?.accessToken;
//     if (!token) throw new Error("Không tìm thấy accessToken");

//     const formData = new FormData();

//     Object.entries(payload).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         if (key === "gender") {
//           formData.append(key, String(value).toUpperCase());
//         } else if (value instanceof File) {
//           formData.append(key, value); // File giữ nguyên
//         } else {
//           formData.append(key, String(value)); // convert số, boolean, text thành string
//         }
//       }
//     });

//     const res = await axios.put(API_URL, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "ngrok-skip-browser-warning": "true",
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     return res.data;
//   } catch (err) {
//     console.error("Error updating user:", err);
//     throw err;
//   }
// },

//   // Upload avatar, trả về ID để FE dùng proxy
//   async uploadAvatar(file: File) {
//     try {
//       const token = getCookie("accessToken") || authService.getUserInfo()?.accessToken;
//       if (!token) throw new Error("Không tìm thấy accessToken");

//       const formData = new FormData();
//       formData.append("avatar", file);

//       const res = await axios.post(`${API_BASE}/api/avatar/upload`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       return res.data; // { id: string, ... }
//     } catch (err) {
//       console.error("Upload avatar failed:", err);
//       throw err;
//     }
//   },
// async updateUser(data: Record<string, UpdateUserRequest>) {
//   try {
//     const formData = new FormData();

//     Object.entries(data).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         if (value instanceof File) {
//           formData.append(key, value); // giữ nguyên file
//         } else {
//           formData.append(key, String(value)); // convert số, boolean, text thành string
//         }
//       }
//     });

//     const res = await authService.api.put(`/api/user`, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     return res.data;
//   } catch (err: unknown) {
//     console.error("Update user failed:", err);

//     // Kiểm tra nếu là AxiosError
//     if (axios.isAxiosError(err)) {
//       const message = err.response?.data?.message || err.message;
//       throw new Error(message);
//     }

//     // Nếu không phải AxiosError
//     throw new Error("Cập nhật thất bại");
//   }
// },

async updateUser(payload: UpdateUserRequest) {
  try {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value); // giữ nguyên file
        } else {
          formData.append(key, String(value)); // convert số, boolean, text thành string
        }
      }
    });

    const token = getCookie("accessToken") || authService.getUserInfo()?.accessToken;
    if (!token) throw new Error("Không tìm thấy accessToken");

    const res = await axios.put(API_URL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        "ngrok-skip-browser-warning": "true",
      },
    });

    return res.data;
  } catch (err: unknown) {
    console.error("Update user failed:", err);

    if (axios.isAxiosError(err)) {
      const message = err.response?.data?.message || err.message;
      throw new Error(message);
    }

    throw new Error("Cập nhật thất bại");
  }
}
,

  // Đổi mật khẩu
  async changePassword(data: { userId: string; oldPassword: string; newPassword: string }): Promise<void> {
    if (!data.oldPassword || !data.newPassword) throw new Error("Bạn phải nhập mật khẩu cũ và mật khẩu mới");

    try {
      const token = getCookie("accessToken") || authService.getUserInfo()?.accessToken;
      if (!token) throw new Error("Không tìm thấy accessToken");

      const res = await axios.put(`${API_URL}/change-password`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!res.data || (res.data.success !== true && !res.data.message)) {
        throw new Error("Đổi mật khẩu thất bại");
      }
    } catch (err) {
      console.error("Change password failed:", err);
      throw err;
    }
  },

  // Quên mật khẩu
  async forgotPassword(data: ForgotPasswordRequest): Promise<{ type: string }> {
    const res = await axios.post<{ type: string }>(`${API_URL}/forgot-password`, data);
    return res.data;
  },

  // Tạo mật khẩu mới
  async newPassword(data: NewPasswordRequest): Promise<void> {
    await axios.post(`${API_URL}/new-password`, data);
  },
};



// Hàm fetch avatar từ server bằng ID
// async function fetchAvatarUrl(avatarId: string): Promise<string> {
//   try {
//     if (!avatarId) return "";

//     const res = await axios.get(
//       `${process.env.NEXT_PUBLIC_BE_API_BASE}/api/uploads/${avatarId}`,
//       { responseType: "blob" }
//     );

//     return URL.createObjectURL(res.data);
//   } catch (err) {
//     console.error("Lấy avatar thất bại:", err);
//     return "";
//   }
// }
// function isValidField(value: unknown): boolean {
//   if (value === undefined || value === null) return false;
//   if (typeof value === "string" && value.trim() === "") return false;
//   return true;
// }


// Lấy user hiện tại
  // async getUser(): Promise<User> {
  //   try {
  //     const userInfo = authService.getUserInfo();
  //     console.log("👉 getUser token:", userInfo?.accessToken);

  //     const res = await axios.get<{ data: User }>(API_URL, {
  //       headers: {
  //         Authorization: `Bearer ${userInfo?.accessToken}`,
  //         "ngrok-skip-browser-warning": "true",
  //         "Cache-Control": "no-cache",
  //       },
  //     });

  //     return res.data.data ?? fallbackUser();
  //   } catch (err: unknown) {
  //     if (axios.isAxiosError(err)) {
  //       console.warn("Axios error:", err.response?.data || err.message);
  //     } else if (err instanceof Error) {
  //       console.warn("Error fetching user:", err.message);
  //     } else {
  //       console.warn("Unknown error fetching user:", err);
  //     }
  //     return fallbackUser();
  //   }
  // },
  // Lấy user hiện tại
// async getUser(): Promise<ProfileUser> {
//   try {
//     const userInfo = authService.getUserInfo();
//     console.log("👉 getUser token:", userInfo?.accessToken);

//     const res = await axios.get<{ data: ProfileUser }>(API_URL, {
//       headers: {
//         Authorization: `Bearer ${userInfo?.accessToken}`,
//         "ngrok-skip-browser-warning": "true",
//         "Cache-Control": "no-cache",
//       },
//     });

//     const user = res.data.data ?? fallbackUser();

//     // Nếu avatar chỉ là ID → ghép baseURL để tạo link đầy đủ
//     const avatarUrl = user.avatar
//       ? `${process.env.NEXT_PUBLIC_BE_API_BASE}/uploads/${user.avatar}`
//       : "";

//     return { ...user, avatar: avatarUrl };
//   } catch (err: unknown) {
//     if (axios.isAxiosError(err)) {
//       console.warn("Axios error:", err.response?.data || err.message);
//     } else if (err instanceof Error) {
//       console.warn("Error fetching user:", err.message);
//     } else {
//       console.warn("Unknown error fetching user:", err);
//     }
//     return fallbackUser();
//   }
// },

// async getUser(): Promise<ProfileUser> {
//     try {
//       const userInfo = authService.getUserInfo();
//       const res = await axios.get<{ data: ProfileUser }>(API_URL, {
//         headers: {
//           Authorization: `Bearer ${userInfo?.accessToken}`,
//           "ngrok-skip-browser-warning": "true",
//           "Cache-Control": "no-cache",
//         },
//       });

//       const user = res.data.data ?? fallbackUser();

//       // Nếu avatar chỉ là ID → fetch blob để tạo URL
//       let avatarUrl = "";
//       if (user.avatar) {
//         avatarUrl = await fetchAvatarUrl(user.avatar);
//       }

//       return { ...user, avatar: avatarUrl };
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         console.warn("Axios error:", err.response?.data || err.message);
//       } else if (err instanceof Error) {
//         console.warn("Error fetching user:", err.message);
//       } else {
//         console.warn("Unknown error fetching user:", err);
//       }
//       return fallbackUser();
//     }
//   },

  // Update user (mới, fix 400 + 401)
  // async updateUser(data: UpdateUserRequest): Promise<User> {
  //   if (!data || Object.keys(data).length === 0) {
  //     throw new Error("Bạn phải gửi ít nhất 1 trường để cập nhật");
  //   }

  //   // Lấy token từ cookie hoặc authService
  //   const token =
  //     getCookie("accessToken", { path: "/" }) ||
  //     authService.getUserInfo()?.accessToken;
  //   if (!token) throw new Error("Không tìm thấy accessToken để xác thực");

  //   let body: FormData | Record<string, string> = {};
  //   let isFormData = false;

  //   // Nếu có avatar File → dùng FormData
  //   if (data.avatar instanceof File) {
  //     isFormData = true;
  //     const formData = new FormData();

  //     Object.entries(data).forEach(([key, value]) => {
  //       if (value === undefined || value === null || value === "") return;
  //       if (value instanceof File) formData.append("avatar", value); // key đúng server yêu cầu
  //       else formData.append(key, String(value));
  //     });

  //     body = formData;

  //     // Debug FormData
  //     console.log("Payload FormData:");
  //     for (const pair of formData.entries()) {
  //       console.log(pair[0], pair[1]);
  //     }
  //   } else {
  //     // Chỉ gửi các field có giá trị, kiểu JSON
  //     const jsonBody: Record<string, string> = {};
  //     Object.entries(data).forEach(([key, value]) => {
  //       if (value !== undefined && value !== null && value !== "") {
  //         jsonBody[key] = String(value);
  //       }
  //     });

  //     body = jsonBody;

  //     console.log("Payload JSON:", JSON.stringify(body));
  //   }

  //   // Gọi API
  //   const res = await axios.put<{ data: User }>(API_URL, body, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "Content-Type": isFormData ? undefined : "application/json",
  //       "ngrok-skip-browser-warning": "true",
  //     },
  //   });

  //   return res.data.data;
  // },
  // async updateUser(data: UpdateUserRequest): Promise<void> {
  // if (!data || Object.keys(data).length === 0) {
  //   throw new Error("Bạn phải gửi ít nhất 1 trường để cập nhật");
  // }

  // const token = getCookie("accessToken") || authService.getUserInfo()?.accessToken;
  // if (!token) throw new Error("Không tìm thấy accessToken để xác thực");

  // let body: FormData | Record<string, string> = {};
  // let isFormData = false;

  // if (data.avatar instanceof File) {
  //   isFormData = true;
  //   const formData = new FormData();
  //   Object.entries(data).forEach(([key, value]) => {
  //     if (value === undefined || value === null || value === "") return;
  //     if (value instanceof File) formData.append("avatar", value);
  //     else formData.append(key, String(value));
  //   });
  //   body = formData;
  // } else {
  //   const jsonBody: Record<string, string> = {};
  //   Object.entries(data).forEach(([key, value]) => {
  //     if (value !== undefined && value !== null && value !== "") {
  //       jsonBody[key] = String(value);
  //     }
  //   });
  //   body = jsonBody;
  // }

  // const res = await axios.put(API_URL, body, {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //     "Content-Type": isFormData ? undefined : "application/json",
  //     "ngrok-skip-browser-warning": "true",
  //   },
  // });

  // // Nếu server trả 200 nhưng không có data, chỉ cần check success
  // if (!res.data || (res.data.success !== true && !res.data.message)) {
  //   throw new Error("Cập nhật thất bại");
  // }},
