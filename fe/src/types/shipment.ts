// src/types/shipment.type.ts

// ================================
// Shipment Status
// ================================
export type ShipmentStatus =
  | "processing"
  | "delivering"
  | "delivered"
  | "goods_received"
  | "canceled";

// ================================
// Batch item
// ================================
export interface BatchItem {
  batchCode: string;
  quantity: number;
}

// ================================
// Shipment main interface
// ================================
export interface Shipment {
  _id: string;
  shipCode: string;
  relatedOrder?: string;
  fromCompanyId: string;
  toCompanyId: string;
  orderCode: string;
  batches: BatchItem[];
  departAt?: string;
  arriveEta?: string;
  expectedDate?: string;
  receivingTime?: string | null;
  txHash?: string;
  isActive?: boolean;
  status: ShipmentStatus;
  note?: string;
  images?: string[];

  /** ✅ Thêm 3 trường này để tránh lỗi TypeScript */
  vehiclePlateNumber?: string;
  driverName?: string;
  driverPhoneNumber?: string;
}


// ================================
// Request/Response cho BE
// ================================
export interface CreateShipmentRequest {
  orderCode: string;
  batches: BatchItem[];

  // Các trường tuỳ chọn (form của bạn gửi thêm) — thêm vào để TypeScript không báo lỗi
  note?: string;
  departAt?: string;
  expectedDate?: string;
  status?: ShipmentStatus;
  vehiclePlateNumber?: string;
  driverName?: string;
  driverPhoneNumber?: string;
}

export interface CreateShipmentResponse {
  _id: string;
  shipCode: string;
  fromCompanyId: string;
  toCompanyId?: string;
}

export interface UpdateShipmentRequest {
  shipmentId: string;
  note?: string;
  departAt?: string;
  // cho an toàn, giữ cả 2 tên (arriveEta cũ & expectedDate mới)
  arriveEta?: string;
  expectedDate?: string;
  status?: ShipmentStatus;

  // Có thể muốn cập nhật thông tin driver/vehicle khi update
  vehiclePlateNumber?: string;
  driverName?: string;
  driverPhoneNumber?: string;
}

// ================================
// Api Response generic
// ================================
export interface ApiResponse<T> {
  result?: T;
  message?: string;
  success?: boolean;
}

// ================================
// On-chain shipment
// ================================
export interface ShipmentOnChain {
  shipCode: string;
  fromCompanyId: string;
  toCompanyId: string;
  departAt: string;
  receivingTime?: string;
  // Blockchain có thể lưu nhiều batchCode => giữ là mảng
  batchCode: string[]; // mảng batchCode trên blockchain
}
