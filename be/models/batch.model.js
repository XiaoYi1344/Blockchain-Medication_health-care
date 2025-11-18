const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  batchCode: {
    type: String,
    required: true,
    unique: true
  },
  productCode: {
    type: String,
    required: true,
  },
  ownerCompanyId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  }],
  manufacturerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  images: {
    type: [String]
  },
  initialQuantity: {
    type: Number,
    default: 0
  },
  expectedQuantity: {
    type: Number,
    default: 0
  },
  state: {
    type: String,
    enum: ['DRAFT', 'APPROVAL', 'IN_PRODUCTION', 'IN_STOCK', 'SOLD_OUT', 'RECALL', 'RECALL_PENDING'],
    default: 'DRAFT'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  txHash: {
    type: String
  },
  manufactureDate: {
    type: Date
  },
  EXP: {
    type: Date
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Batch', batchSchema);