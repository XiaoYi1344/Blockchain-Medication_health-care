const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required']
  },
  address: {
    type: String
  },
  type: {
    type: String,
    enum: ['warehouse', 'store', 'office'],
    required: [true, 'Type is required']
  },
  preservationCapability: {
    type: String,
    enum: ['COOL', 'FREEZE', 'NORMAL', 'ROOM_TEMP'],
    required: [true, 'Preservation capability is required']
  },
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maximum: {
    type: Number,
    required: [true, 'Maximum capacity is required'],
  },
  currentQuantity: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Location', locationSchema);