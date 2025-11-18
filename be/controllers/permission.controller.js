const { permissionService } = require('../services/index');

const getAllPermission = async (req, res, next) => {
  try {
    const result = await permissionService.handleGetAllPermission();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllPermissionByType = async (req, res, next) => {
  try {
    const { type } = req.body
    const result = await permissionService.handleGetAllPermissionByType(type);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllPermissionByRole = async (req, res, next) => {
  try {
    const { roleId } = req.params
    const result = await permissionService.handleGetAllPermissionByRole(roleId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllPermissionByUser = async (req, res, next) => {
  try {
    const { userId } = req.params
    const result = await permissionService.handleGetAllPermissionByUser(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deletePermission = async (req, res, next) => {
  try {
    const { permissionId } = req.params;
    const result = await permissionService.handleDeletePermission(req.user.id, req.context, permissionId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { name = null, displayName = null, type = null } = req.body;
    const result = await permissionService.handleCreate(req.user.id, req.context, name, displayName, type)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const update = async (req, res, next) => {
  try {
    const { id, ...data } = req.body;

    const result = await permissionService.handleUpdateData(req.user.id, req.context, id, data)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllPermission,
  getAllPermissionByType,
  getAllPermissionByRole,
  getAllPermissionByUser,
  deletePermission,
  create,
  update
}