const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productCode: {
    type: String
  },
  companyCode: {
    type: String,
    required: true
  },
  categoryIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: []
  }],
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: 'No data'
  },
  uom: {
    type: String,
    required: true
  },
  uomQuantity: {
    type: Number,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  imagePrimary: {
    type: String,
    default: null
  },
  txHash: {
    type: String
  },
  isActive: {
    type: String,
    enum: ['draft', 'sent', 'active', 'inactive'],
    default: 'draft'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gtin: {
    type: String,
    required: true, // bắt buộc có
    match: /^\d{8,20}$/,
    trim: true
  },
  activeIngredient: [{
    name: String,
    strength: String
  }],
  route: {
    type: String,
    enum: ['oral', 'injection', 'IV infusion', 'inhalation', 'rectal insertion'],
    default: 'oral'
  },
  storageConditions: [{
    temperature: String,
    humidity: String
  }],
  type: {
    type: String,
    enum: ['domestic', 'abroad'],
    default: 'domestic'
  },
  onChain: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
