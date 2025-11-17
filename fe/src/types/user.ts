

export interface User {
  id: string;
  userName: string;
  fullName?: string;
  email: string;
  phone?: string;
  dob?: string; // yyyy-mm-dd
  address?: string;
  avatar?: string;
  gender?: "male" | "female" | "other";
  nationality?: string;
  company?: string;
}

export interface ProfileUser {
  userName: string;
  fullName?: string;
  email: string;
  phone?: string;
  dob?: string;
  address?: string;
  avatar?: string;
  gender?: "male" | "female" | "other";
  nationality?: string;
  company?: string;
}

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

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface NewPasswordRequest {
  email: string;
  newPassword: string;
}
