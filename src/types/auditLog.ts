// src/types/auditLog.ts
export interface AuditLog {
  id: number;             // primary key
  actorUserId: number;    // người thực hiện hành động
  action: string;         // loại hành động: CREATE, UPDATE, DELETE, LOGIN, LOGOUT, ...
  entityType: string;     // loại đối tượng tác động: User, Batch, Order, Product, ...
  entityId: number;       // id của đối tượng tác động
  oldValue?: string;      // dữ liệu trước khi thay đổi (có thể null/undefined)
  newValue?: string;      // dữ liệu sau khi thay đổi (có thể null/undefined)
  ipAddress?: string;     // địa chỉ IP của client
  userAgent?: string;     // thông tin trình duyệt/app
  createdAt?: string;     // timestamp (nếu bạn muốn lưu thời gian hành động)
}
