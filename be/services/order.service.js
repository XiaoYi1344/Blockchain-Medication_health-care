const db = require("../models");
const createError = require("http-errors");
const { default: mongoose } = require("mongoose");
const { auditLogHandle, handleSuccess, counterHandle } = require("../utils/index");
const pLimit = require('p-limit').default;

const getOneOrder = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }

    const order = await db.Order.findById(id);
    return order;
  } catch (error) {
    throw error;
  }
};

const handleGetOneOrder = async (id) => {
  try {
    const order = await getOneOrder(id);
    if (!order) throw createError.NotFound('F43');
    return handleSuccess('Get order successful', order);
  } catch (error) {
    throw error;
  }
};

const handleGetOneOrderByOrderCode = async (orderCode) => {
  try {
    const order = await db.Order.aggregate([
      { $match: { orderCode } },

      {
        $group: {
          _id: "$orderCode",
          fromCompanyId: { $first: "$fromCompanyId" },
          toCompanyId: { $first: "$toCompanyId" },
          status: { $first: "$status" },
          completeDate: { $first: "$completeDate" },
          txHash: { $first: "$txHash" },
          products: {
            $push: {
              productCode: "$productCode",
              batch: "$batch",
              productQuantity: "$quantity"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          orderId: "$_id",
          fromCompanyId: 1,
          toCompanyId: 1,
          status: 1,
          completeDate: 1,
          txHash: 1,
          products: 1
        }
      }
    ]);
    if (!order) throw createError.NotFound('F43');
    return handleSuccess('Get order by orderCode successful', order);
  } catch (error) {
    throw error;
  }
};

const handleGetOrders = async ({ userId, companyId, mode = "created", orderCode = null }) => {
  try {
    let query = {};

    switch (mode) {
      case "created":
        query = { createdBy: new mongoose.Types.ObjectId(userId) };
        break;

      case "received":
        query = {
          fromCompanyId: new mongoose.Types.ObjectId(companyId),
          receivedBy: new mongoose.Types.ObjectId(userId)
        };
        break;

      case "unreceived":
        query = {
          fromCompanyId: new mongoose.Types.ObjectId(companyId),
          receivedBy: { $exists: false },
          status: mode
        };
        break;

      case "update_order":
        query = {
          fromCompanyId: new mongoose.Types.ObjectId(companyId),
          orderCode,
        };
        break;

      default:
        throw createError.BadRequest("A1");
    }
    if (orderCode) {
      query.orderCode = orderCode;
    }

    const orders = await db.Order.aggregate([
      { $match: query },

      {
        $group: {
          _id: "$orderCode",
          fromCompanyId: { $first: "$fromCompanyId" },
          toCompanyId: { $first: "$toCompanyId" },
          status: { $first: "$status" },
          completeDate: { $first: "$completeDate" },
          txHash: { $first: "$txHash" },
          products: {
            $push: {
              productCode: "$productCode",
              batch: "$batch",
              productQuantity: "$quantity"
            }
          },
          createdBy: { $first: "$createdBy" }
        }
      },
      {
        $project: {
          _id: 0,
          orderCode: "$_id",
          fromCompanyId: 1,
          toCompanyId: 1,
          status: 1,
          completeDate: 1,
          txHash: 1,
          products: 1,
          createdBy: 1
        }
      }
    ]);

    return handleSuccess(`Get all ${mode} orders successfully`, orders);
  } catch (error) {
    throw error;
  }
};

const handleReceivedOrder = async (userId, context, orderCode, companyId, status = 'order_received') => {
  try {
    if (status !== 'order_received' && status !== 'reject') throw createError.BadRequest('F74')
    await db.Order.updateMany({ orderCode }, { fromCompanyId: companyId, receivedBy: userId, status })

    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'received', 'order', orderCode, null, null, ipAddress, userAgent);

    return handleSuccess('Order received successfully');
  } catch (error) {
    throw error;
  }
};

const handleUpdateData = async (userId, context, orderCode, data, status, companyId, txHash) => {
  try {
    let updateData = {}
    const oldDoc = ((await handleGetOrders({ userId, orderCode, companyId, mode: 'received' })).data)[0];
    if (!oldDoc) throw createError.NotFound('F73')
    if (companyId) {
      const company = await db.Company.findById(oldDoc.fromCompanyId);
      if (company?._id.toString() !== companyId.toString())
        throw createError.Forbidden('C2');
    }
    if (status) {
      const check = await checkStatusTransition(oldDoc, status, companyId);
      if (check) {
        updateData.status = status;
        const { notificationService } = require('./index')
        await notificationService.handleCreate({ userId, context, data: { title: "Your order has been updated.", message: `Your order ${oldDoc.orderCode} is currently ${status}.`, type: 'order', relatedEntityType: 'order' }, recipientId: oldDoc.createdBy })
      }
    }
    if (txHash) updateData.txHash = txHash

    let errBatch = []
    if (data && data.length !== 0 && oldDoc.status === 'processing') {
      errBatch = await createBatch(oldDoc, data, companyId)

      if (errBatch.length) {
        return handleSuccess(`Order updated with some invalid batches: ${errBatch.join(', ')}`, null);
      }
    }

    if (Object.keys(updateData).length !== 0) {
      await db.Order.updateMany({ orderCode }, updateData);
    }

    const changedOld = {};
    const changedNew = {};
    for (const key of Object.keys(updateData)) {
      if (oldDoc[key] !== updateData[key]) {
        changedOld[key] = oldDoc[key];
        changedNew[key] = updateData[key];
      }
    }

    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'update', 'order', orderCode, JSON.stringify(changedOld), JSON.stringify(changedNew), ipAddress, userAgent);

    return handleSuccess('Order updated successfully');
  } catch (error) {
    throw error;
  }
};

