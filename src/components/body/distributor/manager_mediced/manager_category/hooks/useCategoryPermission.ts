// import { Role } from "@/types/role";
// import { PermissionType } from "@/types/staff";
// import { categoryManagerConfig } from "../config/categoryManager";

// /**
//  * Check xem role có quyền với action không
//  */
// export function hasPermission(
//   role: Role,
//   permissions: PermissionType[],
//   action: keyof typeof categoryManagerConfig[Role]
// ) {
//   const requiredPerms = categoryManagerConfig[role][action];
//   if (!requiredPerms || requiredPerms.length === 0) return false;

//   return permissions.some((p) => requiredPerms.includes(p.name));
// }
