import { Batch } from "./batch";

// Loại kho
export type LocationType = "warehouse" | "store" | "vehicle";

// Khả năng bảo quản
export type preservationCapability = "COOL" | "FREEZE" | "NORMAL" | "ROOM_TEMP";

// Location interface
export interface Location {
  _id: string;
  name: string;
  description?: string;
  address: string;
  type: LocationType;
  preservationCapability: preservationCapability; // tương ứng preservationCapability trong DB
  maximum: number;
  currentQuantity?: number;
  isActive: boolean;
}

// API response
export interface LocationAPIResponse {
  _id: string;
  name: string;
  address?: string | null;
  type: LocationType;
  preservationCapability?: preservationCapability;
  maximum?: number;
  currentQuantity?: number;
  isActive: boolean;
}

// Payload tạo mới
export interface CreateLocationReq {
  name: string;
  description?: string;
  address: string;
  type: LocationType;
  preservationCapability: preservationCapability;
  maximum: number;
}

// Payload cập nhật
export interface UpdateLocationReq extends CreateLocationReq {
  locationId: string;
  isActive: boolean;
}

// Inventory
export type InventoryStatus = "active" | "inactive" | "danger";

export interface Inventory {
  inventoryId: string;
  locationId: string;
  locationName?: string;
  batchCode: string;
  productCode: string; // ✅ thêm dòng này
  productName?: string; // (tùy, nếu bạn cần hiển thị)
  currentQuantity: number;
  uom: "box";
  isActive: InventoryStatus;
}


// Tồn kho theo location
export interface InventoryLocation {
  locationId: string;
  locationName: string;
  inventories: Inventory[];
}

// Payload tạo inventory
export interface CreateInventoryReq {
  locationId: string;
  batchCode: string;
  currentQuantity: number;
  uom: "box";
}

// Payload cập nhật inventory
export interface UpdateInventoryReq {
  inventoryId: string;
  locationId?: string;
  quantity: number;
  reason: string;
}

// Payload xuất kho
export interface ExportInventoryReq {
  batchCode: string;
  locationId: string;
  quantity: number;
  reason: string;
  shipmentId: string;
}

// User cookie
export interface UserCookie {
  userId: string;
  accessToken: string;
  roleId: string;
  roleName: string;
}

// Batch with inventory
export interface BatchWithInventory extends Batch {
  locationId: string;
  currentQuantity: number;
  uom: "box";
  isActive?: boolean; 
}