const createBatch = async (oldDoc, data, companyId) => {
  try {
    const errBatch = [];
    const allBatchCodes = data.flatMap(i => i.batch.map(b => b.batchCode));
    const companyObjectId = mongoose.Types.ObjectId.isValid(companyId)
      ? new mongoose.Types.ObjectId(companyId)
      : companyId;

    const [allBatches, allInventories] = await Promise.all([
      db.Batch.find({
        batchCode: { $in: allBatchCodes },
        isActive: true,
        manufacturerId: companyObjectId
      }).lean(),
      db.Inventory.find({
        batchCode: { $in: allBatchCodes },
        companyId: companyObjectId,
        isActive: 'active'
      }).lean()
    ]);

    const recalledBatches = allBatches.filter(b => ['RECALL', 'RECALL_PENDING'].includes(b.state));
    if (recalledBatches.length > 0) {
      const recalledCodes = recalledBatches.map(b => b.batchCode).join(', ');
      throw createError.BadRequest(`F49: Batch ${recalledCodes} đang trong quá trình thu hồi`);
    }

    const batchMap = new Map(allBatches.map(b => [b.batchCode, b]));
    const inventoryMap = allInventories.reduce((acc, inv) => {
      (acc[inv.batchCode] ??= []).push(inv);
      return acc;
    }, {});
    const productMap = new Map(oldDoc.products.map(o => [o.productCode, o]));

    for (const item of data) {
      for (const b of item.batch)
        if (!batchMap.has(b.batchCode)) throw createError.BadRequest(`F48: ${b.batchCode}`);

      const product = productMap.get(item.productCode);
      if (!product) throw createError.NotFound(`F20: ${item.productCode}`);

      const newQty = item.batch.reduce((s, b) => s + b.quantity, 0);
      const existQty = (product.batch || []).reduce((s, b) => s + (b.quantity || 0), 0);
      if (newQty + existQty > product.productQuantity)
        throw createError.BadRequest(`F44: ${item.productCode}`);
    }

    const bulkOpsInv = [];
    const bulkOpsOrder = [];
    const limit = pLimit(10);

    await Promise.all(
      data.map(item =>
        limit(async () => {
          const validBatches = item.batch.filter(b => {
            const found = batchMap.get(b.batchCode);
            if (!found || found.expectedQuantity < b.quantity) {
              errBatch.push(b.batchCode);
              return false;
            }
            return true;
          });
          for (const batchItem of validBatches) {
            const inventories = inventoryMap[batchItem.batchCode] || [];
            let remaining = batchItem.quantity;

            for (const inv of inventories) {
              if (remaining <= 0) break;

              const available = inv.currentQuantity - (inv.reservedQuantity || 0);
              if (available <= 0) continue;

              const reserve = Math.min(available, remaining);

              bulkOpsInv.push({
                updateOne: {
                  filter: { _id: inv._id },
                  update: { $inc: { reservedQuantity: reserve } }
                }
              });

              const filterBase = {
                orderCode: oldDoc.orderCode,
                fromCompanyId: companyId,
                productCode: item.productCode
              };
              bulkOpsOrder.push(
                {
                  updateOne: {
                    filter: { ...filterBase, 'batch.batchCode': batchItem.batchCode, 'batch.locationId': inv.locationId },
                    update: { $inc: { 'batch.$.reservedQuantity': reserve, 'batch.$.quantity': batchItem.quantity } }
                  }
                },
                {
                  updateOne: {
                    filter: {
                      ...filterBase,
                      batch: { $not: { $elemMatch: { batchCode: batchItem.batchCode, locationId: inv.locationId } } }
                    },
                    update: {
                      $push: { batch: { batchCode: batchItem.batchCode, locationId: inv.locationId, reservedQuantity: reserve, quantity: batchItem.quantity } }
                    }
                  }
                }
              );

              remaining -= reserve;
            }

            if (!inventories.length) {
              bulkOpsOrder.push({
                updateOne: {
                  filter: {
                    orderCode: oldDoc.orderCode,
                    fromCompanyId: companyId,
                    productCode: item.productCode,
                    'batch.batchCode': { $ne: batchItem.batchCode }
                  },
                  update: { $push: { batch: { batchCode: batchItem.batchCode, reservedQuantity: 0, quantity: batchItem.quantity } } }
                }
              });
            }

            if (remaining > 0) batchItem.remainingQuantity = remaining;
          }
        })
      )
    );

    if (bulkOpsInv.length) await db.Inventory.bulkWrite(bulkOpsInv);
    if (bulkOpsOrder.length) await db.Order.bulkWrite(bulkOpsOrder);
    return errBatch;
  } catch (error) {
    throw error;
  }
};

