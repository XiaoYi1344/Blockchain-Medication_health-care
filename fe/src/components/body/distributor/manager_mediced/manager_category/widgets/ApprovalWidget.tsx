

import CategoryTableBase from "./CategoryTableBase";
import { Role } from "@/types/role";

interface Props {
  role: Role;
}

export default function CategoryPendingTable({ role }: Props) {
  return (
    <CategoryTableBase
      isActive={false} // false = danh mục chờ duyệt
      title="Danh mục chờ duyệt"
      role={role}
    />
  );
}
