const db = require("../models");
const createError = require("http-errors");
const handleSuccess = require("../utils/success.util");
const { default: mongoose } = require("mongoose");
const auditLogHandle = require("../utils/auditLog.util");

const getOneLocation = async (id, fil = { isActive: true }) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }
    fil._id = id

    const location = await db.Location.findOne(fil);
    return location;
  } catch (error) {
    throw error;
  }
};

const handleGetOneLocation = async (id, fil = { isActive: true }) => {
  try {
    const location = await getOneLocation(id, fil);
    if (!location) throw createError.NotFound('F27');
    return handleSuccess('Get location successful', location);
  } catch (error) {
    throw error;
  }
};

const handleGetAllLocationByCompany = async (companyId, fil = { isActive: true }) => {
  try {
    fil.companyId = companyId
    const locations = await db.Location.find(fil).select('-companyId');
    return handleSuccess('Get all locations by company successful', locations);
  } catch (error) {
    throw error;
  }
};

const handleUpdateData = async (userId, context, id, data, companyId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }
    const oldDoc = (await handleGetOneLocation(id, fil = {})).data;
    if (companyId) {
      if (oldDoc.companyId.toString() !== companyId) {
        throw createError.Forbidden('C2');
      }
    }
    if (data.name) {
      const duplicateLocation = await db.Location.findOne({
        name: data.name,
        companyId,
        _id: { $ne: id }
      });
      if (duplicateLocation) {
        throw createError.Conflict('F26');
      }
    }
    if (data.maximum && data.maximum < oldDoc.currentQuantity) {
      throw createError.BadRequest('F32');
    }

    const changedOld = {};
    const changedNew = {};
    for (const key of Object.keys(data)) {
      if (oldDoc[key] !== data[key]) {
        changedOld[key] = oldDoc[key];
        changedNew[key] = data[key];
      }
    }

    await db.Location.findByIdAndUpdate(id, data, { runValidators: true })
    if (data.isActive === false) {
      await db.Inventory.updateMany({ locationId: id }, { isActive: 'danger' })
    }

    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'update', 'location', id, JSON.stringify(changedOld), JSON.stringify(changedNew), ipAddress, userAgent)

    return handleSuccess("Location updated successfully");
  } catch (error) {
    throw error;
  }
};

const handleIncreaseQuantity = async (id, currentQuantity = null) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }
    if(!currentQuantity) throw createError.BadRequest('B1')
    await db.Location.findByIdAndUpdate(id, { $inc: { currentQuantity } })
    return handleSuccess("Location increase quantity successfully");
  } catch (error) {
    throw error;
  }
};

const handleCreate = async (userId, context, companyId, name, address = null, type, preservationCapability, maximum) => {
  try {
    const isExistingLocation = await db.Location.findOne({ name, companyId });
    if (isExistingLocation) {
      throw createError.Conflict('F26');
    }

    // Tạo mới
    const newLocation = await db.Location.create({ companyId, name, address, type, preservationCapability, maximum })

    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'create', 'location', newLocation._id, null, null, ipAddress, userAgent)

    return handleSuccess('Location created successfully');
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOneLocation,
  handleGetAllLocationByCompany,
  handleCreate,
  handleUpdateData,
  handleGetOneLocation,
  handleIncreaseQuantity
}


