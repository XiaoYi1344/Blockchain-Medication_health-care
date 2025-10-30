"use client";

import CategoryTableBase from "@/components/body/distributor/manager_mediced/manager_category/widgets/CategoryTableBase";
import { Role } from "@/types/role";

interface Props {
  role: Role;
  onSuccess?: () => void;
  onError?: () => void;
}

export default function CategoryPendingTable({
  role,
  onSuccess,
  onError,
}: Props) {
  return (
    <CategoryTableBase
      isActive={false} // ✅ danh mục chờ duyệt
      title="Danh mục chờ duyệt"
      role={role}
      onSuccess={onSuccess}
      onError={onError}
    />
  );
}
