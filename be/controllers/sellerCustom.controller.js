const { sellerCustomService } = require('../services');

const getAll = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const { status = null } = req.body || {}
    const result = await sellerCustomService.handleGetAll(companyId, status);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { customerId, status } = req.body;
    const result = await sellerCustomService.handleUpdate(req.user.companyId, customerId, status)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAll,
  update,
}