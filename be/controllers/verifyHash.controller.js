const { verifyHashService } = require("../services/index")

const verifyHash = async (req, res, next) => {
  try {
    const { entityType, id, txHash, ...data } = req.body
    const result = await verifyHashService.handleVerifyHash(req.user.id, req.context, entityType, id, txHash, data)
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyHash
};