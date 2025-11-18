const { batchService } = require('../services');
const { cloudinary } = require('../utils/index');

const getOneBatch = async (req, res, next) => {
  try {
    const { batchCode } = req.params;
    const result = await batchService.handleGetBatchByCode(batchCode, '-ownerCompanyId -txHash');
    if (result.data.state === 'DRAFT' || result.data.isActive === false) {
      result.data = "This batch is in DRAFT state or inactive, you have no permission to view detailed information."
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getBatch = async (req, res, next) => {
  try {
    const { batchCode } = req.params;
    const result = await batchService.handleGetBatchByCode(batchCode, '-ownerCompanyId');
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllBatch = async (req, res, next) => {
  try {
    const { isActive = true, state = 'IN_STOCK' } = req.query || {};
    const result = await batchService.handleGetAllBatch({ isActive, state });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllBatchByCompany = async (req, res, next) => {
  try {
    let companyId = req.user.companyId || null;
    const result = await batchService.handleGetAllBatchByCompany(companyId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    req.body.images = []
    if (req.files) {
      req.body.images = await cloudinary.createImgs(req.files);
    }
    const result = await batchService.handleCreate(req.user.id, req.context, req.user.companyId, req.body)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const update = async (req, res, next) => {
  try {
    if (req.body.isActive) delete req.body.isActive;
    req.body.images = []
    if (req.files) {
      req.body.images = await cloudinary.createImgs(req.files);
    }
    const { batchCode, deleteImages = null, ...data } = req.body;
    const result = await batchService.handleUpdateData(req.user.id, req.context, batchCode, deleteImages, data)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const updateState = async (req, res, next) => {
  try {
    if (req.body.isActive) delete req.body.isActive;
    const { batchCode, state = null, forceRecall = null, locationId = null } = req.body;
    const result = await batchService.handleUpdateState({ userId: req.user.id, context: req.context, batchCode, state, forceRecall, locationId, companyId: req.user.companyId })
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const approval = async (req, res, next) => {
  try {
    const { batchCode, isActive, state = null } = req.body;
    const result = await batchService.handleApproval(req.user.id, req.context, batchCode, isActive, state)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getOneBatch,
  getBatch,
  getAllBatch,
  getAllBatchByCompany,
  create,
  update,
  updateState,
  approval
}