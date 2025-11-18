const mongoose = require('mongoose');

const companyDocumentSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  licenseId: {
    type: String,
    required: [true, 'LicenseId is required'],
  },
  name: {
    type: String,
    require: true
  },
  expiryDate: {
    type: Date,
    required: [true, 'Password is required'],
  },
  images: [{
    public_id: String,
    cid: String,
    hash: String
  }],
  type: {
    type: String,
    enum: ["business_license", "GMP_certificate", "GDP_certificate"],
    required: [true, 'Type is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'expired', 'revoked'],
    default: 'pending'
  },
  txHash: {
    type: String
  }
}, {
  timestamps: true,
});


module.exports = mongoose.model('CompanyDocument', companyDocumentSchema);