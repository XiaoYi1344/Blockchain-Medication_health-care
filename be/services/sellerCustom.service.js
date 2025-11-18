const db = require("../models");
const createError = require("http-errors");
const handleSuccess = require("../utils/success.util");
const { default: mongoose } = require("mongoose");

const getOneSeller = async (sellerId, customerId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(sellerId) || !mongoose.Types.ObjectId.isValid(customerId)) {
      throw createError.BadRequest('B6');
    }

    if (!sellerId || !customerId) {
      throw createError.BadRequest('B7');
    }
    const seller = await db.SellerCustom.findOne({ sellerId, customerId });
    return seller;
  } catch (error) {
    throw error;
  }
};

const handleGetOne = async (sellerId, customerId) => {
  try {
    const relationShip = await getOneSeller(sellerId, customerId);
    if (!relationShip) throw createError.NotFound('F68');
    return handleSuccess('Get relationShip successful', relationShip);
  } catch (error) {
    throw error;
  }
};

const handleGetAll = async (sellerId, status) => {
  try {
    let fil = { sellerId }
    if (status) fil.status = status
    const result = await db.SellerCustom.find(fil).populate('customerId', 'name').lean()
    return handleSuccess('Get customer successful', result);
  } catch (error) {
    throw error;
  }
};

const handleUpdate = async (sellerId, customerId, status) => {
  try {
    await handleGetOne(sellerId, customerId);

    await db.SellerCustom.findOneAndUpdate({ sellerId, customerId }, { status })
    return handleSuccess("Seller updated successfully");
  } catch (error) {
    throw error;
  }
};

const handleCreate = async (customerId, sellerId) => {
  try {
    const isExistingSeller = await db.SellerCustom.findOne({ customerId, sellerId });
    if (!isExistingSeller) {
      await db.SellerCustom.create({ customerId, sellerId })
    }

    return handleSuccess('Seller created successfully');
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOneSeller,
  handleGetAll,
  handleCreate,
  handleUpdate
}