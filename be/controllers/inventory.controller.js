const { inventoryService } = require('../services');

const getAllInventoryByCompany = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const result = await inventoryService.handleGetAllInventoryByCompany(companyId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { locationId = null, batchCode = null, uom = null, currentQuantity = 0 } = req.body;
    const result = await inventoryService.handleCreate(req.user.id, req.context, req.user.companyId, locationId, batchCode, uom, currentQuantity)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const exportProduct = async (req, res, next) => {
  try {
    const { batchCode = null, locationId = null, quantity, reason = null, relatedShipmentId } = req.body;
    const result = await inventoryService.handleExportProduct(req.user.id, req.context, req.user.companyId, batchCode, locationId, quantity, reason, 'export', null, relatedShipmentId)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const update = async (req, res, next) => {
  try {
    const { inventoryId = null, ...data } = req.body;
    const result = await inventoryService.handleUpdateData(req.user.id, req.context, inventoryId, data, req.user.companyId)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllInventoryByCompany,
  create,
  exportProduct,
  update
}