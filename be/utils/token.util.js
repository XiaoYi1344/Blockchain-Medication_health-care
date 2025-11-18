const jwt = require('jsonwebtoken')
const db = require("../models")
const createError = require('http-errors')
const ms = require('ms');
const { default: mongoose } = require("mongoose");

const createToken = async (user) => {
   const { permissionService, roleService } = require('../services/index')

   const [roles, permissions] = await Promise.all([
      roleService.getAllRoleByUserId(user._id),
      permissionService.getPermissionByUser(user._id)
   ]);

   const roleIds = roles.map(r => r.roleId || r._id);

   let data = { id: user._id, roleIds, permissions };
   if (user.companyId) {
      data.companyId = user.companyId;
   }

   const accessToken = jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
   });
   return accessToken;
};

const createRefreshToken = async (data) => {
   const refreshToken = jwt.sign(data, process.env.JWT_SECRET_REFRESH, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE
   });

   const expirationMs = ms(process.env.JWT_REFRESH_EXPIRE);

   await db.Token.create({
      token: refreshToken,
      userId: data.id,
      expirationTime: new Date(Date.now() + expirationMs),
      isUsed: false,
      type: 'login'
   });
   return refreshToken
}

const deleteRefreshToken = async (refreshToken = null) => {
   const result = await db.Token.deleteOne({ token: refreshToken });
   return result.deletedCount
}

const createOtp = async (type, again, userId) => {
   let resendCount = 0
   if (again) {
      resendCount = await checkAndDeleteOtp(type, userId)
   }
   const otp = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
   await db.Token.create({
      token: otp,
      userId: userId,
      expirationTime: new Date(Date.now() + 10 * 60 * 1000),
      isUsed: false,
      type: type,
      resendCount: resendCount
   });
   return otp
}

const checkAndDeleteOtp = async (type, userId) => {
   const authenticationService = require('../services/authentication.service')

   const otpCount = await findOtp(userId, type)
   if (otpCount.resendCount >= 3) {
      await authenticationService.handleStopVerifyOtp(findOtp.userId, findOtp.type)
      throw createError.TooManyRequests('E4')
   } else {
      if (Date.now() < otpCount.updatedAt.getTime() + 15 * 1000) {
         throw createError.TooManyRequests('E2')
      } else {
         otpCount.resendCount++;
      }
   }

   await deleteOtp(type, userId)
   return otpCount.resendCount
}

const findOtp = async (data, type = '') => {
   let where = {};

   if (mongoose.Types.ObjectId.isValid(data)) {
      where.userId = data;
   } else {
      where.token = data;
   }

   if (type) where.type = type;

   const token = await db.Token.findOne(where);
   return token ? token.toObject() : false;
};

const updateOtp = async (otp, data) => {
   try {
      await db.Token.findOneAndUpdate({ token: otp }, data);
   } catch (error) {
      throw error
   }
}

const incrementOtp = async (userId, type) => {
   await db.Token.findOneAndUpdate(
      { userId, type },
      { $inc: { otpAttempts: 1 } }
   );
}

const deleteOtp = async (type, userId) => {
   await db.Token.deleteMany({ userId, type });
}

const checkRefreshToken = async (token) => {
   const refreshToken = await db.Token.findOne({ token: token })
   if (refreshToken) {
      return true
   } else return false
}

const deleteTokenById = async (userId) => {
   await db.Token.deleteMany({ userId: userId });
}

module.exports = {
   createToken,
   createRefreshToken,
   deleteRefreshToken,
   checkRefreshToken,
   createOtp,
   deleteOtp,
   findOtp,
   incrementOtp,
   updateOtp,
   deleteTokenById
}