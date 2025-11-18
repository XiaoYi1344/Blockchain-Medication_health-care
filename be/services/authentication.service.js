"use strict";
const { tokenHandle, bcyptHandle, handleSuccess, auditLogHandle } = require("../utils/index");
const createError = require("http-errors");
const userService = require("../services/user.service");
const jwt = require('jsonwebtoken')
const db = require("../models");
const ROLE_ADMIN = process.env.ROLE_ADMIN?.split(',') || [];
const ID_ROLE_MANUFACTURER = process.env.ID_ROLE_MANUFACTURER?.split(',') || [];
const ID_ROLE_HOSPITAL = process.env.ID_ROLE_HOSPITAL?.split(',') || [];

// Gộp tất cả role bị cấm
const forbiddenRoleIds = [
  ...ROLE_ADMIN,
  ...ID_ROLE_MANUFACTURER,
  ...ID_ROLE_HOSPITAL
];

const handleLogin = async (email, password, context) => {
  try {
    const { userService, roleService } = require('./index')
    if (!email || !password) {
      throw createError.BadRequest("B4");
    }

    const user = await userService.getOneUserByEmail(email, '+password +isEmailVerify +isActive');
    if (!user) {
      throw createError.NotFound("F2");
    }
    if (!user.isEmailVerify) {
      throw createError.BadRequest("D1");
    }
    if (!user.isActive) {
      throw createError.BadRequest("D3");
    }

    const isMatch = await bcyptHandle.comparePassword(password, user.password);
    if (!isMatch) {
      throw createError.Unauthorized("D2");
    }

    const [accessToken, refreshToken, roles] = await Promise.all([
      tokenHandle.createToken(user, '15m'),
      tokenHandle.createRefreshToken({ id: user.id }, '7d'),
      roleService.handleGetAllRoleByUserId(user.id)
    ]);

    const { ipAddress, userAgent } = context
    auditLogHandle.createLog(user.id, 'login', 'user', user.id, null, null, ipAddress, userAgent)

    return {
      accessToken,
      refreshToken,
      userId: user.id,
      roles: roles.data
    };

  } catch (error) {
    throw error;
  }
};

const handleRegister = async (context, email, password, phone, userName, dob, roleIds = [], companyId = '') => {
  try {
    const { userService } = require('./index')
    if ((!email && !phone) || !userName || !password) {
      throw createError.NotFound("B2 B3 B4")
    }
    if (roleIds && roleIds.length > 0) {
      const hasForbidden = roleIds.some(id => forbiddenRoleIds.includes(id.toString()));
      if (hasForbidden) {
        throw createError.BadRequest('F85');
      }
    }
    const newUser = (await userService.handleCreateUser(null, context, email, password, phone, userName, dob, companyId, roleIds)).data

    await handleSendOtpToEmail(newUser.email, newUser.id, 'Verify your account.', 'verify-email')
    return handleSuccess("Register and send otp successfully", { type: 'verify-email' });
  } catch (error) {
    throw error;
  }
};

const handleSendOtpToEmail = async (email, userId, subject, type, again = false) => {
  try {
    const createEmail = require('../utils/email.util');
    const otp = await tokenHandle.createOtp(type, again, userId)
    await createEmail({
      email,
      subject,
      text: `Your OTP: ${otp}`
    })
    return handleSuccess("Send otp successfully");
  } catch (error) {
    throw error
  }
}

const handleVerifyAccount = async (context, otp, email, type, newEmail = null) => {
  try {
    const { userService } = require('./index')
    const user = await userService.getOneUserByEmail(email, '+isEmailVerify')
    const findOtp = await tokenHandle.findOtp(user.id, type)
    if (!findOtp) {
      throw createError.NotFound("D3 D4")
    }

    if (otp !== findOtp.token) await countInvalidOTPTries(findOtp)
    const { ipAddress, userAgent } = context

    if (findOtp.type === 'forgot-password') {
      await tokenHandle.updateOtp(otp, { isUsed: true })
    } else if (findOtp.type === 'verify-email-again') {
      await userService.handleUpdateUser(user.id, newEmail);

      await auditLogHandle.createLog(user.id, 'email-verify', 'user', user.id, email, newEmail, ipAddress, userAgent)
    } else if (findOtp.type === 'verify-email') {
      await userService.handleUpdateUser(findOtp.userId, null, { isEmailVerify: true });
      await tokenHandle.deleteOtp(findOtp.type, findOtp.userId)

      await auditLogHandle.createLog(user.id, 'email-verify', 'user', user.id, null, null, ipAddress, userAgent)
    }

    return handleSuccess('Verification Successful!')
  } catch (error) {
    throw error
  }
}

