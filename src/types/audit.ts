// src/types/audit.ts
export interface CategoryAuditLog {
  categoryId: string;
  id: string;
  action: string;
  user: string;
  createdAt: string;
}

export interface DrugAuditLog {
  drugId: string;
  id: string;
  action: string;
  user: string;
  createdAt: string;
}
