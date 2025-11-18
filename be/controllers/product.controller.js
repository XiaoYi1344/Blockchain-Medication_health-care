const { productService } = require('../services');
const { cloudinary } = require('../utils/index')

const parseJSONField = (field) => {
  try {
    return typeof field === 'string' ? JSON.parse(field) : field;
  } catch {
    return field;
  }
};

const getAllProduct = async (req, res, next) => {
  try {
    const { isActive = 'active', onChain = true } = req.query || {};
    const result = await productService.handleGetAllProduct({ isActive, onChain });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getOneProduct = async (req, res, next) => {
  try {
    const { isActive = 'active', productId } = req.query || {};
    const result = await productService.handleGetOneProduct(productId, { isActive });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllProductForOrder = async (req, res, next) => {
  try {
    const { status = 'completed' } = req.query || {}
    const result = await productService.handleGetAllProductForOrder(status, req.user.companyId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllProductApproved = async (req, res, next) => {
  try {
    const { isActive = 'active' } = req.query || {}
    const result = await productService.handleGetAllProduct({ isActive }, req.user.companyId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllProductUser = async (req, res, next) => {
  try {
    const result = await productService.handleGetAllProduct({ userId: req.user.id });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getProductsForApproval = async (req, res, next) => {
  try {
    const result = await productService.handleGetAllProduct({ isActive: 'sent' }, req.user.companyId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params
    const result = await productService.handleDeleteProduct(req.user.id, req.context, productId);
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
      if (req.body.activeIngredient) req.body.activeIngredient = parseJSONField(req.body.activeIngredient);
      if (req.body.storageConditions) req.body.storageConditions = parseJSONField(req.body.storageConditions);
    }

    const result = await productService.handleCreate(req.user.id, req.context, req.body)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const update = async (req, res, next) => {
  try {
    const { productId, deleteImages, ...data } = req.body;
    if (req.files) {
      data.images = await cloudinary.createImgs(req.files);
      if (data.activeIngredient) data.activeIngredient = parseJSONField(data.activeIngredient);
      if (data.storageConditions) data.storageConditions = parseJSONField(data.storageConditions);
    }
    const result = await productService.handleUpdateData(req.user.id, req.context, productId, data, deleteImages)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const sendProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const result = await productService.handleUpdateData(req.user.id, req.context, productId, { isActive: 'sent' })
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const approvalProduct = async (req, res, next) => {
  try {
    const { productId, isActive } = req.body;
    const result = await productService.handleApprovalProduct(req.user.id, req.context, productId, isActive)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const updatePrimaryImage = async (req, res, next) => {
  try {
    const { productId } = req.body;
    let imagePrimary = null
    if (req.file) {
      imagePrimary = await cloudinary.createOneImg(req.file);
    }
    const result = await productService.handleUpdatePrimaryImage(req.user.id, req.context, productId, imagePrimary)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProduct,
  getAllProductForOrder,
  getAllProductApproved,
  getAllProductUser,
  getProductsForApproval,
  getOneProduct,
  deleteProduct,
  create,
  update,
  updatePrimaryImage,
  approvalProduct,
  sendProduct
}