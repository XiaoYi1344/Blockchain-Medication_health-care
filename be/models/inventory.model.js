const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required']
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: [true, 'Location ID is required']
  },
  batchCode: {
    type: String,
    required: [true, 'Batch code is required']
  },
  currentQuantity: {
    type: Number,
    default: 0
  },
  reservedQuantity: {
    type: Number,
    default: 0
  },
  uom: {
    type: String
  },
  isActive: {
    type: String,
    enum: ['active', 'inactive', 'danger', 'recall'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Inventory', inventorySchema);