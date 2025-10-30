"use client";

import CategoryTableBase from "@/components/body/distributor/manager_mediced/manager_category/widgets/CategoryTableBase";
import { useEntityPermission } from "@/hooks/database/useEntityPermission";

export default function CategoryPendingPage() {
  const { role } = useEntityPermission("category");

  return (
    <CategoryTableBase
      isActive={false}
      title="Danh mục chờ duyệt"
      role={role ?? undefined}
    />
  );
}
