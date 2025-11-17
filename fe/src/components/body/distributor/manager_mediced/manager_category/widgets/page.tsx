"use client";

import CategoryTableBase from "@/components/body/distributor/manager_mediced/manager_category/widgets/CategoryTableBase";
import { Role } from "@/types/role";

interface Props {
  role: Role;
  onSuccess?: () => void;
  onError?: () => void;
}

export default function CategoryApprovedTable({
  role,
  onSuccess,
  onError,
}: Props) {
  return (
    <CategoryTableBase
      isActive={true} // ✅ danh mục đã duyệt
      title="Danh mục đã duyệt"
      role={role}
      onSuccess={onSuccess}
      onError={onError}
    />
  );
}