const checkStatusTransition = async (oldDoc, newStatus, companyId) => {
  const finalStatuses = ['canceled', 'rejected', 'goods_received'];
  const validOrderFlow = ['order_received', 'processing', 'delivering', 'delivered', 'goods_received'];
  const canCancel = ['order_received', 'inproduction', 'instock', 'processing']

  if (finalStatuses.includes(oldDoc.status)) {
    throw createError.BadRequest('F37');
  }
  if (finalStatuses.includes(newStatus)) {
    if (canCancel.includes(oldDoc.status))
      return true
    else
      throw createError.BadRequest('F66')
  }

  const currentIndex = validOrderFlow.indexOf(oldDoc.status);
  const nextIndex = validOrderFlow.indexOf(newStatus);
  if (nextIndex === -1) {
    throw createError.BadRequest('F38');
  }

  if (nextIndex !== currentIndex + 1) {
    throw createError.BadRequest('F46');
  }

  if (newStatus === 'delivering') {
    //kiểm tra lô tồn tại
    const hasEmptyBatch = oldDoc.products.some(p => !p.batch || p.batch.length === 0);
    if (hasEmptyBatch) {
      throw createError.BadRequest('F39');
    }

    for (const product of oldDoc.products) {
      const totalBatchQuantity = (product.batch || []).reduce((sum, b) => sum + (b.quantity || 0), 0);
      if (totalBatchQuantity !== product.productQuantity) {
        throw createError.BadRequest(
          `F47: ${product.productCode}`
        );
      }
    }

    //kiểm tra shipment
    const shipment = await db.Shipment.findOne({ orderCode: oldDoc.orderCode, status: { $in: ['delivering', 'delivered', 'goods_received'] } });
    if (!shipment) {
      throw createError.BadRequest('F41');
    }
  }

  if (newStatus === 'delivered') {
    const shipments = await db.Shipment.find({ orderCode: oldDoc.orderCode });
    const allDelivered = shipments.every(s => s.status === 'delivered');

    if (!allDelivered) {
      throw createError.BadRequest('F65');
    }
  }

  if (newStatus === 'goods_received' && oldDoc.status !== 'delivered') {
    throw createError.BadRequest('F37');
  }

  return true;
};

