const db = require("../models");
const createError = require("http-errors");
const { default: mongoose } = require("mongoose");
const { auditLogHandle, handleSuccess, counterHandle, cloudinary } = require("../utils/index");

const getOneBatch = async (id, fil = {}) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }
    fil.id = id;
    const batch = await db.Batch.findOne(fil);
    return batch;
  } catch (error) {
    throw error;
  }
};

const handleGetOneBatch = async (id) => {
  try {
    const batch = await getOneBatch(id);
    if (!batch) throw createError.NotFound('F23');
    return handleSuccess('Get batch successful', batch);
  } catch (error) {
    throw error;
  }
};

const handleGetBatchByCode = async (batchCode, select = null) => {
  try {
    let filter = { batchCode };
    let query = db.Batch.findOne(filter);
    if (select) query = query.select(select);

    const batch = await query
    if (!batch) throw createError.NotFound('F23');
    return handleSuccess('Get batch successful', batch);
  } catch (error) {
    throw error;
  }
};

const handleGetAllBatch = async (fil = {}) => {
  try {
    const batchs = await db.Batch.find(fil);
    return handleSuccess('Get all batchs successful', batchs);
  } catch (error) {
    throw error;
  }
};

const handleGetAllBatchByCompany = async (companyId) => {
  try {
    const batchs = await db.Batch.find({ ownerCompanyId: new mongoose.Types.ObjectId(companyId) }).select('-ownerCompanyId');
    return handleSuccess('Get all batchs by company successful', batchs);
  } catch (error) {
    throw error;
  }
};

const handleCreate = async (userId, context, manufacturerId, data) => {
  try {
    const { companyService, productService } = require('./index')
    const [product, company] = await Promise.all([
      productService.getProductByCode(data.productCode),
      companyService.handleGetOneCompany(manufacturerId)
    ])
    if (!product) {
      throw createError.Conflict('F20');
    }
    if (company.data) {
      data.manufacturerId = manufacturerId
      data.ownerCompanyId = [manufacturerId]
    }

    data.batchCode = await counterHandle('Batch', 'BATCH')
    // Tạo mới
    const newBatch = await db.Batch.create(data)

    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'create', 'batch', newBatch._id, null, null, ipAddress, userAgent)

    return handleSuccess('Batch created successfully', { batchCode: data.batchCode });
  } catch (error) {
    throw error;
  }
};

const handleUpdateData = async (userId, context, batchCode, deleteImages = [], data = {}) => {
  try {
    const oldBatch = await db.Batch.findOne({ batchCode }).lean();
    if (!oldBatch) {
      if (data.images?.length) await Promise.resolve(cloudinary.handleDeleteImgs(data.images));
      throw createError.NotFound("F23");
    }
    if (oldBatch.state === 'IN_STOCK') {
      throw createError.Conflict("F25");
    }

    let newImages = oldBatch.images || [];
    if (deleteImages?.length) {
      const imagesToDelete = newImages.filter((img) => deleteImages.includes(img));
      if (imagesToDelete.length) {
        Promise.resolve(cloudinary.handleDeleteImgs(imagesToDelete)).catch(() => { });
        newImages = newImages.filter((img) => !deleteImages.includes(img));
      }
    }
    if (data.images?.length) newImages = [...newImages, ...data.images];

    const mergedData = { ...data, images: newImages };
    const changedOld = {};
    const changedNew = {};
    for (const key of Object.keys(mergedData)) {
      if (String(oldBatch[key]) !== String(mergedData[key])) {
        changedOld[key] = oldBatch[key];
        changedNew[key] = mergedData[key];
      }
    }
    mergedData.state = 'DRAFT';
    await db.Batch.updateOne({ batchCode }, { $set: mergedData });

    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, "update", "batch", oldBatch._id, JSON.stringify(changedOld), JSON.stringify(changedNew), ipAddress, userAgent)

    return handleSuccess("Batch updated successfully");
  } catch (error) {
    if (data.images?.length) await Promise.resolve(cloudinary.handleDeleteImgs(data.images));
    throw error;
  }
};

const handleApproval = async (userId, context, batchCode, isActive = true, state = null) => {
  try {
    const batch = (await handleGetBatchByCode(batchCode)).data;
    let updateData = { isActive }
    if (state) updateData.state = state
    await db.Batch.updateOne({ batchCode }, { $set: updateData });

    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, "approval", "batch", batch._id, JSON.stringify(batch.isActive), JSON.stringify(isActive), ipAddress, userAgent)

    return handleSuccess("Approval batch successfully");
  } catch (error) {
    throw error;
  }
};

