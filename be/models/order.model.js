const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  fromCompanyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'From company ID is required']
  },
  toCompanyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'To company ID is required']
  },
  orderCode: {
    type: String,
    required: [true, 'Order code is required']
  },
  productCode: {
    type: String,
    required: [true, 'Product code is required']
  },
  batch: [{
    batchCode: String,
    reservedQuantity: Number, //số lượng đặt trước
    quantity: Number, //số lượng mỗi lô
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location'
    },
    isExport: {
      type: Boolean,
      default: false
    }
  }],
  quantity: {
    type: Number,
    required: [true, 'Quantity is required']
  },
  status: {
    type: String,
    enum: ['unreceived', 'order_received', 'processing', 'delivering', 'delivered', 'goods_received', 'canceled', 'rejected'],
    default: 'unreceived'
  },
  completeDate: {
    type: Date
  },
  txHash: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  receivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);