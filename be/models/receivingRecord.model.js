const mongoose = require('mongoose');

const receivingRecordSchema = new mongoose.Schema({
  orderCode: {
    type: String,
    required: [true, 'orderCode is required']
  },
  shipCode: {
    type: String,
    required: [true, 'shipCode is required']
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'companyId is required']
  },
  expectedDate: {
    type: Date,
    required: [true, 'expectedDate is required']
  },
  receivingDate: Date,
  expectedQuantity: [{
    batchCode: String,
    quantity: Number
  }],
  receivedQuantity: [{
    batchCode: String,
    quantity: Number
  }],
  remarks: {
    type: String,
    default: 'No data.'
  },
  txHash: {
    type: String,
    default: null
  },
  images: [{
    public_id: String,
    cid: String,
    hash: String
  }],
  status: {
    type: String,
    enum: ['processing', 'completed', 'recall'],
    default: 'processing'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ReceivingRecord', receivingRecordSchema);