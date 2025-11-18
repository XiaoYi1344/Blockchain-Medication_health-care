const db = require("../models");
const createError = require("http-errors");
const { default: mongoose } = require("mongoose");
const { cloudinary, auditLogHandle, handleSuccess, counterHandle } = require("../utils/index");

const getOneCompany = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }

    const company = await db.Company.findById(id);
    return company;
  } catch (error) {
    throw error;
  }
};

const handleGetOneCompany = async (id) => {
  try {
    const company = await getOneCompany(id);
    if (!company) throw createError.NotFound('F12');
    return handleSuccess('Get company successful', company);
  } catch (error) {
    throw error;
  }
};

const handleGetOneCompanyByCode = async (companyCode) => {
  try {
    const company = await db.Company.findOne({ companyCode, isActive: 'active' }).select('-isActive -status');
    if (!company) throw createError.NotFound('F12');
    return handleSuccess('Get company by code successful', company);
  } catch (error) {
    throw error;
  }
};

const handleGetAllCompany = async (select) => {
  try {
    const companys = await db.Company.find().select(select);
    return handleSuccess('Get all companys successful', companys);
  } catch (error) {
    throw error;
  }
};

const handleUpdateIsActiveCompany = async (userId, context, id = null, isActive = 'inactive') => {
  try {
    const com = (await handleGetOneCompany(id)).data;

    await db.Company.updateOne({ _id: id }, { isActive });
    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'update', 'company', id, JSON.stringify(com.isActive), JSON.stringify(isActive), ipAddress, userAgent)

    return handleSuccess('Update isActive company successful');
  } catch (error) {
    throw error;
  }
};

const handleUpdateData = async (userId, context, id, name, status, location = null, nationality = null, images = [], deleteImages = []) => {
  try {
    const company = (await handleGetOneCompany(id)).data
    let newData = null, oldData = null

    // Build update data
    const updateData = {};
    if (name) {
      const isExisting = await db.Company.findOne({ name, _id: { $ne: id } });
      if (isExisting) {
        if (images.length > 0) {
          await cloudinary.handleDeleteImgs(images);
        }
        throw createError.Conflict('F11');
      }
      updateData.status = 'pending'
      updateData.newName = name;
    } else if (status) {
      if (status === 'approved') {
        if (!company.newName) throw createError.BadRequest('F70');

        updateData.name = company.newName;
        updateData.newName = '';
        updateData.status = status;

        newData = company.newName;
        oldData = company.name;
        const { notificationService, userService } = require('./index');
        const user = await userService.getUserByCompanyAndRole(company);
        if (user) await notificationService.handleCreate({ userId, context, data: { title: "Approval company's name successful!", message: 'Your company name has been successfully approved.', type: 'company', relatedEntityType: 'company', relatedEntityId: company._id }, recipientId: user._id })
      } else if (status === 'reject' && company.status === 'pending') {
        updateData.status = status;
        const { notificationService, userService } = require('./index');
        const user = await userService.getUserByCompanyAndRole(company);
        if (user) await notificationService.handleCreate({ userId, context, data: { title: "Your company's name.", message: 'Your company name has been reject.', type: 'company', relatedEntityType: 'company', relatedEntityId: company._id }, recipientId: user._id })
      }
    }

    if (location) updateData.location = location;
    if (nationality) updateData.nationality = nationality;
    if (images.length > 0) {
      updateData.$push = { images: { $each: images } };
    }

    if (deleteImages.length > 0) {
      updateData.$pull = { images: { $in: deleteImages } };
      await cloudinary.handleDeleteImgs(deleteImages);
    }

    await db.Company.findByIdAndUpdate(id, updateData);
    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'update', 'company', id, oldData, newData, ipAddress, userAgent)

    return handleSuccess("Company updated successfully");
  } catch (error) {
    if (images && images.length > 0) {
      await cloudinary.handleDeleteImgs(images);
    }
    throw error;
  }
};

const handleCreate = async (userId, context, name, type, location, phone) => {
  try {
    const isExisting = await db.Company.findOne({ name });
    if (isExisting) {
      throw createError.Conflict('F11');
    }
    const companyCode = await counterHandle('Company', 'COMP')

    // Tạo mới
    const newCompany = await db.Company.create({ companyCode, name, type, location, phone })
    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'create', 'company', newCompany._id, null, null, ipAddress, userAgent)

    return handleSuccess('Company created successfully');
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOneCompany,
  handleGetAllCompany,
  handleCreate,
  handleUpdateData,
  handleUpdateIsActiveCompany,
  handleGetOneCompany,
  handleGetOneCompanyByCode
}


