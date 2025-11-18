const { categoryService } = require('../services');

const getAllCategory = async (req, res, next) => {
  try {
    const { isActive = true } = req.body || {}
    const result = await categoryService.handleGetAllCategory({ isActive });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllCategoryCompany = async (req, res, next) => {
  try {
    const { isActive = true } = req.body || {}
    const result = await categoryService.handleGetAllCategory({ isActive, companyId: req.user.companyId });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getOneCategory = async (req, res, next) => {
  try {
    const { categoryId, isActive = true } = req.body || {}
    const result = await categoryService.handleGetOneCategory(categoryId, { isActive });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const result = await categoryService.handleDeleteCategory(req.user.id, req.context, categoryId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    let data = req.body;
    data.companyId = req.user.companyId
    const result = await categoryService.handleCreate(req.user.id, req.context, req.body)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const update = async (req, res, next) => {
  try {
    const { categoryId, ...data } = req.body;
    const result = await categoryService.handleUpdateData(req.user.id, req.context, categoryId, data)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

const approval = async (req, res, next) => {
  try {
    const { categoryId, isActive } = req.body;
    const result = await categoryService.handleApproval(req.user.id, req.context, categoryId, isActive)
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllCategory,
  getAllCategoryCompany,
  getOneCategory,
  deleteCategory,
  create,
  update,
  approval
}