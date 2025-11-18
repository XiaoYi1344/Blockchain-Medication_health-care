const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
   token: {
      type: String,
      required: true,
      trim: true
   },
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   expirationTime: {
      type: Date,
      required: true
   },
   isUsed: {
      type: Boolean,
      default: false
   },
   type: {
      type: String,
      required: true,
      enum: ['login', 'verify-email', 'verify-email-again', 'forgot-password']
   },
   otpAttempts: {
      type: Number,
      default: 0
   },
   resendCount: {
      type: Number,
      default: 0
   }
}, {
   timestamps: true
});

module.exports = mongoose.model('Token', tokenSchema);
