const { userService } = require('../services');
const cloudinary = require('../utils/cloudinary');
const handleSuccess = require('../utils/success.util');
const createError = require("http-errors");

const getAllUsers = async (req, res, next) => {
  try {
    const { type = 'guest' } = req.body
    const result = await userService.handleGetAllUsers(type)
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllAdmin = async (req, res, next) => {
  try {
    const result = await userService.handleGetAllAdmin()
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllStaffs = async (req, res, next) => {
  try {
    let { companyId = null } = req.query || {}
    if (!companyId) companyId = req.user?.companyId
    const result = await userService.handleGetAllStaffs(companyId)
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    let { id } = req.query || {}
    if (!id) id = req.user?.id
    const result = await userService.handleGetOneUser(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const companyId = req.body.companyId || req.user?.companyId || null
    const { email = null, password, phone = null, userName, dob, roleIds = [], permissionIds = [] } = req.body || {}
    if(!companyId) throw createError.BadRequest('B20')
    const result = await userService.handleCreateUser(req.user.id, req.context, email, password, phone, userName, dob, companyId, roleIds, permissionIds, true)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.user
    if (req.body.isActive) delete req.body.isActive;
    if (req.body.password) delete req.body.password;
    if (req.body.isEmailVerify) delete req.body.isEmailVerify;
    const { email = null, ...data } = req.body
    if (req.file) {
      data.avatar = await cloudinary.createOneImg(req.file);
    }

    const result = await userService.handleUpdateUser(id, email, data)
    res.status(200).json(result);
  } catch (error) {
    next(error)
  }
}

const updateStatusUser = async (req, res, next) => {
  try {
    const { userId, isActive } = req.body
    const result = await userService.handleUpdateIsActive(userId, isActive)
    res.status(200).json(result);
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params
    const result = await userService.handleDeleteUser(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error)
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const { handleLogOut } = require('../services/authentication.service')
    const { id } = req.user
    const refreshToken = req.cookies.refreshToken

    await userService.handleUpdateUser(id, null, { isActive: false });
    await handleLogOut(refreshToken, id)
    res.status(200).json(handleSuccess("Delete account successfully"));
  } catch (error) {
    next(error)
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    let result = await userService.handleForgotPassword(email)
    return res.status(200).json(result);
  } catch (error) {
    next(error)
  }
};

const newPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body
    let result = await userService.handleNewPassword(email, newPassword)
    return res.status(200).json(result);
  } catch (error) {
    next(error)
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { newPassword, oldPassword } = req.body
    let result = await userService.handleChangePassword(req.user.id, newPassword, oldPassword)
    return res.status(200).json(result);
  } catch (error) {
    next(error)
  }
};

module.exports = {
  forgotPassword,
  newPassword,
  getAllUsers,
  getAllAdmin,
  getAllStaffs,
  createUser,
  updateUser,
  deleteAccount,
  deleteUser,
  getUser,
  changePassword,
  updateStatusUser,
}