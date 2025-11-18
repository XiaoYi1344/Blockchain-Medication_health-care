const mongoose = require('mongoose');

const permissionRoleSchema = new mongoose.Schema({
  permissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission',
    required: true
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PermissionRole', permissionRoleSchema);
