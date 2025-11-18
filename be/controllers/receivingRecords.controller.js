const { receivingRecordsService } = require('../services');
const { cloudinary, imgIPFSHandle } = require('../utils/index')

const getAllRoleByOrder = async (req, res, next) => {
  try {
    const { orderCode } = req.params;
    const result = await receivingRecordsService.handleGetAllReceivingRecordByOrder(orderCode, req.user.companyId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getOneRecordByShipCode = async (req, res, next) => {
  try {
    const { shipCode } = req.params;
    const result = await receivingRecordsService.handleGetOneRecordByShipCode(shipCode);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
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
    const { receiveId, receivedQuantity = [], remarks = null, images } = req.body;
    const result = await receivingRecordsService.handleUpdateData(req.user.id, req.context, req.user.companyId, receiveId, JSON.parse(receivedQuantity), remarks, images)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllRoleByOrder,
  getOneRecordByShipCode,
  update,
}