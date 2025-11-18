const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    default: null
  },
  title: {
    type: String,
    required: [true, 'Title ID is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  type: {
    type: String,
    enum: ['system', 'complaint', 'warehouse', 'order', 'shipment', 'license', 'other', 'company', 'request'],
    default: 'other'
  },
  relatedEntityType: {
    type: String,
    enum: ['order', 'shipment', 'license', 'complaint', 'inventory', 'other', 'company', 'location', 'batch'],
    default: 'other'
  },
  relatedEntityId: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);