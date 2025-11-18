const mongoose = require('mongoose');

const inventoryHistorySchema = new mongoose.Schema({
  inventoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: [true, 'Inventory ID is required']
  },
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
  type: {
    type: String,
    enum: ['import', 'export', 'transfer', 'adjustment'],
    required: [true, 'Type is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required']
  },
  uom: {
    type: String
  },
  reason: {
    type: String
  },
  actorUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  relatedCompanyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  relatedShipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shipment'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('InventoryHistory', inventoryHistorySchema);