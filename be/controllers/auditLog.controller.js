const { auditLogService } = require("../services/index")

const getAuditLog = async (req, res, next) => {
  try {
    const { entityType = null, action = null } = req.body || {}
    const result = await auditLogService.handleGetAuditLog(req.user.id, entityType, action)
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuditLog
};