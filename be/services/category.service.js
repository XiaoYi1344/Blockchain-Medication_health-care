const db = require("../models");
const createError = require("http-errors");
const handleSuccess = require("../utils/success.util");
const { default: mongoose } = require("mongoose");
const auditLogHandle = require("../utils/auditLog.util");

const getOneCategory = async (id, filter = {}) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }
    filter._id = id;

    const category = await db.Category.findOne(filter);
    return category;
  } catch (error) {
    throw error;
  }
};

const handleGetOneCategory = async (id, fil = {}) => {
  try {
    const category = await getOneCategory(id, fil);
    return handleSuccess('Get category successful', category || []);
  } catch (error) {
    throw error;
  }
};

const handleGetAllCategory = async (fil = {}) => {
  try {
    const categorys = await db.Category.find(fil);
    return handleSuccess('Get all categorys successful', categorys);
  } catch (error) {
    throw error;
  }
};

const handleDeleteCategory = async (userId, context, id = null) => {
  try {
    await handleGetOneCategory(id);

    await Promise.all([
      db.Product.updateMany({ categoryId: id }, { $pull: { categoryId: id } }),
      db.Category.findByIdAndDelete(id)
    ])
    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'delete', 'category', id, null, null, ipAddress, userAgent)

    return handleSuccess('Delete category successful');
  } catch (error) {
    throw error;
  }
};

const handleApproval = async (userId, context, id, isActive) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }

    await db.Category.findByIdAndUpdate(id, { isActive })

    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'approval', 'category', id, JSON.stringify({ isActive }), JSON.stringify({ isActive }), ipAddress, userAgent)

    return handleSuccess("Category approval successfully");
  } catch (error) {
    throw error;
  }
};

const handleUpdateData = async (userId, context, id, data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }

    if (data.name) {
      const duplicateCategory = await db.Category.findOne({
        name: data.name,
        _id: { $ne: id }
      });
      if (duplicateCategory) {
        throw createError.Conflict('F18');
      }
    }
    data.isActive = false
    await db.Category.findByIdAndUpdate(id, data)
    if (data.hasOwnProperty("isActive") && data.isActive === false) {
      await db.Product.updateMany(
        { categoryIds: id },
        { $pull: { categoryIds: id } }
      );
    }

    const changedOld = await db.Category.findById(id).select('name description').lean()
    const changedNew = { ...changedOld, ...data }

    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'update', 'category', id, JSON.stringify(changedOld), JSON.stringify(changedNew), ipAddress, userAgent)

    return handleSuccess("Category updated successfully");
  } catch (error) {
    throw error;
  }
};

const handleCreate = async (userId, context, data) => {
  try {
    const isExistingCategory = await db.Category.findOne({ name: data.name });
    if (isExistingCategory) {
      throw createError.Conflict('F18');
    }

    // Tạo mới
    const newCategory = await db.Category.create(data)

    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'create', 'category', newCategory._id, null, null, ipAddress, userAgent)

    return handleSuccess('Category created successfully');
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOneCategory,
  handleGetAllCategory,
  handleCreate,
  handleUpdateData,
  handleApproval,
  handleDeleteCategory,
  handleGetOneCategory
}


