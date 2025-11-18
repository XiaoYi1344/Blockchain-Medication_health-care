const { authorizationService } = require('../services');

const assignUserPermission = async (req, res, next) => {
  try {
    const { userId, permissionIds } = req.body
    const result = await authorizationService.handleAssignUserPermission(userId, req.context, permissionIds);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const assignUserRole = async (req, res, next) => {
  try {
    const { userId, roleIds } = req.body
    const result = await authorizationService.handleAssignUserRole(userId, req.context, roleIds);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const assignPermissionRole = async (req, res, next) => {
  try {
    const { roleId, permissionIds } = req.body
    const result = await authorizationService.handleAssignPermissionRole(req.context, roleId, permissionIds, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  assignUserRole,
  assignUserPermission,
  assignPermissionRole
}