const { notificationService } = require('../services');

const getAllNotificationAdmin = async (req, res, next) => {
  try {
    const result = await notificationService.handleGetAllNotificationAdmin(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllNotification = async (req, res, next) => {
  try {
    const result = await notificationService.handleGetAllNotification(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const stopNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const { isActive = false } = req.body;
    const result = await notificationService.handleStopNotification(req.user.id, req.context, notificationId, isActive);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { batchCode = null, ...data } = req.body
    const result = await notificationService.handleCreate({ userId: req.user.id, context: req.context, batchCode, data, companyId: req.user.companyId });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const updateRecipient = async (req, res, next) => {
  try {
    const { notificationIds = [] } = req.body;
    const result = await notificationService.handleUpdateRecipient(req.user.id, notificationIds);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllNotificationAdmin,
  getAllNotification,
  stopNotification,
  create,
  updateRecipient
}