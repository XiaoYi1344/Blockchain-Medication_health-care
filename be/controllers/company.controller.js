const { companyService } = require('../services');
const cloudinary = require('../utils/cloudinary');
const handleSuccess = require('../utils/success.util')

const getAllCompany = async (req, res, next) => {
  try {
    let { select = false } = req.query || {}
    if (!select)
      select = '-newName -createdAt -updatedAt -__v'
    else
      select = 'name'
    const result = await companyService.handleGetAllCompany(select);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getOneCompany = async (req, res, next) => {
  try {
    let { companyId } = req.query || {}
    if (!companyId) companyId = req.user.companyId
    const result = await companyService.handleGetOneCompany(companyId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getOneCompanyByCode = async (req, res, next) => {
  try {
    let { companyCode } = req.params || {}
    const result = await companyService.handleGetOneCompanyByCode(companyCode);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateIsActiveCompany = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const { isActive = 'inactive' } = req.body;
    const result = await companyService.handleUpdateIsActiveCompany(req.user.id, req.context, companyId, isActive);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, type, location, phone } = req.body || {};
    const result = await companyService.handleCreate(req.user.id, req.context, name, type, location, phone)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const update = async (req, res, next) => {
  try {
    req.body.images = []
    if (req.files && req.files.length > 0) {
      req.body.images = await cloudinary.createImgs(req.files);
    }
    const { name, location, nationality, images, deleteImages } = req.body;

    const result = await companyService.handleUpdateData(req.user.id, req.context, req.user.companyId, name, null, location, nationality, images, deleteImages)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const updateStatus = async (req, res, next) => {
  try {
    const { companyId = null, status = null } = req.body || {};

    await companyService.handleUpdateData(req.user.id, req.context, companyId, null, status)
    res.status(201).json(handleSuccess("Company status updated successfully"));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllCompany,
  getOneCompany,
  updateIsActiveCompany,
  create,
  update,
  updateStatus,
  getOneCompanyByCode
}