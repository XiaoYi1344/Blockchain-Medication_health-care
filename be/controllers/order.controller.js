const { orderService } = require('../services');

const getCreatedOrders = async (req, res, next) => {
  try {
    const result = await orderService.handleGetOrders({ userId: req.user.id, mode: 'created' });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllOrderReceivedOfCompany = async (req, res, next) => {
  try {
    const { id, companyId } = req.user;
    const result = await orderService.handleGetOrders({ userId: id, companyId, mode: 'received' });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllOrderUnreceivedOfCompany = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const result = await orderService.handleGetOrders({ companyId, mode: 'unreceived' });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getOneOrderByOrderCode = async (req, res, next) => {
  try {
    const { orderCode } = req.params;
    const result = await orderService.handleGetOneOrderByOrderCode(orderCode);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { buy, ...data } = req.body
    const result = await orderService.handleCreate(req.user.id, req.context, req.user.companyId, buy, data)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const update = async (req, res, next) => {
  try {
    const { orderCode, status = null, txHash = null, data } = req.body;
    const result = await orderService.handleUpdateData(req.user.id, req.context, orderCode, data, status, req.user.companyId, txHash)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const receivedOrder = async (req, res, next) => {
  try {
    const { orderCode, status } = req.body;
    const result = await orderService.handleReceivedOrder(req.user.id, req.context, orderCode, req.user.companyId, status)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const cancelOrder = async (req, res, next) => {
  try {
    const { orderCode } = req.params;
    const result = await orderService.handleCancelOrder(req.user.id, req.context, orderCode, 'canceled', req.user.companyId)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCreatedOrders,
  getAllOrderReceivedOfCompany,
  getAllOrderUnreceivedOfCompany,
  getOneOrderByOrderCode,
  create,
  update,
  receivedOrder,
  cancelOrder
}