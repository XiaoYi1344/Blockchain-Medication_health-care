const db = require("../models");
const createError = require("http-errors");
const { handleSuccess } = require("../utils");

const handleTraceability = async (batchCode) => {
  try {
    const { productService } = require("./index");

    const batch = await db.Batch.findOne({
      batchCode,
      isActive: true,
      state: { $ne: "DRAFT" },
    }).lean();

    if (!batch) throw createError.NotFound("F23");
    if (["DRAFT", "APPROVAL"].includes(batch.state))
      throw createError.BadRequest("F79");
    if (batch.state === 'RECALL') throw createError.BadRequest("F80");
    
    const productPromise = productService.getProductByCode(
      batch.productCode,
      "active",
      true
    );

    const manufacturerPromise = db.Company.findOne({
      _id: batch.manufacturerId,
      isActive: "active",
    }).lean();

    const [product, manufacturer] = await Promise.all([
      productPromise,
      manufacturerPromise,
    ]);

    if (!product) throw createError.NotFound("F20");
    if (!manufacturer) throw createError.NotFound("F20");

    const [licenses, categories, hospitals] = await Promise.all([
      db.CompanyDocument.find({
        companyId: manufacturer._id,
        status: "active",
      }).lean(),
      db.Category.find({ companyId: manufacturer._id }).lean(),
      db.Company.find({
        _id: { $in: batch.ownerCompanyId },
        type: "hospital",
      }).lean(),
    ]);

    const result = {
      product: {
        _id: product._id,
        productCode: product.productCode,
        name: product.name,
        description: product.description,
        uom: product.uom,
        uomQuantity: product.uomQuantity,
        images: product.images,
        imagePrimary: product.imagePrimary,
        txHash: product.txHash,
        gtin: product.gtin,
        activeIngredient: product.activeIngredient,
        route: product.route,
        storageConditions: product.storageConditions,
        type: product.type,
        categoryIds: product.categoryIds,
      },
      batch: {
        _id: batch._id,
        batchCode: batch.batchCode,
        manufactureDate: batch.manufactureDate,
        EXP: batch.EXP,
        initialQuantity: batch.initialQuantity,
        state: batch.state,
      },
      manufacturer: {
        _id: manufacturer._id,
        name: manufacturer.name,
        companyCode: manufacturer.companyCode,
        location: manufacturer.location,
        phone: manufacturer.phone,
        images: manufacturer.images,
        licenseDocuments: licenses.map((doc) => ({
          _id: doc._id,
          name: doc.name,
          type: doc.type,
          licenseId: doc.licenseId,
          images: doc.images || [],
          txHash: doc.txHash,
          expiryDate: doc.expiryDate,
          createdAt: doc.createdAt,
        })),
      },
      categories: categories || [],
      hospitals: (hospitals || []).map(
        ({ _id, name, location, phone, images, companyCode }) => ({
          _id,
          name,
          location,
          phone,
          images,
          companyCode,
        })
      ),
    };

    return handleSuccess("Traceability successful", result);
  } catch (error) {
    throw error;
  }
};

module.exports = { handleTraceability };