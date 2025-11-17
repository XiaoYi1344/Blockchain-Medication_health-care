// distributor/batchManager/page.tsx
"use client";

import AccountForm from "@/components/auth/user/AccountForm";
import React from "react";

export default function AccountFormPage() {
  // ở đây bạn có thể truyền role cứng để test, hoặc lấy từ context/auth
  return <AccountForm />;
  // return <CategoryManager role="company_admin" />;
}
