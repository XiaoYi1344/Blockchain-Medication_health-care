export interface LoginRequest {
  email?: string;
  userName?: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  type: string;
  newEmail?: string;
}

export interface RoleUser {
  roleId: string;
  roleName: string;
}

export interface AuthData {
  accessToken: string;
  refreshToken?: string;
  roles?: RoleUser[];
  userId?: string;
  expiresIn?: number;
  email?: string;
  userName?: string;
  phone?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  roles?: RoleUser[];
  userId: string;
  expiresIn?: number;
  email?: string;
  userName?: string;
  phone?: string;
}

export interface RefreshAccessResponse {
  accessToken: string;
  refreshToken?: string;
  roles?: RoleUser[];
  userId?: string;
  expiresIn?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
