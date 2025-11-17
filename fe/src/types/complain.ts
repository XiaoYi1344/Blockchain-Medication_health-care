export type Role = 'producer' | 'distributor';

export interface User {
  id: number;
  userName: string;
  fullName?: string;
  email: string;
  companyId?: string;
  role: Role;
}

export interface Complain {
  id: number;
  complainId: number; // user.id người tạo
  complainName: string;
  fromCompanyId?: string;
  relatedEntityType: string;
  relatedEntityId: number;
  title: string;
  description: string;
  attachments: string[];
  status: 'pending' | 'in_review' | 'resolved' | 'rejected' | 'closed';
  typeError: string;
  toCompanyId?: string;
  assignedTo?: number;
  resolution?: string;
  resolvedAt?: string;
  rejectionReason?: string;
}

export interface ComplainHistory {
  id: number;
  complainId: number;
  fromCompanyId?: number;
  toCompanyId?: number;
  assignedTo?: number;
  status: 'pending' | 'in_review' | 'resolved' | 'rejected' | 'closed';
}

export interface UpdateComplainRequest {
  complainId: number;
  resolution: string;
  status: 'resolved' | 'in_review';
  assignedTo?: number;
}

export interface GetComplainsRequest {
  status: 'pending' | 'in_review' | 'resolved' | 'rejected' | 'closed';
}

export type ComplainStatus =
  | 'pending'
  | 'in_review'
  | 'resolved'
  | 'rejected'
  | 'closed'
  | 'processing';

  export type ComplainPriority = 'low' | 'normal' | 'high' | 'urgent';