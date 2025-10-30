export type Route =
  | "oral"
  | "injection"
  | "IV infusion"
  | "inhalation"
  | "rectal insertion";

export type ProductType = "domestic" | "abroad";
export type ProductStatus = "draft" | "sent" | "active" | "inactive";

export interface ActiveIngredient {
  name: string;
  strength: string;
  route?: Route;
}

export interface StorageCondition {
  temperature?: string;
  humidity?: string;
  type?: ProductType;
}

export interface BackendProduct {
  _id?: string;
  productId?: string;
  name: string;
  description?: string;
  productCode?: string;
  companyCode?: string;
  categoryIds?: string[];
  uom?: string;
  uomQuantity?: number;
  imagePrimary?: File[]; // optional là đủ
  images?: File[]; // nếu nhiều ảnh
  txHash?: string;
  userId?: string;
  isActive?: ProductStatus;
  gtin?: string;
  activeIngredient?: ActiveIngredient[];
  storageConditions?: StorageCondition[];
  onChain?: boolean;
}

export interface RawContractProduct {
  name: string;
  uom: string;
  uomQuantity: bigint;
  companyCode: string;
  productType: string;
  gtin: string;
  origin: string;
  description: string;
}

export interface ContractProduct {
  productCode: string;
  gtin: string;
  companyCode: string;
  name: string;
  uom: string;
  description: string;
  activeIngredient: ActiveIngredient[];
  route?: Route;
  storageConditions?: StorageCondition[];
  type: ProductType;
  txHash: string;
}

export interface DraftProductRow<T = Record<string, unknown>> {
  id: number;
  userid: string;
  created_at: string;
  updated_at?: string | null;
  name: string;
  data: T;
}

export interface DrugFilterValues {
  q?: string;
  name?: string;
  companyCode?: string;
  gtin?: string;
  productType?: ProductType;
  category?: string;
  status?: ProductStatus | "pending" | "approved"; // đồng bộ với BackendProduct
}
