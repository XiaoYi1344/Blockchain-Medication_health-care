const { companyDocumentService } = require('../services');
const { cloudinary, imgIPFSHandle } = require('../utils/index');

const getLicenses = async (req, res, next) => {
  try {
    let { companyId } = req.query || {}
    let status = null
    if (!companyId) {
      companyId = req.user.companyId
    }
    const result = await companyDocumentService.handleGetLicensesByCompany(companyId, status);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    req.body.images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const cloudinaryImg = await cloudinary.createOneImg(file);
        const ipfsRes = await imgIPFSHandle.uploadFile(file);

        req.body.images.push({
          public_id: cloudinaryImg,
          hash: ipfsRes.hash,
          url: ipfsRes.url,
        });
      }
    }

    const { type, images, expiryDate, name } = req.body;

    const result = await companyDocumentService.handleCreateLicense(req.user.id, req.context, req.user.companyId, name, type, images, expiryDate);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const managementLicense = async (req, res, next) => {
  try {
    const { id, status } = req.body || {};

    const result = await companyDocumentService.handleManagementLicense(req.user.id, req.context, id, status)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getLicenses,
  create,
  managementLicense
}