const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    unique: true
  },
  displayName: {
    type: String,
    required: [true, 'Display Name is required'],
    unique: true
  },
  type: {
    type: [String],
    enum: ['permit', 'manufacturer', 'distributor', 'hospital', 'pharmacy', 'guest'],
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Permission', permissionSchema);
