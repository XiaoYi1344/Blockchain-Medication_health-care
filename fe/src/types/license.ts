// types/v6/license.ts
export interface LicenseV6 {
  _id: string;
  name: string;
  companyId: string;
  licenseId: string;
  docHash: string;
  txHash: string;
  expiryDate: string; // yyyy-mm-dd
  images: File[];
  type: 'business_license' | 'GMP_certificate' | 'GDP_certificate' | 'drug_license';
  status: 'draft' | 'active' | 'expired' | 'revoked';
}

export interface LicenseOnChain {
  id: string;
  name: string;
  companyId: string;
  licenseId: string;
  docHash: string;
  images: string[];      // rỗng nếu không muốn gửi ảnh
  expiryDate: number;    // timestamp giây
  licenseType: string;
  status: number;        // 0=draft, 1=active, 2=expired, 3=revoked
}

export interface CreateLicensePayloadV6 {
  name: string;
  expiryDate: string;
  type: 'business_license' | 'GMP_certificate' | 'GDP_certificate' | 'drug_license';
  images: File[];
}

export interface RawContractLicense {
  id: string;
  name: string;
  companyId: string;
  licenseId: string;
  docHash: string;
  images: File;
  expiryDate: bigint;
  licenseType: string;
  status: number; // 0 unknown, 1 active, 2 expired, 3 revoked
  createdAt: bigint;
  updatedAt: bigint;
}