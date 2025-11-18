const db = require("../models");
const { handleSuccess } = require("../utils/index");

const handleGetAuditLog = async (userId, entityType, action) => {
  try {
    let fil = { actorUserId: userId }
    if (entityType) fil.entityType = entityType
    if (action) fil.action = action
    const result = await db.AuditLog.find(fil)
    return handleSuccess('Get audit log successful', result);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  handleGetAuditLog
}