const handleCancelOrder = async (userId, context, orderCode, status, companyId) => {
  try {
    const { inventoryService } = require('./index');

    const oldDoc = (await handleGetOneOrderByOrderCode(orderCode)).data;
    if (companyId) {
      const company = await db.Company.findById(oldDoc.toCompanyId);
      if (company._id.toString() !== companyId.toString())
        throw createError.Forbidden('C2');
    }
    if (oldDoc.status === 'canceled')
      throw createError.BadRequest('F35')
    if (oldDoc.status === 'delivering' || oldDoc.status === 'delivered' || oldDoc.status === 'rejected' || oldDoc.status === 'goods_received')
      throw createError.BadRequest('F36')

    if (oldDoc.batch?.length) {
      await Promise.all(
        oldDoc.batch.map(batchItem =>
          inventoryService.releaseInventory(userId, oldDoc.fromCompanyId, batchItem.batchCode, batchItem.locationId, batchItem.quantity, 'order_canceled', oldDoc.toCompanyId, null, orderCode))
      );

      if (oldDoc.status === 'processing') {
        await db.Shipment.updateMany(
          { orderId: oldDoc.orderCode },
          { isActive: false }
        );
      }
    }

    await db.Order.findOneAndUpdate({ orderCode }, { status })
    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'update', 'order', oldDoc._id, JSON.stringify({ status: oldDoc.status }), JSON.stringify({ status: 'cancel' }), ipAddress, userAgent)

    return handleSuccess("Order cancel successfully");
  } catch (error) {
    throw error;
  }
};

const handleCreate = async (userId, context, companyId, buy, data) => {
  try {
    const { companyService, sellerCustomService, productService } = require('./index');

    if (data.fromCompanyId) {
      const company = await companyService.handleGetOneCompany(data.fromCompanyId);
      if (company.data.isActive === false) {
        throw createError.BadRequest('F34');
      }
    }
    const relationship = await sellerCustomService.getOneSeller(data.fromCompanyId, companyId)
    if (relationship && relationship.status === 'block') throw createError.BadRequest('F69')

    const products = await Promise.all(
      buy.map(p => productService.getProductByCode(p.productCode, 'active', true))
    );

    if (products.some(p => !p)) {
      throw createError.BadRequest(`F78: invalid ${p.productCode}`);
    }

    const orderCode = await counterHandle('Order', 'ORDER')
    // Tạo mới
    const newOrders = await Promise.all(
      buy.map(item => {
        const dataOrder = {
          ...data,
          quantity: item.quantity,
          productCode: item.productCode,
          orderCode,
          createdBy: userId,
          toCompanyId: companyId
        };
        return db.Order.create(dataOrder);
      })
    );

    const orderIds = newOrders.map(order => order._id);

    const { ipAddress, userAgent } = context
    await Promise.all(
      orderIds.map(orderId =>
        auditLogHandle.createLog(userId, 'create', 'order', orderId, null, null, ipAddress, userAgent)),
      await sellerCustomService.handleCreate(companyId, data.fromCompanyId)
    );

    return handleSuccess('Order created successfully', orderCode);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOneOrder,
  handleGetOrders,
  handleGetOneOrderByOrderCode,
  handleCreate,
  handleUpdateData,
  handleCancelOrder,
  handleGetOneOrder,
  handleReceivedOrder
}


