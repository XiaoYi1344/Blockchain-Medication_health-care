const db = require("../models");
const createError = require("http-errors");
const handleSuccess = require("../utils/success.util");
const { default: mongoose } = require("mongoose");
const auditLogHandle = require("../utils/auditLog.util");

const getOneRole = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }

    const role = await db.Role.findById(id);
    return role;
  } catch (error) {
    throw error;
  }
};

const handleGetOneRole = async (id) => {
  try {
    const role = await getOneRole(id);
    if (!role) throw createError.NotFound('F9');
    return handleSuccess('Get role successful', role);
  } catch (error) {
    throw error;
  }
};

const getAllRoleByUserId = async (id) => {
  try {
    const roleUsers = await db.RoleUser.find({ userId: id })
      .populate('roleId', 'name')
      .lean();

    if (!roleUsers || roleUsers.length === 0) {
      return [{ roleId: process.env.ID_GUEST, roleName: 'Guest' }]
    }
    const roles = [
      ...new Map(
        roleUsers.map(r => [r.roleId._id.toString(), {
          roleId: r.roleId._id,
          roleName: r.roleId.name
        }])
      ).values()
    ];

    return roles
  } catch (error) {
    throw error;
  }
};

const handleGetAllRoleByUserId = async (id) => {
  try {
    const result = await getAllRoleByUserId(id)
    return handleSuccess('Get role successful', result);
  } catch (error) {
    throw error;
  }
};

const handleGetAllRoleAdmin = async () => {
  try {
    const roles = await db.Role.find({ companyId: null });
    return handleSuccess('Get all roles successful', roles);
  } catch (error) {
    throw error;
  }
};

const handleGetAllRoleByCompany = async (companyId) => {
  try {
    const roles = await db.Role.find({ companyId }).select('-companyId');
    return handleSuccess('Get all roles by company successful', roles);
  } catch (error) {
    throw error;
  }
};

const handleDeleteRole = async (userId, context, id = null) => {
  try {
    await handleGetOneRole(id);

    await Promise.all([
      db.Role.findByIdAndDelete(id),
      db.PermissionRole.deleteMany({ roleId: id }),
      db.RoleUser.updateMany({ roleId: id }, { roleId: process.env.ID_GUEST })
    ]);
    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'delete', 'role', id, null, null, ipAddress, userAgent)

    return handleSuccess('Delete role successful');
  } catch (error) {
    throw error;
  }
};

const handleUpdateData = async (userId, context, id, data, companyId, permissionIds = []) => {
  try {
    const { authorizationService } = require('./index');
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }
    const oldDoc = (await handleGetOneRole(id)).data;
    if (companyId) {
      if (oldDoc.companyId.toString() !== companyId) {
        throw createError.Forbidden('C2');
      }
    }
    if (data.name) {
      const duplicateRole = await db.Role.findOne({
        name: data.name,
        _id: { $ne: id }
      });
      if (duplicateRole) {
        throw createError.Conflict('F10');
      }
    }

    const changedOld = {};
    const changedNew = {};
    for (const key of Object.keys(data)) {
      if (oldDoc[key] !== data[key]) {
        changedOld[key] = oldDoc[key];
        changedNew[key] = data[key];
      }
    }

    if (permissionIds.length !== 0) {
      await Promise.all([
        db.Role.findByIdAndUpdate(id, data),
        authorizationService.handleAssignPermissionRole(context, id, permissionIds)
      ])
    } else {
      await db.Role.findByIdAndUpdate(id, data)
    }
    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'update', 'role', id, JSON.stringify(changedOld), JSON.stringify(changedNew), ipAddress, userAgent)

    return handleSuccess("Role updated successfully");
  } catch (error) {
    throw error;
  }
};

const handleCreate = async (userId, context, data, permissionIds = []) => {
  try {
    const { authorizationService } = require('./index');
    const isExistingRole = await db.Role.findOne({ name: data.name });
    if (isExistingRole) {
      throw createError.Conflict('F10');
    }

    // Tạo mới
    const newRole = await db.Role.create(data)
    await authorizationService.handleAssignPermissionRole(context, newRole._id, permissionIds)

    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'create', 'role', newRole._id, null, null, ipAddress, userAgent)

    return handleSuccess('Role created successfully');
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOneRole,
  getAllRoleByUserId,
  handleGetAllRoleByUserId,
  handleGetAllRoleAdmin,
  handleGetAllRoleByCompany,
  handleCreate,
  handleUpdateData,
  handleDeleteRole,
  handleGetOneRole
}


