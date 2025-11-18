const db = require("../models");
const createError = require("http-errors");
const handleSuccess = require("../utils/success.util");
const { default: mongoose } = require("mongoose");
const auditLogHandle = require("../utils/auditLog.util");

const getOnePermission = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }

    const permission = await db.Permission.findById(id);
    return permission;
  } catch (error) {
    throw error;
  }
};

const getPermissionByRole = async (roleId) => {
  try {
    const permissionDocs = await db.PermissionRole.find({ roleId })
      .populate("permissionId", "name displayName")
      .lean();

    const result = permissionDocs.map((p) => ({
      id: p.permissionId._id,
      name: p.permissionId.name,
      displayName: p.permissionId.displayName,
      type: p.type
    }));

    return result;
  } catch (error) {
    throw error;
  }
};

const getPermissionByUser = async (userId, roleIds = []) => {
  try {
    const permissions = await db.PermissionUser.find({ userId })
      .populate("permissionId", "name displayName type")
      .lean();
    const rolePermissions = await Promise.all(
      roleIds.map(id => getPermissionByRole(id))
    );

    const flattenedRolePermissions = rolePermissions.flat();

    const allPermissions = [
      ...permissions.map(p => p.permissionId).filter(Boolean),
      ...flattenedRolePermissions
    ];

    const uniquePermissions = Object.values(
      allPermissions.reduce((acc, p) => {
        acc[p.id.toString()] = p;
        return acc;
      }, {})
    );

    return uniquePermissions;
  } catch (error) {
    throw error;
  }
};

const handleGetOnePermission = async (id) => {
  try {
    const permission = await getOnePermission(id);
    if (!permission) throw createError.NotFound('F8');
    return handleSuccess('Get permission successful', permission);
  } catch (error) {
    throw error;
  }
};

const handleGetAllPermission = async () => {
  try {
    const permissions = await db.Permission.find();
    return handleSuccess('Get all permissions successful', permissions);
  } catch (error) {
    throw error;
  }
};

const handleGetAllPermissionByType = async (type = null) => {
  try {
    if (!type) throw createError.BadRequest('B10');

    const permissions = await db.Permission.find({ type }).select('name displayName');
    return handleSuccess('Get all permissions successful', permissions);
  } catch (error) {
    throw error;
  }
};

const handleGetAllPermissionByRole = async (roleId) => {
  try {
    let rolePermissions = await getPermissionByRole(roleId)
    return handleSuccess("Get all permissions successful", rolePermissions);
  } catch (error) {
    throw error;
  }
};

const handleGetAllPermissionByUser = async (userId) => {
  try {
    const {roleService} = require('./index')
    const roleIds = await roleService.getAllRoleByUserId(userId).then(res => res.map(r => r.roleId))
    let userPermissions = await getPermissionByUser(userId, roleIds)
    return handleSuccess("Get all permissions successful", userPermissions);
  } catch (error) {
    throw error;
  }
};

const handleDeletePermission = async (userId, context, id = null) => {
  try {
    await handleGetOnePermission(id);

    await Promise.all([
      db.Permission.findByIdAndDelete(id),
      db.PermissionRole.deleteMany({ permissionId: id }),
      db.PermissionUser.deleteMany({ permissionId: id })
    ]);
    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'delete', 'permission', id, null, null, ipAddress, userAgent)

    return handleSuccess('Delete permission successful');
  } catch (error) {
    throw error;
  }
};

const handleUpdateData = async (userId, context, id, data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }
    const oldDoc = (await handleGetOnePermission(id)).data;
    const duplicatePermission = await db.Permission.findOne({
      name: data.name,
      _id: { $ne: id }
    });
    if (duplicatePermission) {
      throw createError.Conflict('F7');
    }
    const changedOld = {};
    const changedNew = {};
    for (const key of Object.keys(data)) {
      if (oldDoc[key] !== data[key]) {
        changedOld[key] = oldDoc[key];
        changedNew[key] = data[key];
      }
    }

    await db.Permission.findByIdAndUpdate(id, data);

    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'update', 'permission', id, JSON.stringify(changedOld), JSON.stringify(changedNew), ipAddress, userAgent)

    return handleSuccess("Permission updated successfully");
  } catch (error) {
    throw error;
  }
};

const handleCreate = async (userId, context, name, displayName, type = []) => {
  try {
    if (!name || !displayName) {
      throw createError.BadRequest('B8 B9');
    }
    if (!Array.isArray(type)) {
      throw createError.BadRequest('B11');
    }

    // Kiểm tra trùng
    const isExistingPermission = await db.Permission.findOne({ name });
    if (isExistingPermission) {
      throw createError.Conflict('F7');
    }

    // Tạo Permission mới
    const newPermission = await db.Permission.create({ name, displayName, type });
    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'create', 'permission', newPermission._id, null, null, ipAddress, userAgent)

    return handleSuccess('Permission created successfully');
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOnePermission,
  getPermissionByUser,
  handleGetAllPermission,
  handleGetAllPermissionByType,
  handleGetAllPermissionByRole,
  handleGetAllPermissionByUser,
  handleCreate,
  handleUpdateData,
  handleDeletePermission,
  handleGetOnePermission
}


