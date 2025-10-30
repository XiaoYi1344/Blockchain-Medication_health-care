// src/types/role.ts

// Enum định nghĩa tất cả các Role trong hệ thống
export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
  VIEWER = "VIEWER",
}

// Nếu bạn muốn dùng kiểu union string thay vì enum:
// export type Role = "ADMIN" | "MANAGER" | "STAFF" | "VIEWER";
