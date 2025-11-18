const { traceabilityService } = require("../services/index")

const traceability = async (req, res, next) => {
  try {
    const { batchCode } = req.body
    const result = await traceabilityService.handleTraceability(batchCode)
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  traceability
};