const { auditLogHandle, handleSuccess, verifyHashHandle, cryptoHandle } = require("../utils/index");

const handleVerifyHash = async (userId, context, entityType, id, txHash, data) => {
  try {
    const ordinal = verifyHashHandle.getOrdinal(entityType)
    const dataVerify = {}
    for (let o of ordinal) {
      if (data[o] !== undefined && data[o] !== null)
        dataVerify[o] = data[o];
    }
    const result = cryptoHandle.verifyHash(dataVerify, txHash)
    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, "verify", entityType, id, null, null, ipAddress, userAgent);

    return handleSuccess('Verify hash successful', { result });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  handleVerifyHash
}