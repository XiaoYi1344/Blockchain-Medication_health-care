const db = require("../models")

const createLog = async (actorUserId, action, entityType, entityId, oldValue, newValue, ipAddress, userAgent) => {
  try {
    await db.AuditLog.create({ actorUserId, action, entityType, entityId, oldValue, newValue, ipAddress, userAgent })
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}

module.exports = { createLog }