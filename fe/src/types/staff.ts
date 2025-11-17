// src/types/staff.ts
export interface PermissionType {
  _id: string;
  name: string;
  displayName: string;
  // type: "permit" | "manufacturer" | "distributor" | "hospital" | "pharmacy" | "guest";
}

export interface Role {
  _id: string;
  name: string;
  displayName: string;
  type: string;
  permissions?: PermissionType[];
}

// src/types/staff.ts
export interface User {
  _id: string;
  userName: string;
  fullName?: string;
  email: string;
  phone: string;
  address?: string;
  isActive: boolean;
  dob?: string;
  companyId: string;
  roleId: string[];
  permissionIds?: string[];
  createdBy?: string;  // 👈 liên kết với actorUserId trong AuditLog
}

export interface CreateUserRequest {
  userName: string;
  email: string;
  phone: string;
  password: string;   // ✅ thêm password
  dob?: string;
  companyId: string;
  roleIds: string[];
  permissionIds: string[];
}

export type CreateRoleRequest = {
  name: string;
  displayName: string;
  permissionIds: string[];
  // userId: string; // để biết ai tạo role
};

export interface UpdateUserRequest {
  userName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  address?: string;
  avatar?: File;
  gender?: "male" | "female" | "other";
  nationality?: string;
}

export interface UpdateRoleRequest {
  roleId: string;
  permissionIds: string[];
  name: string;
  displayName: string;
}
