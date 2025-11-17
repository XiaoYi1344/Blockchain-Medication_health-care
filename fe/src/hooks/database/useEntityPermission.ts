import { useMemo } from "react";
import { usePermission } from "./usePermission";
import { PERMISSIONS } from "@/config/permissionConfig";
import { Role } from "@/types/role";

type EntityKey =
  | "product"
  | "category"
  | "batch"
  | "inventory"
  | "location"
  | "role"
  | "company"
  | "license"
  | "order"
  | "shipment";

// export function useEntityPermission(entity: EntityKey) {
//   const { can, loading, userId, role: roleStr } = usePermission();

//   // ✅ Chỉ trả Role nếu hợp lệ
//   const role: Role | null = roleStr && Object.values(Role).includes(roleStr as Role)
//     ? (roleStr as Role)
//     : null;

//   const mapping = useMemo(() => {
//     const entityUpper = entity.toUpperCase();
//     return {
//       canCreate: can(PERMISSIONS[`CREATE_${entityUpper}` as keyof typeof PERMISSIONS]),
//       canEdit:
//         can(PERMISSIONS[`UPDATE_${entityUpper}` as keyof typeof PERMISSIONS]) ||
//         can(PERMISSIONS[`UPDATE_${entityUpper}_PRIMARY_IMAGE` as keyof typeof PERMISSIONS]),
//       canDelete: can(PERMISSIONS[`DELETE_${entityUpper}` as keyof typeof PERMISSIONS]),
//       canApprove: can(PERMISSIONS[`APPROVAL_${entityUpper}` as keyof typeof PERMISSIONS]),
//       canRead:
//         can(PERMISSIONS[`READ_${entityUpper}` as keyof typeof PERMISSIONS]) ||
//         can(PERMISSIONS[`READ_ALL_${entityUpper}` as keyof typeof PERMISSIONS]),
//     };
//   }, [can, entity]);

//   return { ...mapping, can, loading, userId, role };
// }

export function useEntityPermission(entity: EntityKey, overrideRole?: Role) {
  const { can, loading, userId, role: roleStr } = usePermission();

  const effectiveRole = overrideRole || (Object.values(Role).includes(roleStr as Role) ? (roleStr as Role) : null);

  const mapping = useMemo(() => {
    const entityUpper = entity.toUpperCase();

    const check = (permKey: keyof typeof PERMISSIONS) => can(PERMISSIONS[permKey]);

    return {
      canCreate: check(`CREATE_${entityUpper}` as keyof typeof PERMISSIONS),
      canEdit:
        check(`UPDATE_${entityUpper}` as keyof typeof PERMISSIONS) ||
        check(`UPDATE_${entityUpper}_PRIMARY_IMAGE` as keyof typeof PERMISSIONS),
      canDelete: check(`DELETE_${entityUpper}` as keyof typeof PERMISSIONS),
      canApprove: check(`APPROVAL_${entityUpper}` as keyof typeof PERMISSIONS),
      canRead:
        check(`READ_${entityUpper}` as keyof typeof PERMISSIONS) ||
        check(`READ_ALL_${entityUpper}` as keyof typeof PERMISSIONS),
    };
  }, [can, entity]);

  return { ...mapping, can, loading, userId, role: effectiveRole };
}

