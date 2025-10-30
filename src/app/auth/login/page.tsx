// distributor/batchManager/page.tsx
"use client";

import LoginForm from "@/components/auth/user/login/LoginForm";
import React from "react";

export default function LoginFormPage() {
  // ở đây bạn có thể truyền role cứng để test, hoặc lấy từ context/auth
  return <LoginForm />;
  // return <CategoryManager role="company_admin" />;
}
