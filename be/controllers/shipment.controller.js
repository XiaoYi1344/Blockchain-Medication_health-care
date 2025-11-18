const { shipmentService } = require('../services');

const getAllShipmentByCompany = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const result = await shipmentService.handleGetAllShipmentByCompany(companyId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllShipmentByUserId = async (req, res, next) => {
  try {
    const { id } = req.user;
    const result = await shipmentService.handleGetAllShipmentByUserId(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllShipmentByCode = async (req, res, next) => {
  try {
    const { orderCode } = req.params;
    const result = await shipmentService.handleGetShipmentByOrderCode(orderCode);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const stopShipment = async (req, res, next) => {
  try {
    const { shipmentId } = req.params;
    const result = await shipmentService.handleStopShipment(req.user.id, req.context, shipmentId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const result = await shipmentService.handleCreate(req.user.id, req.context, req.user.companyId, req.body)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const update = async (req, res, next) => {
  try {
    const { shipmentId, status = null, ...data } = req.body;
    const result = await shipmentService.handleUpdateData(req.user.id, req.context, shipmentId, status, data, req.user.companyId)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllShipmentByCompany,
  getAllShipmentByUserId,
  getAllShipmentByCode,
  stopShipment,
  create,
  update
}