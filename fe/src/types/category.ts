export interface Category {
  _id: string;
  name: string;
  description?: string;
  isActive?: boolean; // thêm để phân biệt trạng thái duyệt
  createdAt?: string;
  updatedAt?: string;
}


export interface CategoryCreatePayload {
  name: string;
  description?: string;
}

export interface CategoryUpdatePayload {
  categoryId: string;
  name: string;
  description?: string;
}

export interface CategoryAuditLog {
  categoryId: string;
  id: string;
  action: string;
  user: string;
  createdAt: string; // hoặc Date nếu parse
}



// export interface Product {
//   productCode: string;
//   companyCode: string;
//   categoryIds: string[];
//   imagePrimary: string;
//   images: string[];
//   status: string;
// }

// export interface ProductCreatePayload {
//   productCode: string;
//   categoryIds: string[];
//   image: File | string;
//   uom: string;
//   umo: string;
//   txHash: string;
// }

// export interface ProductUpdatePayload {
//   productId: string;
//   categoryIds: string[];
//   image?: File | string;
//   isActive?: boolean;
//   deleteImages?: string[];
// }
