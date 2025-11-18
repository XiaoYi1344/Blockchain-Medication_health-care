const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   fullName: {
      type: String,
      trim: true,
   },
   email: {
      type: String,
      match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Only Gmail addresses are allowed'],
      lowercase: true,
      trim: true,
      sparse: true,
      unique: true
   },
   password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
   },
   phone: {
      type: String,
      match: [/^[0-9]{9,11}$/, 'Phone must be 9–11 digits']
   },
   userName: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      unique: true
   },
   dob: {
      type: String,
   },
   address: {
      type: String,
   },
   avatar: {
      type: String,
      default: null,
   },
   gender: {
      type: String,
      enum: ['male','female','other'],
      default: 'other',
   },
   nationality: {
      type: String,
   },
   companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
   },
   isActive: {
      type: Boolean,
      default: true,
      select: false,
   },
   isEmailVerify: {
      type: Boolean,
      default: false,
      select: false,
   }
}, {
   timestamps: true,
   // Transform to exclude password by default (similar to Sequelize defaultScope)
   toJSON: {
      transform: function (doc, ret) {
         delete ret.password;
         return ret;
      }
   },
   toObject: {
      transform: function (doc, ret) {
         delete ret.password;
         return ret;
      }
   }
});


module.exports = mongoose.model('User', userSchema);