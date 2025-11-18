const db = require("../models");
const createError = require("http-errors");
const handleSuccess = require("../utils/success.util");
const { default: mongoose } = require("mongoose");

const getOneInventoryHistory = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }

    const history = await db.InventoryHistory.findById(id);
    return history;
  } catch (error) {
    throw error;
  }
};

const handleGetAllInventoryHistoryByCompany = async (companyId) => {
  try {
    const historys = await db.InventoryHistory.find({ companyId, isActive: true }).select('-companyId');
    return handleSuccess('Get all historys by company successful', historys);
  } catch (error) {
    throw error;
  }
};

const handleCreate = async (userId, companyId, inventoryId, batchCode, locationId, quantity, uom, type, reason, relatedCompanyId, relatedShipmentId) => {
  try {
    await db.InventoryHistory.create({ actorUserId: userId, companyId, inventoryId, batchCode, locationId, quantity, uom, type, reason, relatedCompanyId, relatedShipmentId })
    return handleSuccess('InventoryHistory created successfully');
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOneInventoryHistory,
  handleGetAllInventoryHistoryByCompany,
  handleCreate
}


