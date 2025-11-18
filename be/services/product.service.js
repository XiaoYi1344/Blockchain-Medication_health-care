const db = require("../models");
const createError = require("http-errors");
const { default: mongoose } = require("mongoose");
const { cloudinary, counterHandle, handleSuccess, auditLogHandle, cryptoHandle } = require('../utils/index')

const getOneProduct = async (id, filter = { onChain: true }) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }
    filter = { ...filter, _id: id };

    const product = await db.Product.findOne(filter);
    return product;
  } catch (error) {
    throw error;
  }
};

const handleGetOneProduct = async (id, fil = {}) => {
  try {
    const product = await getOneProduct(id, fil);
    return handleSuccess('Get product successful', product || null);
  } catch (error) {
    throw error;
  }
};

const getProductByCode = async (productCode, isActive = 'active', onChain = null) => {
  try {
    let fil = { productCode, isActive }
    if (onChain !== null) fil.onChain = onChain
    const product = await db.Product.findOne(fil);
    if (!product) throw createError.NotFound('F20');
    return product;
  } catch (error) {
    throw error;
  }
};

const handleGetAllProduct = async (fil = { isActive: 'active', onChain: true }, companyId = null) => {
  try {
    if (companyId) {
      const { companyService } = require('./index')
      const company = (await companyService.handleGetOneCompany(companyId)).data
      fil.companyCode = company.companyCode
    }
    const products = await db.Product.find(fil);
    return handleSuccess('Get all products successful', products);
  } catch (error) {
    throw error;
  }
};

const handleGetAllProductForOrder = async (status = 'completed', companyId) => {
  try {
    const blockedRelations = await db.SellerCustom.find({
      customerId: companyId,
      status: 'block'
    }).lean();

    const blockedSellerIds = blockedRelations.map(r => r.sellerId);
    const blockedCompanies = await db.Company.find(
      { _id: { $in: blockedSellerIds } },
      { companyCode: 1 }
    ).lean();
    const blockedCompanyCodes = blockedCompanies.map(c => c.companyCode);
    // console.log('⚠️ Blocked companyCodes:', blockedCompanyCodes);

    const results = await db.Product.aggregate([
      {
        $match: {
          isActive: 'active',
          onChain: true,
          ...(blockedCompanyCodes.length > 0 && {
            companyCode: { $nin: blockedCompanyCodes }
          })
        }
      },
      {
        $lookup: {
          from: "batches",
          localField: "productCode",
          foreignField: "productCode",
          as: "batches"
        }
      },
      {
        $addFields: {
          batches: {
            $filter: {
              input: "$batches",
              as: "b",
              cond: {
                $in: [
                  "$$b.state",
                  ["APPROVAL", "IN_PRODUCTION", "IN_STOCK"]
                ]
              }
            }
          }
        }
      },
      { $unwind: { path: "$batches", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "inventories",
          localField: "batches.batchCode",
          foreignField: "batchCode",
          as: "inventories"
        }
      },
      { $unwind: { path: "$inventories", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$_id",
          productCode: { $first: "$productCode" },
          name: { $first: "$name" },
          companyCode: { $first: "$companyCode" },
          uomQuantity: { $first: "$uomQuantity" },
          totalAvailable: {
            $sum: {
              $subtract: [
                { $ifNull: ["$inventories.currentQuantity", 0] },
                { $ifNull: ["$inventories.reservedQuantity", 0] }
              ]
            }
          }
        }
      },
      {
        $addFields: {
          status: {
            $cond: [{ $gt: ["$totalAvailable", 0] }, "In stock", "Out of stock"]
          }
        }
      }
    ]);

    const filtered = status === 'completed'
      ? results.filter(r => r.status === 'In stock')
      : results;

    return handleSuccess('Get all product for order successful', filtered);
  } catch (error) {
    throw error;
  }
};

const handleDeleteProduct = async (userId, context, id = null) => {
  try {
    const product = (await handleGetOneProduct(id)).data;
    if (product.isActive !== 'draft') {
      throw createError.Forbidden('C2');
    }
    if (product.productCode) throw createError('C2')

    await db.Product.findByIdAndDelete(id);

    const { ipAddress, userAgent } = context

    const tasks = [];

    if (product.images && product.images.length !== 0) {
      tasks.push(cloudinary.handleDeleteImgs(product.images));
    }
    if (product.imagePrimary) {
      tasks.push(cloudinary.handleDeleteOneImg(product.imagePrimary));
    }
    tasks.push(
      auditLogHandle.createLog(userId, 'delete', 'product', id, null, null, ipAddress, userAgent)
    );

    Promise.allSettled(tasks).catch(console.error);

    return handleSuccess('Delete product successful');
  } catch (error) {
    throw error;
  }
};

const handleCreate = async (userId, context, data) => {
  const cleanupImages = async () => {
    if (data?.imagePrimary) {
      await cloudinary.handleDeleteOneImg(data.imagePrimary).catch(() => { });
    }
    if (data?.images) {
      await cloudinary.handleDeleteOneImg(data.images).catch(() => { });
    }
  };

  try {
    const { categoryService } = require("./index");

    if (!data.name || !Array.isArray(data.categoryIds) || data.categoryIds.length === 0 || !data.uom || !data.uomQuantity) {
      await cleanupImages();
      throw createError.BadRequest("B1");
    }

    const user = await db.User.findOne({ _id: userId, isActive: true }).populate(
      "companyId",
      "companyCode"
    )
    if (!user) {
      await cleanupImages();
      throw createError.NotFound("D3");
    }

    const [isExistingProduct] = await Promise.all([
      db.Product.findOne({ name: data.name, companyCode: user.companyId.companyCode, isActive: 'active' }),
      Promise.all(
        data.categoryIds.map((id) =>
          categoryService.handleGetOneCategory(id, { isActive: true })
        )
      ),
    ]);

    if (isExistingProduct) {
      await cleanupImages();
      throw createError.Conflict("F21");
    }

    data.companyCode = user.companyId.companyCode;
    data.userId = userId;

    if (data.images && data.images.length > 0) {
      data.imagePrimary = data.images[0];
      data.images = data.images.slice(1);
    }

    const newProduct = await db.Product.create(data);

    const { ipAddress, userAgent } = context
    Promise.resolve(
      auditLogHandle.createLog(userId, "create", "product", newProduct._id, null, null, ipAddress, userAgent))

    return handleSuccess("Product created successfully", { companyCode: data.companyCode });
  } catch (error) {
    await cleanupImages();
    throw error;
  }
};

