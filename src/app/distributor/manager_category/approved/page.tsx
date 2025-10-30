

import CategoryApprovedTable from "@/components/body/distributor/manager_mediced/manager_category/widgets/page";
import { Role } from "@/types/role";

export default function Page() {
  return <CategoryApprovedTable role={Role.ADMIN} />;
}
