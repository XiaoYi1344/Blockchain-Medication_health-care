const db = require("../models");
const createError = require("http-errors");
const handleSuccess = require("../utils/success.util");
const { default: mongoose } = require("mongoose");
const auditLogHandle = require("../utils/auditLog.util");

const getOneInventory = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }

    const inventory = await db.Inventory.findById(id);
    return inventory;
  } catch (error) {
    throw error;
  }
};

const handleGetOneInventory = async (id) => {
  try {
    const inventory = await getOneInventory(id);
    if (!inventory) throw createError.NotFound('F29');
    return handleSuccess('Get inventory successful', inventory);
  } catch (error) {
    throw error;
  }
};

const handleGetInventoryByBatchCode = async (batchCode, companyId) => {
  try {
    const inventory = await db.Inventory.find({ batchCode, companyId, isActive: 'active' })
    return handleSuccess('Get inventory successful', inventory || []);
  } catch (error) {
    throw error;
  }
};

const handleGetAllInventoryByCompany = async (companyId) => {
  try {
    const inventorys = await db.Inventory.aggregate([
      { $match: { companyId: new mongoose.Types.ObjectId(companyId) } },
      {
        $lookup: {
          from: 'locations',
          localField: 'locationId',
          foreignField: '_id',
          as: 'location'
        }
      },
      { $unwind: "$location" },
      {
        $group: {
          _id: '$locationId',
          locationName: { $first: '$location.name' },
          inventories: {
            $push: {
              _id: '$_id',
              batchCode: '$batchCode',
              currentQuantity: '$currentQuantity',
              uom: '$uom',
              isActive: '$isActive'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          locationId: '$_id',
          locationName: 1,
          inventories: 1
        }
      }
    ])
    return handleSuccess('Get all inventorys by company successful', inventorys);
  } catch (error) {
    throw error;
  }
};

const reserveInventory = async (companyId, batchCode, locationId, quantity) => {
  try {
    if (quantity <= 0) throw createError.BadRequest('B18');

    const inventory = await db.Inventory.findOne({ companyId, batchCode, locationId });
    if (!inventory) throw createError.NotFound('F29');

    if (inventory.currentQuantity - inventory.reservedQuantity < quantity) {
      throw createError.BadRequest('F30');
    }

    await db.Inventory.updateOne(
      { _id: inventory._id }, { $inc: { reservedQuantity: quantity } }
    );

    return handleSuccess("Reserved inventory successfully");
  } catch (error) {
    throw error;
  }
};

const releaseInventory = async (userId, companyId, batchCode, locationId, quantity, type = 'order_success', relatedCompanyId = null, relatedShipmentId = null) => {
  try {
    if (quantity <= 0) throw createError.BadRequest('B18');

    const inventory = await db.Inventory.findOne({ companyId, batchCode, locationId });
    if (!inventory) throw createError.NotFound('F29');

    if (inventory.reservedQuantity < quantity) {
      throw createError.BadRequest('F32');
    }

    await db.Inventory.updateOne(
      { _id: inventory._id },
      { $inc: { reservedQuantity: -quantity } }
    );

    if (type === 'order_success') {
      await handleExportProduct(userId, companyId, batchCode, locationId, quantity, inventory.uom, 'Order fulfilled', 'export', relatedCompanyId, relatedShipmentId);
    }

    return handleSuccess("Released reserved inventory successfully");
  } catch (error) {
    throw error;
  }
};

const handleExportProduct = async (userId, context, companyId, batchCode, locationId, quantity, reason, type, relatedCompanyId = null, relatedShipmentId = null) => {
  try {
    if (quantity <= 0) throw createError.BadRequest('B18');

    const { inventoryHistoryService } = require('./index');
    const inventory = await db.Inventory.findOne({ companyId, batchCode, locationId });
    if (!inventory) throw createError.NotFound('F29');

    const totalReserved = inventory.reservedQuantity
    if (inventory.currentQuantity - totalReserved < quantity) {
      throw createError.BadRequest('F30');
    }
    if (relatedShipmentId) {
      const shipment = await db.Shipment.findOne({ _id: relatedShipmentId })
      const foundBatch = shipment.batches.find(b => b.batchCode === batchCode);
      if (!foundBatch) {
        throw createError.BadRequest(`F61: ${batchCode}`);
      }
      if (quantity > foundBatch.quantity) {
        throw createError.BadRequest('F60');
      }

      await db.Order.updateOne({ orderCode: shipment.orderCode, 'batch.batchCode': batchCode, 'batch.locationId': locationId },
        { $set: { 'batch.$[b].isExport': true } },
        { arrayFilters: [{ 'b.batchCode': batchCode, 'b.locationId': locationId }] })
    }

    const changedOld = { currentQuantity: inventory.currentQuantity };
    const changedNew = { currentQuantity: inventory.currentQuantity - quantity };
    const { ipAddress, userAgent } = context

    await Promise.all([
      db.Inventory.updateOne({ _id: inventory._id }, { $inc: { currentQuantity: -quantity, reservedQuantity: -quantity } }),
      inventoryHistoryService.handleCreate(userId, companyId, inventoryId = inventory._id, batchCode, locationId, quantity, uom = inventory.uom, type, reason = reason || type, relatedCompanyId, relatedShipmentId),
      auditLogHandle.createLog(userId, type, 'inventory', inventory._id, JSON.stringify(changedOld), JSON.stringify(changedNew), ipAddress, userAgent)
    ]);

    return handleSuccess("Inventory exported successfully");
  } catch (error) {
    throw error;
  }
};

const handleCreate = async (userId, context, companyId, locationId, batchCode, uom, currentQuantity) => {
  try {
    if (currentQuantity < 0) throw createError.BadRequest('B18');
    const { locationService, batchService, inventoryHistoryService } = require('./index');

    const [location, batch, inventory] = await Promise.all([
      locationService.getOneLocation(locationId),
      batchService.handleGetBatchByCode(batchCode),
      db.Inventory.findOne({ companyId, locationId, batchCode })
    ]);

    if (!location || !batch.data) throw createError.NotFound('F27 F23');
    if (inventory) throw createError.Conflict('F28');
    if (location.maximum < location.currentQuantity + currentQuantity) throw createError.BadRequest('F33');
    if (location.companyId.toString() !== companyId || !batch.data.ownerCompanyId.some(id => id.toString() === companyId.toString()))
      throw createError.Forbidden('C2');

    const product = await db.Product.findOne({ productCode: batch.data.productCode, onChain: true, isActive: 'active' })
    if (!product) throw createError.NotFound('F20')
    const data = { companyId, locationId, batchCode, uom: uom || 'box', currentQuantity };

    // --- Kiểm tra đơn hàng đang chờ
    const companyObjectId = mongoose.Types.ObjectId.isValid(companyId)
      ? new mongoose.Types.ObjectId(companyId)
      : companyId;

    const orders = await db.Order.find({
      'batch.batchCode': batchCode,
      fromCompanyId: companyObjectId,
      status: { $in: ['order_received', 'inproduction'] }
    })
      .sort({ createdAt: 1 })
      .lean();

    let bulkOps = [];
    let available = currentQuantity;

    if (orders.length) {
      for (const order of orders) {
        if (available <= 0) break;

        for (const b of order.batch) {
          if (b.batchCode !== batchCode) continue;
          if (available <= 0) break;
          let reserve = b.quantity - (b.reservedQuantity || 0);
          if (reserve <= 0) continue;

          const canReserve = Math.min(reserve, available);
          available -= canReserve;
          bulkOps.push({
            updateOne: {
              filter: { _id: order._id },
              update: {
                $inc: { 'batch.$[b].reservedQuantity': canReserve },
                $set: { 'batch.$[b].locationId': locationId }
              },
              arrayFilters: [{ 'b.batchCode': batchCode }]
            }
          });
        }
      }
    }

    if (bulkOps.length > 0) {
      await db.Order.bulkWrite(bulkOps);
    }
    data.reservedQuantity = currentQuantity - available;

    let updateData = { $inc: { initialQuantity: currentQuantity } }
    if (batch.data.state !== 'IN_PRODUCTION') {
      updateData.state = 'IN_PRODUCTION'
    }
    if (batch.data.initialQuantity + currentQuantity >= batch.data.expectedQuantity)
      updateData.state = 'IN_STOCK'

    const newInventory = await db.Inventory.create(data)
    await Promise.all([
      locationService.handleIncreaseQuantity(locationId, currentQuantity),
      db.Batch.updateOne({ _id: batch.data._id }, updateData),
      inventoryHistoryService.handleCreate(userId, companyId, newInventory._id, batchCode, locationId, currentQuantity, data.uom, 'import', 'New inventory created', null, null)
    ])
    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'create', 'inventory', newInventory._id, null, null, ipAddress, userAgent)

    return handleSuccess('Inventory created successfully');
  } catch (error) {
    throw error;
  }
};

const handleUpdateData = async (userId, context, id, data, companyId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }
    const oldDoc = await getOneInventory(id)
    if (!oldDoc) throw createError.NotFound('F29');
    if (companyId) {
      if (oldDoc.companyId.toString() !== companyId) {
        throw createError.Forbidden('C2');
      }
    }
    if (data.currentQuantity) {
      data.currentQuantity = oldDoc.currentQuantity + data.currentQuantity
      if (data.currentQuantity < 0) throw createError.BadRequest('F59')
      if (data.currentQuantity === 0) {
        const inventories = await db.Inventory.findOne({
          batchCode: oldDoc.batchCode,
          _id: { $ne: oldDoc._id },
          currentQuantity: { $gt: 0 }
        });
        if (!inventories) await db.Batch.updateOne({ batchCode: oldDoc.batchCode }, { state: 'SOLD_OUT' })
      }
    }

    await db.Inventory.findByIdAndUpdate(id, data)
    let type = 'adjustment', quantity = Math.abs((data.currentQuantity || oldDoc.currentQuantity) - oldDoc.currentQuantity)
    if (data.locationId) {
      type = 'transfer'
      quantity = 0
      const location = await db.Location.findById(data.locationId)
      if (!location) throw createError.NotFound('F27');
      if (location.currentQuantity < oldDoc.currentQuantity) throw createError.BadRequest('F33');
      if (location.companyId.toString() !== oldDoc.companyId.toString()) throw createError.Forbidden('C2');
    }
    const { inventoryHistoryService } = require('./index');
    await inventoryHistoryService.handleCreate(userId, oldDoc.companyId, oldDoc._id, oldDoc.batchCode, data.locationId || oldDoc.locationId, quantity, data.uom || oldDoc.uom, type, 'Inventory updated', null, null)

    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'update', 'inventory', id, JSON.stringify(oldDoc), JSON.stringify(data), ipAddress, userAgent)

    return handleSuccess("InventoryHistory updated successfully");
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOneInventory,
  handleGetAllInventoryByCompany,
  handleCreate,
  handleExportProduct,
  handleGetOneInventory,
  reserveInventory,
  releaseInventory,
  handleUpdateData,
  handleGetInventoryByBatchCode
}


