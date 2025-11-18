const db = require("../models");
const createError = require("http-errors");
const handleSuccess = require("../utils/success.util");
const auditLogHandle = require("../utils/auditLog.util");

// Thêm vai trò hoặc chức năng vào User
const handleAssignUserRole = async (userId, context, roleIds = []) => {
  try {
    const { userService } = require('./index');
    await userService.handleGetOneUser(userId);
    if (roleIds.length === 0) {
      await db.RoleUser.deleteMany({ userId });
      return handleSuccess("Delete role for user successfully");
    }
    // Kiểm tra role hợp lệ
    const roles = await db.Role.find({ _id: { $in: roleIds } }).lean();
    const foundRoleIds = roles.map(role => role._id.toString());
    const invalidRoleIds = roleIds.filter(id => !foundRoleIds.includes(id));
    if (invalidRoleIds.length > 0) {
      throw createError.NotFound('F9');
    }

    // Lấy danh sách role hiện tại của user
    const existingRoles = await db.RoleUser.find({ userId }).lean();
    const existingRoleIds = existingRoles.map(r => r.roleId.toString());

    // Lọc ra role chưa có
    const newRoleIds = foundRoleIds.filter(id => !existingRoleIds.includes(id));

    if (newRoleIds.length > 0) {
      const roleUserRecords = newRoleIds.map(roleId => ({
        userId,
        roleId,
      }));
      await db.RoleUser.insertMany(roleUserRecords);
    }
    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'assign', 'user', userId, null, null, ipAddress, userAgent)

    return handleSuccess("Roles added to user successfully");
  } catch (error) {
    throw error;
  }
};

const handleAssignUserPermission = async (userId, context, permissionIds = []) => {
  try {
    const { userService } = require('./index');
    await userService.handleGetOneUser(userId);
    if (permissionIds.length === 0) {
      await db.PermissionUser.deleteMany({ userId });
      return handleSuccess("Delete permission for user successfully");
    }

    // Kiểm tra permission hợp lệ
    const permissions = await db.Permission.find({ _id: { $in: permissionIds } }).lean();
    const foundPermissionIds = permissions.map(p => p._id.toString());
    const invalidPermissionIds = permissionIds.filter(id => !foundPermissionIds.includes(id));
    if (invalidPermissionIds.length > 0) {
      throw createError.NotFound('F8');
    }

    // Lấy danh sách permission hiện tại của user
    const existingPermissions = await db.PermissionUser.find({ userId }).lean();
    const existingPermissionIds = existingPermissions.map(r => r.permissionId.toString());

    // Lọc ra permission chưa có
    const newPermissionIds = foundPermissionIds.filter(id => !existingPermissionIds.includes(id));

    if (newPermissionIds.length > 0) {
      const permissionUserRecords = newPermissionIds.map(permissionId => ({
        userId,
        permissionId,
      }));
      await db.PermissionUser.insertMany(permissionUserRecords);
    }
    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'assign', 'user', userId, null, null, ipAddress, userAgent)

    return handleSuccess("Permissions assigned to user successfully");
  } catch (error) {
    throw error;
  }
};

const handleAssignPermissionRole = async (context, roleId, permissionIds = [], userId) => {
  try {
    const role = await db.Role.findById(roleId);
    if (!role) {
      throw createError.NotFound('F9');
    }

    // Kiểm tra permission hợp lệ
    const permissions = await db.Permission.find({ _id: { $in: permissionIds } }).lean();
    const foundPermissionIds = permissions.map(p => p._id.toString());
    const invalidIds = permissionIds.filter(id => !foundPermissionIds.includes(id));
    if (invalidIds.length > 0) {
      throw createError.NotFound('F8');
    }

    // Xoá permission cũ của role
    await db.PermissionRole.deleteMany({ roleId });

    // Tạo mới liên kết permission-role
    const permissionRoleRecords = foundPermissionIds.map(permissionId => ({
      permissionId,
      roleId,
    }));

    await db.PermissionRole.insertMany(permissionRoleRecords);
    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'assign', 'role', roleId, null, null, ipAddress, userAgent)

    return handleSuccess("Permissions assigned to role successfully");
  } catch (error) {
    throw error;
  }
};

module.exports = {
  handleAssignPermissionRole,
  handleAssignUserPermission,
  handleAssignUserRole
}


