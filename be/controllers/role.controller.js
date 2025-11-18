const { roleService } = require('../services');

const getAllRoleAdmin = async (req, res, next) => {
  try {
    const result = await roleService.handleGetAllRoleAdmin();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllRoleByCompany = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const result = await roleService.handleGetAllRoleByCompany(companyId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const { roleId } = req.params;
    const result = await roleService.handleDeleteRole(req.user.id, req.context, roleId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { permissionIds = [], ...data } = req.body;
    const result = await roleService.handleCreate(req.user.id, req.context, data, permissionIds)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const update = async (req, res, next) => {
  try {
    const { roleId, permissionIds = [], ...data } = req.body;
    const result = await roleService.handleUpdateData(req.user.id, req.context, roleId, data, null, permissionIds)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const createCompanyRole = async (req, res, next) => {
  try {
    const { permissionIds = [], ...data } = req.body;
    data.companyId = req.user.companyId
    const result = await roleService.handleCreate(req.user.id, req.context, data, permissionIds)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const updateCompanyRole = async (req, res, next) => {
  try {
    const { roleId, permissionIds = [], ...data } = req.body;
    const { companyId = null } = req.user

    const result = await roleService.handleUpdateData(req.user.id, req.context, roleId, data, companyId, permissionIds)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllRoleAdmin,
  getAllRoleByCompany,
  deleteRole,
  create,
  update,
  createCompanyRole,
  updateCompanyRole
}