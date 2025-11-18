const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  newName: {
    type: String,
    trim: true,
    default: ''
  },
  name: {
    type: String,
    trim: true,
  },
  companyCode: {
    type: String
  },
  type: {
    type: String,
    enum: ['manufacturer', 'distributor', 'pharmacy', 'hospital'],
    required: [true, 'Type is required'],
    default: 'manufacturer'
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  phone: {
    type: String,
    match: [/^[0-9]{9,11}$/, 'Phone must be 9–11 digits'],
  },
  images: {
    type: [String],
    default: []
  },
  isActive: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'reject'],
    default: 'approved'
  }
}, {
  timestamps: true,
});


module.exports = mongoose.model('Company', companySchema);