const handleUpdateState = async ({ userId, context, batchCode, state = null, forceRecall = false, locationId = null, companyId }) => {
  try {
    const { inventoryService, inventoryHistoryService, notificationService, userService, companyService } = require('./index');
    const batch = (await handleGetBatchByCode(batchCode)).data;
    if (!batch) throw createError.NotFound('F23');
    if (batch.state === 'DRAFT') throw createError.BadRequest('F83');
    if (!batch.isActive && state !== 'DRAFT') throw createError.BadRequest('F84');

    let updateData = { state };

    // CASE: RECALL
    if (state === 'RECALL') {
      const activeOrders = await db.Order.find({
        'batch.batchCode': batchCode,
        status: { $nin: ['unreceived', 'delivered', 'goods_received', 'canceled', 'rejected'] }
      }).lean();

      if (activeOrders.length > 0 && !forceRecall) {
        await db.Batch.updateOne({ batchCode }, { $set: { state: 'RECALL_PENDING' } });
        return handleSuccess('Batch set to recall pending due to active orders');
      }

      // Xử lý các shipment liên quan
      const shipments = await db.Shipment.find({ 'batches.batchCode': batchCode }).lean();

      for (const ship of shipments) {
        const thisBatch = ship.batches.find(b => b.batchCode === batchCode);
        const otherBatches = ship.batches.filter(b => b.batchCode !== batchCode);

        // 🔹 Tìm tất cả đơn hàng liên quan tới shipment này
        const relatedOrders = await db.Order.find({ orderCode: ship.orderCode }).lean();
        if (!relatedOrders || relatedOrders.length === 0) continue;

        // 🔸 Kiểm tra nếu có bất kỳ dòng sản phẩm nào của đơn hàng đang ở trạng thái "chưa giao"
        const hasUnshippedOrder = relatedOrders.some(o =>
          ['unreceived', 'order_received', 'processing'].includes(o.status)
        );

        if (hasUnshippedOrder) {
          // 🟡 Gửi thông báo cho công ty nhận hàng rằng lô này bị recall khi đơn chưa giao
          const company = (await companyService.handleGetOneCompany(ship.toCompanyId)).data;
          const user = await userService.getUserByCompanyAndRole(company);

          await notificationService.handleCreate({
            userId: null,
            context: null,
            data: {
              title: 'Batch recall notice',
              message: `Batch ${batchCode} has been recalled before shipment (order: ${ship.orderCode}).`,
              type: 'recall',
              relatedEntityType: 'batch',
              relatedEntityId: batch._id
            },
            recipientId: user._id
          });

          continue; // Không xử lý shipment này nữa
        }

        // 🟢 Nếu shipment có nhiều lô → tách lô recall ra thành shipment riêng
        if (otherBatches.length > 0) {
          await db.Shipment.updateOne(
            { _id: ship._id },
            { $set: { batches: otherBatches } }
          );

          await db.Shipment.create({
            shipCode: ship.shipCode + '-RECALL',
            fromCompanyId: ship.toCompanyId,
            toCompanyId: batch.manufacturerId,
            batches: [thisBatch],
            status: 'delivering', // đang giao trả về NSX
            createdBy: userId
          });

          continue;
        }

        // 🔴 Nếu shipment chỉ có 1 lô → cập nhật sang trạng thái recall
        await db.Shipment.updateOne(
          { _id: ship._id },
          { $set: { status: 'recall', shipCode: ship.shipCode + '-RECALL' } }
        );

        const company = (await companyService.handleGetOneCompany(ship.toCompanyId)).data;
        const user = await userService.getUserByCompanyAndRole(company);

        await notificationService.handleCreate({
          userId: null,
          context: null,
          data: {
            title: 'Batch recall in transit',
            message: `Shipment ${ship.shipCode} containing batch ${batchCode} has been marked for recall.`,
            type: 'recall',
            relatedEntityType: 'shipment',
            relatedEntityId: ship._id
          },
          recipientId: user._id
        });
      }

      // Cập nhật tồn kho: xuất hàng khỏi các kho và nhập về kho recall NSX
      const inventories = await db.Inventory.find({ batchCode }).lean();
      if (!locationId) throw createError.BadRequest('F85: Missing recall location');

      for (const inv of inventories) {
        await db.Inventory.updateOne({ _id: inv._id }, { $set: { isActive: 'inactive' } });
        await inventoryHistoryService.handleCreate(userId, inv.companyId, inv._id, batchCode, inv.locationId, inv.currentQuantity, inv.uom, 'export', 'Batch recalled', companyId, null);
        await inventoryService.handleCreate(userId, context, batch.manufacturerId, locationId, batchCode, inv.uom, inv.currentQuantity);
        await inventoryHistoryService.handleCreate(userId, batch.manufacturerId, null, batchCode, locationId, inv.currentQuantity, inv.uom, 'import', 'Batch recalled received', inv.companyId, null);
      }

      updateData = { ...updateData, isActive: false, recallDate: new Date() };
    }

    if (state === 'IN_PRODUCTION') updateData.manufactureDate = new Date();

    await db.Batch.updateOne({ batchCode }, { $set: updateData });

    const { ipAddress, userAgent } = context;
    await auditLogHandle.createLog(userId, 'update', 'batch', batch._id, JSON.stringify(batch.state), JSON.stringify(state), ipAddress, userAgent);

    return handleSuccess('Batch updated state successfully');
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOneBatch,
  handleGetAllBatch,
  handleGetAllBatchByCompany,
  handleGetBatchByCode,
  handleCreate,
  handleUpdateData,
  handleGetOneBatch,
  handleUpdateState,
  handleApproval
}


