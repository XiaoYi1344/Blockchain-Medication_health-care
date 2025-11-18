const { authenticationService } = require('../services');
const { handleSuccess } = require("../utils/index");

const login = async (req, res, next) => {
  try {
    const { email = null, password = null } = req.body || {}
    const { accessToken, refreshToken, userId, roles } = await authenticationService.handleLogin(email, password, req.context)

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(handleSuccess("Login successfully", { accessToken, userId, roles }));
  } catch (error) {
    next(error)
  }
};

const register = async (req, res, next) => {
  try {
    const { email = null, password, phone = null, userName, dob, roleIds = [], companyId = '' } = req.body
    const result = await authenticationService.handleRegister(req.context, email, password, phone, userName, dob, roleIds, companyId)
    return res.status(200).json(result);
  } catch (error) {
    next(error)
  }
};

const verifyAccount = async (req, res, next) => {
  try {
    const { otp, email, type, newEmail = null } = req.body
    let result = await authenticationService.handleVerifyAccount(req.context, otp, email, type, newEmail)
    return res.status(200).json(result);
  } catch (error) {
    next(error)
  }
}

const againSendOtp = async (req, res, next) => {
  try {
    const { email } = req.body
    let result = await authenticationService.handleAgainSendOtp(email)
    return res.status(200).json(result);
  } catch (error) {
    next(error)
  }
}

const stopVerifyOtp = async (req, res, next) => {
  try {
    const { email, type } = req.body
    let result = await authenticationService.handleStopVerifyOtp(email, type)
    return res.status(200).json(result);
  } catch (error) {
    next(error)
  }
}

const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    let result = await authenticationService.handleRefreshAccessToken(refreshToken)
    return res.status(200).json(result);
  } catch (error) {
    next(error)
  }
}

const logOut = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken
    const { id } = req.user
    let result = await authenticationService.handleLogOut(req.context, refreshToken, id)
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.status(200).json(result);
  } catch (error) {
    next(error)
  }
}

module.exports = {
  login,
  register,
  verifyAccount,
  againSendOtp,
  stopVerifyOtp,
  refreshAccessToken,
  logOut
}