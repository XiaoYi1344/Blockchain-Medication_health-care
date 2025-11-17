// src/config/permissionConfig.ts

export const PERMISSIONS = {
  READ_PERMISSION: "read-permission",
  UPDATE_ROLE: "update-role",
  CREATE_ROLE_COMPANY: "create-role-company",
  READ_ROLE: "read-role",
  DELETE_ROLE: "delete-role",
  ASSIGN_USER_PERMISSION: "assign-user-permission",

  READ_COMPANY: "read-company",
  UPDATE_COMPANY: "update-company",

  READ_LICENSE: "read-license",
  CREATE_LICENSE: "create-license",

  READ_ACCOUNT_STAFF: "read-account-staff",
  CREATE_ACCOUNT: "create-account",
  STOP_ACCOUNT: "stop-account",
  DELETE_ACCOUNT: "delete-account",

  CREATE_CATEGORY: "create-category",
  UPDATE_CATEGORY: "update-category",
  DELETE_CATEGORY: "delete-category",
  APPROVAL_CATEGORY: "approval-category",

  CREATE_PRODUCT: "create-product",
  UPDATE_PRODUCT: "update-product",
  UPDATE_PRODUCT_PRIMARY_IMAGE: "update-product-primary-image",
  DELETE_PRODUCT: "delete-product",
  APPROVAL_PRODUCT: "approval-product",

  CREATE_BATCH: "create-batch",
  UPDATE_BATCH: "update-batch",
  APPROVAL_BATCH: "approval-batch",
  UPDATE_STATE_BATCH: "update-state-batch",
  DELETE_BATCH: "delete-batch",
  READ_BATCH: "read-batch",

  CREATE_LOCATION: "create-location",
  UPDATE_LOCATION: "update-location",
  READ_ALL_LOCATION: "read-all-location",

  CREATE_INVENTORY: "create-inventory",
  READ_ALL_INVENTORY: "read-all-inventory",
  UPDATE_INVENTORY: "update-inventory",
  EXPORT_INVENTORY: "export-inventory",
  READ_INVENTORY_HISTORY: "read-inventory-history",

  READ_ORDER: "read-order",
  UPDATE_ORDER: "update-order",

  CREATE_SHIPMENT: "create-shipment",
  READ_ALL_SHIPMENT: "read-all-shipment",
  READ_SHIPMENT: "read-shipment",
  UPDATE_SHIPMENT: "update-shipment",
  STOP_SHIPMENT: "stop-shipment", 
  UPDATE_RECEIVING_SHIMENT: "update-receiving-shipment"
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
export type PermissionValue = (typeof PERMISSIONS)[PermissionKey];
