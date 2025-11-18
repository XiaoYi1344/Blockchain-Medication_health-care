const { inventoryHistoryService } = require('../services');

const getAllInventoryByCompany = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const result = await inventoryHistoryService.handleGetAllInventoryHistoryByCompany(companyId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllInventoryByCompany
}