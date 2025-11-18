const mongoose = require('mongoose');

const sellerCustomSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  status: {
    type: String,
    enum: ['connect', 'block'],
    default: 'connect'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SellerCustom', sellerCustomSchema);