const handleUpdateData = async (userId, context, id, data = {}, deleteImages = []) => {
  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      if (data.images?.length) {
        await cloudinary.handleDeleteImgs(data.images).catch(() => { });
      }
      throw createError.BadRequest("B6 B7");
    }
    const product = await db.Product.findById(id);
    if (!product || product.isActive === 'inactive') {
      if (data.images?.length) {
        await cloudinary.handleDeleteImgs(data.images);
      }
      throw createError.NotFound("F20 F24");
    }

    if (!product.productCode) {
      if (data.name) {
        const duplicateProduct = await db.Product.findOne({
          name: data.name,
          _id: { $ne: id },
        });
        if (duplicateProduct) {
          if (data.images?.length) {
            await cloudinary.handleDeleteImgs(data.images);
          }
          throw createError.Conflict("F18");
        }
      }

      if (data.categoryIds?.length) {
        const { categoryService } = require("./index");
        const categories = await Promise.all(
          data.categoryIds.map((id) =>
            categoryService.handleGetOneCategory(id, { isActive: true })
          )
        );
        data.categoryIds = categories
          .filter(c => c && c.data)
          .map(c => c.data._id)
      }
    }

    if (deleteImages?.length) {
      const imagesToDelete = product.images.filter((img) =>
        deleteImages.includes(img)
      );
      if (imagesToDelete.length) {
        await cloudinary.handleDeleteImgs(imagesToDelete).catch(() => { });
        product.images = product.images.filter(
          (img) => !deleteImages.includes(img)
        );
      }
    }
    if (data.images?.length) {
      data.images = [...product.images, ...data.images];
      if (product.imagePrimary == null) {
        data.imagePrimary = data.images[0];
        data.images = data.images.slice(1);
      }
    }

    const changedOld = {};
    const changedNew = {};
    for (const key of Object.keys(data)) {
      if (product[key] !== data[key]) {
        changedOld[key] = product[key];
        changedNew[key] = data[key];
      }
    }
    if (Object.keys(changedNew).length > 1 && !data.onChain) {
      data.isActive = 'draft';
    }

    if (data.isActive && data.isActive === 'sent' && (!product.gtin || product.description === null || !product.activeIngredient.length === 0 || product.storageConditions.length === 0)) {
      throw createError.BadRequest('F50')
    }
    await db.Product.findByIdAndUpdate(id, data);

    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, "update", "product", id, JSON.stringify(changedOld), JSON.stringify(changedNew), ipAddress, userAgent)

    return handleSuccess("Product updated successfully");
  } catch (error) {
    if (data.images?.length) {
      await cloudinary.handleDeleteImgs(data.images).catch(() => { });
    }
    throw error;
  }
};

const handleUpdatePrimaryImage = async (userId, context, id, imagePrimary) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }
    const product = (await (handleGetOneProduct(id))).data
    if (product.isActive === 'inactive') {
      await cloudinary.handleDeleteOneImg(imagePrimary).catch(() => { });
      throw createError.NotFound("F24");
    }
    const { ipAddress, userAgent } = context

    await Promise.all([
      db.Product.findByIdAndUpdate(id, { $set: { imagePrimary } }),
      cloudinary.handleDeleteOneImg(product.imagePrimary).catch(() => { }),
      auditLogHandle.createLog(userId, 'update', 'product', id, product.imagePrimary, imagePrimary, ipAddress, userAgent)
    ])

    return handleSuccess("Product imagePrimary updated successfully");
  } catch (error) {
    await cloudinary.handleDeleteOneImg(imagePrimary).catch(() => { });
    throw error;
  }
};

const handleApprovalProduct = async (userId, context, id, isActive) => {
  try {
    if (!['active', 'inactive'].includes(isActive)) {
      throw createError.BadRequest("B1");
    }

    const product = (await handleGetOneProduct(id)).data

    data = { isActive }
    if (!product.productCode && isActive === 'active' && product.isActive === 'sent') {
      data.txHash = cryptoHandle.hashData({ description: product.description, activeIngredient: cryptoHandle.cleanMongooseDoc(product.activeIngredient), route: product.route, storageConditions: cryptoHandle.cleanMongooseDoc(product.storageConditions) })
      data.productCode = await counterHandle("Product", "PRO");
    }

    await db.Product.findByIdAndUpdate(id, data);

    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, "update", "product", product._id, JSON.stringify(data), JSON.stringify(data), ipAddress, userAgent);

    return handleSuccess("Product approval successfully", { productCode: data.productCode, txHash: data.txHash });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOneProduct,
  handleGetAllProduct,
  handleGetAllProductForOrder,
  handleCreate,
  handleUpdateData,
  handleUpdatePrimaryImage,
  handleDeleteProduct,
  handleGetOneProduct,
  getProductByCode,
  handleApprovalProduct
}