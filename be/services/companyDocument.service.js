const db = require("../models");
const createError = require("http-errors");
const { default: mongoose } = require("mongoose");
const { auditLogHandle, cloudinary, handleSuccess, cryptoHandle, counterHandle, dayjsHandle } = require("../utils/index");

const getOneLicense = async (id, type = null, status = null) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }
    let filter = { _id: id }
    if (type) filter.type = type
    if (status) filter.status = status

    const license = await db.CompanyDocument.findOne(filter)
    if (license && license.expiryDate) {
      license.expiryDate = dayjsHandle.dayjs(license.expiryDate).format('YYYY-MM-DD');
    }
    return license;
  } catch (error) {
    throw error;
  }
};

const handleGetLicensesByCompany = async (companyId, status) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(companyId) || !companyId) {
      throw createError.BadRequest('B6 B7');
    }
    let fil = { companyId }
    if (status) fil.status = status
    const licenses = await db.CompanyDocument.find(fil).lean()
    const formatted = licenses.map(lic => ({
      ...lic,
      expiryDate: lic.expiryDate ? dayjsHandle.dayjs(lic.expiryDate).format('YYYY-MM-DD') : null
    }));
    return handleSuccess('Get licenses successful', formatted || []);
  } catch (error) {
    throw error;
  }
};

const handleGetOneLicenses = async (id) => {
  try {
    const license = await getOneLicense(id);
    if (!license) throw createError.NotFound('F13');

    return handleSuccess('Get licenses successful', license);
  } catch (error) {
    throw error;
  }
};

const handleCreateLicense = async (userId, context, companyId, name, type, images = [], expiryDate) => {
  try {
    const { companyService } = require('./index');

    // console.log('🟢 [handleCreateLicense] Start');
    // console.log('➡️ Input:', { userId, companyId, name, type, expiryDate, imageCount: images.length });

    if (!type || !expiryDate) {
      throw createError.BadRequest('B10 B16');
    }

    const now = dayjsHandle.dayjs().startOf('day');
    const exp = dayjsHandle.dayjs(expiryDate).startOf('day');
    if (!exp.isValid()) {
      throw createError.BadRequest('F71');
    }
    if (!exp.isAfter(now)) {
      throw createError.BadRequest('F72');
    }

    const existingDoc = await db.CompanyDocument.findOne({ type, status: 'active', companyId });
    if (existingDoc) {
      throw createError.Conflict('F14');
    }

    const licenseId = await counterHandle('License', 'LI');

    const { data: company } = await companyService.handleGetOneCompany(companyId);
    if (!company) {
      throw createError.NotFound('F01');
    }

    const combined = {
      licenseId,
      expiryDate,
      images: images.map(img => img.hash) || []
    };
    const txHash = cryptoHandle.hashData(combined);

    const newLicense = await db.CompanyDocument.create({ companyId: company._id, name, type, licenseId, images, txHash, expiryDate, });

    const { ipAddress, userAgent } = context || {};
    await auditLogHandle.createLog(userId, 'create', 'license', newLicense._id, null, null, ipAddress, userAgent);

    return handleSuccess('CompanyDocument created successfully', { companyCode: company.companyCode, type, txHash });

  } catch (error) {
    if (images?.length > 0) {
      await cloudinary.handleDeleteImgs(images);
    }
    throw error;
  }
};

const handleManagementLicense = async (userId, context, id = null, status) => {
  try {
    if (status !== 'active' && status !== 'revoked') {
      throw createError.BadRequest('B17');
    }
    const license = (await handleGetOneLicenses(id)).data

    await db.CompanyDocument.findByIdAndUpdate(id, { status });

    const { userService, companyService, notificationService } = require('./index')
    const company = (await companyService.handleGetOneCompany(license.companyId)).data
    const user = await userService.getUserByCompanyAndRole(company)

    let title, message
    if (status === 'active') {
      title = "Approval company's license successful!"
      message = "Your company's license has been successfully approved."
    } else if (status === 'revoked ') {
      title = "Your company's license has been revoked."
      message = "Your company's license has been revoked. Please update it soon."
    }

    await notificationService.handleCreate({ userId, context, data: { title, message, type: 'license', relatedEntityType: 'license', relatedEntityId: license._id }, recipientId: user._id })

    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'approval', 'license', license._id, null, null, ipAddress, userAgent)

    return handleSuccess('Update status license successful');
  } catch (error) {
    throw error;
  }
};

module.exports = {
  handleGetLicensesByCompany,
  handleCreateLicense,
  handleManagementLicense
}


