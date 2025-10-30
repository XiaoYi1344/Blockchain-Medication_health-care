export interface Batch {
  id: string;
  batchCode: string;
  productCode: string;
  manufacturerId?: string;
  initialQuantity?: number;
  expectedQuantity?: number;
  state: 'DRAFT' | 'APPROVAL' | 'IN_PRODUCTION' | 'IN_STOCK' | 'SOLD_OUT' | 'RECALL';
  txHash: string;
  images?: string[];
  estimatedDate?: string;
  EXP?: string;
}

export interface BatchCreatePayload {
  productCode: string;
  images?: string[];
  expectedQuantity: number;
  txHash: string;
  estimatedDate: string; // yyyy-mm-dd
  EXP: string;
}

export interface BatchUpdatePayload {
  batchCode: string;
  txHash: string;
  expectedQuantity: number;
  images?: string[];
  deleteImages?: string[];
}

export interface BatchStateUpdatePayload {
  batchCode: string;
  state: 'DRAFT' | 'APPROVAL' | 'IN_PRODUCTION' | 'IN_STOCK' | 'SOLD_OUT' | 'RECALL';
}

export interface BatchApprovalPayload {
  batchCode: string;
  isActive: boolean;
}
