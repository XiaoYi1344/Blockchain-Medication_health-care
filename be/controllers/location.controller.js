const { locationService } = require('../services');

const getAllLocationByCompany = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const result = await locationService.handleGetAllLocationByCompany(companyId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, address, type, preservationCapability, maximum } = req.body;
    const result = await locationService.handleCreate(req.user.id, req.context, req.user.companyId, name, address, type, preservationCapability, maximum)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const update = async (req, res, next) => {
  try {
    const { locationId, ...data } = req.body;
    const result = await locationService.handleUpdateData(req.user.id, req.context, locationId, data, req.user.companyId)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllLocationByCompany,
  create,
  update
}