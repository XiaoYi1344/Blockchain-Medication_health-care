const mongoose = require('mongoose');

const auditLogchema = new mongoose.Schema({
  actorUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  action: {
    type: String,
    enum: ['create', 'update', 'delete', 'stop', 'assign', 'login', 'logout', 'password-change', 'forgot-password', 'email-verify', 'approval', 'revoked', 'received', 'reject', 'status-change', 'export', 'import', 'transfer', 'adjustment', 'verify'],
  },
  entityType: {
    type: String,
    enum: ['user', 'role', 'permission', 'company', 'license', 'product', 'order', 'location', 'shipment', 'category', 'inventory', 'brand', 'supplier', 'customer', 'login', 'email', 'password', 'batch', 'notification', 'receivingRecord'],
  },
  entityId: {
    type: String,
  },
  oldValue: {
    type: String
  },
  newValue: {
    type: String
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AuditLog', auditLogchema);
