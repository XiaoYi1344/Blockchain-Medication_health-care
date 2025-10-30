// types/order.ts
export type OrderStatus =
  | 'unreceived'
  | 'order_received'
  | 'inproduction'
  | 'instock'
  | 'processing'
  | 'delivering'
  | 'delivered'
  | 'goods_received'
  | 'canceled'
  | 'rejected';

export interface Batch {
  batchCode: string;
  quantity: number;
  locationId?: string;
}

export interface Product {
  productCode: string;
  productQuantity: number;
  batch: Batch[];
}

export interface Order {
  id: number;
  toCompanyId: string;
  orderCode: string;
  products: Product[];
  status: OrderStatus;
  completeDate?: string;
  txHash?: string;
  createdBy?: string;
  receivedBy?: string;
  data?: {
    productCode: string;
    batch: {
      batchCode: string;
      quantity: number;
      locationId?: string;
    }[];
  }[];
}


// Blockchain
export interface BlockchainOrder {
  id: number;
  // fromCompanyId: string;
  toCompanyId: string;
  orderCode: string;
  batchCode: string[];
  quantity: number;
}

export interface ReceivingRecord {
  id: number;
  shipCode: string;
  shipmentId?: number;
  companyId: number;
  batchCode: string;
  expectedDate?: string;
  receivedDate?: string;
  expectedQuantity?: number;
  receivedQuantity?: number;
  remarks?: string;
  docHash?: string;
  signatureHash?: string;
  txHash?: string;
  recordedAt?: string;
}

// Request for updating order
export interface UpdateOrderRequest {
  orderCode: string;
  txHash?: string;
  status?: OrderStatus;
  data?: {
    productCode: string;
    batch: {
      batchCode: string;
      quantity: number;
    }[];
  }[];
}
