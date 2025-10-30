// types/v6/company.ts
export interface CompanyV6 {
  id: number;
  name: string;
  newName?: string;
  companyCode?: string;
  type: 'manufacturer' | 'distributor' | 'pharmacy' | 'hospital';
  location?: string;
  images?: string[];
  phone?: string;
  nationality?: string;
  status: 'pending' | 'active' | 'inactive';
  isActive: boolean;
}

export interface UpdateCompanyPayloadV6 {
  name?: string;
  location?: string;
  images?: string[];
  deleteImages?: string[];
  nationality?: string;
}

export interface GetCompanyQueryV6 {
  companyId?: string;
}
