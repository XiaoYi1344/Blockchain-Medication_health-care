const createError = require('http-errors');
const db = require("../models");

const authorizeAccess = (permissions = []) => {
  return async (req, res, next) => {
    try {
      if (!Array.isArray(permissions)) {
        throw createError.BadRequest('A2');
      }

      if (!permissions || permissions.length === 0) {
        return next();
      }

      let allPermissions = new Set(req.user?.permissions?.map(String) || []);

      const userRoles = req.user?.roleIds || [];
      if (userRoles.length) {
        const roles = await db.PermissionRole.find({ roleId: { $in: userRoles } })
          .populate('permissionId', 'name')
          .lean();

        roles
          .map(r => r.permissionId?.name)
          .filter(Boolean)
          .forEach(name => allPermissions.add(String(name)));
      }

      // Nếu route có yêu cầu permission
      const hasPermission = permissions.every(p => allPermissions.has(String(p)));
      if (!hasPermission) {
        throw createError.Forbidden('C1');
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = authorizeAccess;