const countInvalidOTPTries = async (findOtp) => {
  try {
    if (findOtp.otpAttempts === 2) {
      if (findOtp.type === 'verify-email-again' || findOtp.type === 'forgot-password') {
        await tokenHandle.deleteOtp(findOtp.type, findOtp.userId)
        throw createError.TooManyRequests('E1')
      }
      if (findOtp.resendCount === 3 && findOtp.type === 'verify-email') {
        await handleStopVerifyOtp(findOtp.userId, findOtp.type)
        throw createError.TooManyRequests('E4')
      }

      if (Date.now() < findOtp.updatedAt.getTime() + 10 * 1000) {
        throw createError.TooManyRequests('E2');
      }

      if (Date.now() > findOtp.expirationTime) {
        throw createError.TooManyRequests('E3');
      }
    }
    await tokenHandle.incrementOtp(findOtp.userId, findOtp.type)
    throw createError.NotFound('D5 D3')
  } catch (error) {
    throw error
  }
}

const handleAgainSendOtp = async (email) => {
  try {
    if (!email) {
      throw createError.BadRequest("B4")
    }
    const user = await userService.getOneUserByEmail(email, '+isEmailVerify');

    const otp = await tokenHandle.findOtp(user.id, 'verify-email')
    if (!otp) {
      throw createError.NotFound("D3 D4")
    }

    await handleSendOtpToEmail(email, user.id, 'Verify your account.', 'verify-email', true)
    return handleSuccess("Send otp successfully", { type: 'verify-email' });
  } catch (error) {
    throw error
  }
}

const handleStopVerifyOtp = async (email, type) => {
  try {
    const existUser = await userService.getOneUserByEmail(email, '+isEmailVerify')
    if (!existUser || (existUser.isEmailVerify || existUser.isPhoneVerify)) {
      throw createError.BadRequest("F4")
    }

    if (type === 'verify-email-again' || type === 'forgot-password') {
      await tokenHandle.deleteOtp(type, existUser.id)
    } else {
      userService.handleDeleteUser(existUser.id)
    }
    return handleSuccess("Stop verify otp successfully");
  } catch (error) {
    throw error
  }
}

const handleRefreshAccessToken = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw createError.Unauthorized("D8");
    }
    const tokenData = await tokenHandle.findOtp(refreshToken, 'login');
    if (!tokenData) throw createError.Forbidden("D9");
    const user = await db.User.findById(tokenData.userId)

    try {
      jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
    } catch (err) {
      throw createError.Forbidden("F15");
    }
    const newAccessToken = await tokenHandle.createToken(user);

    return handleSuccess("Refresh accessToken successfully", { accessToken: newAccessToken });
  } catch (error) {
    throw error
  }
}

const handleLogOut = async (context, refreshToken, userId) => {
  try {
    const deleted = await tokenHandle.deleteRefreshToken(refreshToken)
    if (deleted === 0) {
      throw createError.NotFound("F3")
    }
    await tokenHandle.deleteTokenById(userId)
    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'logout', 'user', userId, null, null, ipAddress, userAgent)

    return handleSuccess("Log out successfully")
  } catch (error) {
    throw error
  }
}

module.exports = {
  handleLogin,
  handleRegister,
  handleVerifyAccount,
  handleAgainSendOtp,
  handleStopVerifyOtp,
  handleSendOtpToEmail,
  handleRefreshAccessToken,
  handleLogOut
}