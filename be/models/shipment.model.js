const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  shipCode: { type: String, required: true },
  fromCompanyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  toCompanyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },

  orderCode: { type: String, required: true },

  batches: [{
    batchCode: { type: String, required: true },
    quantity: { type: Number, required: true },
  }],

  departAt: Date,
  expectedDate: Date,
  receivingTime: Date,

  status: {
    type: String,
    enum: ['processing', 'delivering', 'delivered', 'goods_received', 'canceled', 'recall'],
    default: 'processing'
  },

  txHash: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
});

module.exports = mongoose.model('Shipment', shipmentSchema);