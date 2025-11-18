const db = require("../models");
const createError = require("http-errors");
const handleSuccess = require("../utils/success.util");
const { default: mongoose } = require("mongoose");
const { auditLogHandle, dayjsHandle, counterHandle, cryptoHandle } = require("../utils/index");

const getOneShipment = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }

    const shipment = await db.Shipment.findById(id);
    return shipment;
  } catch (error) {
    throw error;
  }
};

const handleGetOneShipment = async (id) => {
  try {
    const shipment = await getOneShipment(id);
    if (!shipment) throw createError.NotFound('F53');
    if (shipment.departAt) shipment.departAt = dayjsHandle.dayjs.tz(shipment.departAt).toDate();
    if (shipment.expectedDate) shipment.expectedDate = dayjsHandle.dayjs.tz(shipment.expectedDate).toDate();
    if (shipment.receivingTime) shipment.receivingTime = dayjsHandle.dayjs.tz(shipment.receivingTime).toDate();

    return handleSuccess('Get shipment successful', shipment);
  } catch (error) {
    throw error;
  }
};

const handleGetShipmentByOrderCode = async (orderCode) => {
  try {
    const shipments = await db.Shipment.find({ orderCode }).lean();
    if (shipments.length === 0) throw createError.NotFound('F53');
    const result = shipments.map(s => ({
      ...s,
      departAt: s.departAt ? dayjsHandle.dayjs(s.departAt).tz().format('YYYY-MM-DD HH:mm') : null,
      expectedDate: s.expectedDate ? dayjsHandle.dayjs(s.expectedDate).tz().format('YYYY-MM-DD HH:mm') : null,
      receivingTime: s.receivingTime ? dayjsHandle.dayjs(s.receivingTime).tz().format('YYYY-MM-DD HH:mm') : null,
    }));

    return handleSuccess('Get shipment by orderCode successful', result);
  } catch (error) {
    throw error;
  }
};

const getAllShipmentByUserId = async (userId) => {
  try {
    const shipments = await db.Shipment.find({ createdBy: userId }).lean()
    return shipments
  } catch (error) {
    throw error;
  }
};

const handleGetAllShipmentByUserId = async (id) => {
  try {
    const shipments = await getAllShipmentByUserId(id)
    const result = shipments.map(s => ({
      ...s,
      departAt: s.departAt ? dayjsHandle.dayjs(s.departAt).tz().format('YYYY-MM-DD HH:mm') : null,
      expectedDate: s.expectedDate ? dayjsHandle.dayjs(s.expectedDate).tz().format('YYYY-MM-DD HH:mm') : null,
      receivingTime: s.receivingTime ? dayjsHandle.dayjs(s.receivingTime).tz().format('YYYY-MM-DD HH:mm') : null,
    }));

    return handleSuccess('Get shipment successful', result || []);
  } catch (error) {
    throw error;
  }
};

const handleGetAllShipmentByCompany = async (companyId) => {
  try {
    const shipments = await db.Shipment.find({ fromCompanyId: companyId }).lean();

    const result = shipments.map(s => ({
      ...s,
      departAt: s.departAt ? dayjsHandle.dayjs(s.departAt).tz().format('YYYY-MM-DD HH:mm') : null,
      expectedDate: s.expectedDate ? dayjsHandle.dayjs(s.expectedDate).tz().format('YYYY-MM-DD HH:mm') : null,
      receivingTime: s.receivingTime ? dayjsHandle.dayjs(s.receivingTime).tz().format('YYYY-MM-DD HH:mm') : null,
    }));

    return handleSuccess('Get all shipments by company successful', result);
  } catch (error) {
    throw error;
  }
};

const handleStopShipment = async (userId, context, id = null) => {
  try {
    const { orderService } = require('./index')
    const shipment = (await handleGetOneShipment(id)).data
    const order = await orderService.handleGetOneOrderByOrderCode(shipment.orderCode)
    if (shipment.status !== 'processing') {
      throw createError.BadRequest('F55')
    }
    if (['delivered', 'goods_received', 'canceled', 'rejected'].includes(order.data[0].status)) {
      throw createError.BadRequest(`F64: ${order.data[0].status}`);
    }

    await db.Shipment.findByIdAndUpdate(id, { status: 'canceled' })
    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'stop', 'shipment', id, null, null, ipAddress, userAgent)

    return handleSuccess('Stop shipment successful');
  } catch (error) {
    throw error;
  }
};

const handleUpdateReceiving = async (userId, context, shipCode, orderCode, status, receivingTime, companyId) => {
  try {
    if (status && status !== 'goods_received') throw createError.BadRequest('F67');
    if (!status || !receivingTime) throw createError.BadRequest('B1');

    const shipment = await db.Shipment.findOne({ shipCode, orderCode })
      .select('_id orderCode toCompanyId departAt status receivingTime shipCode')
      .lean();
    if (!shipment) throw createError.NotFound('Shipment not found');
    if (companyId !== shipment.toCompanyId.toString()) throw createError.Unauthorized('C2');

    let data = {};

    if (receivingTime && !shipment.receivingTime) {
      const receive = dayjsHandle.dayjs.tz(receivingTime);
      const depart = dayjsHandle.dayjs.tz(shipment.departAt);

      if (!depart.isBefore(receive)) throw createError.BadRequest('F58');
      data.receivingTime = receive.toDate();
    }

    if (status && shipment.status === 'delivered') {
      data.status = status;
    }

    if (Object.keys(data).length > 0) {
      await db.Shipment.findByIdAndUpdate(shipment._id, { $set: data }, { new: true });
    }

    const shipments = await db.Shipment.find({ orderCode: shipment.orderCode })
      .select('status')
      .lean();
    if (shipments.length && shipments.every(s => s.status === 'goods_received')) {
      await db.Order.updateMany(
        { orderCode: orderCode },
        { $set: { status: 'goods_received' } }
      );
    }
    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'update', 'shipment', shipment._id, null, JSON.stringify(data), ipAddress, userAgent)

    return handleSuccess('Update shipment successful');
  } catch (error) {
    throw error;
  }
};

const handleUpdateData = async (userId, context, id, status, data, companyId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }
    const oldDoc = (await handleGetOneShipment(id)).data;
    if (companyId) {
      if (oldDoc.fromCompanyId.toString() !== companyId) {
        throw createError.Forbidden('C2');
      }
    }
    if (status) {
      const check = await checkStatus(oldDoc, status)
      if (check) {
        data.status = status
        const { notificationService, receivingRecordsService } = require('./index')
        const order = await db.Order.findOne({ orderCode: oldDoc.orderCode })
        await notificationService.handleCreate({ userId, context, data: { title: "Your shipment has been updated.", message: `Delivery person ${oldDoc.shipCode} is currently ${status}.`, type: 'shipment', relatedEntityType: 'shipment', relatedEntityId: id }, recipientId: order.createdBy })

        if (status === 'delivered') {
          const quantity = cryptoHandle.cleanMongooseDoc(oldDoc.batches)
          await receivingRecordsService.handleCreate({ orderCode: oldDoc.orderCode, shipCode: oldDoc.shipCode, companyId: oldDoc.toCompanyId, expectedDate: oldDoc.expectedDate, expectedQuantity: quantity })

          const batchCodes = oldDoc.batches.map(batch => batch.batchCode);
          await db.Batch.updateMany(
            { batchCode: { $in: batchCodes } },
            { $addToSet: { ownerCompanyId: oldDoc.toCompanyId } }
          );
        }
      }
    }

    if (status === 'delivering' && (!data.departAt || !data.expectedDate)) throw createError.BadRequest('F75')
    if (status === 'delivering' && !oldDoc.departAt && !oldDoc.expectedDate) {
      let { departAt, expectedDate } = data;
      if (departAt && dayjsHandle.parseDateTime(departAt)) {
        departAt = dayjsHandle.dayjs.tz(departAt);
        data.departAt = departAt.toDate();
      }

      if (expectedDate && dayjsHandle.parseDateTime(expectedDate)) {
        const arrive = dayjsHandle.dayjs.tz(expectedDate);
        if (departAt && !departAt.isBefore(arrive)) {
          throw createError.BadRequest("F58");
        }
        data.expectedDate = arrive.toDate();
      }
    }

    const changedOld = {};
    const changedNew = {};
    for (const key of Object.keys(data)) {
      if (oldDoc[key] !== data[key]) {
        changedOld[key] = oldDoc[key];
        changedNew[key] = data[key];
      }
    }

    await db.Shipment.findByIdAndUpdate(id, data)

    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'update', 'shipment', id, JSON.stringify(changedOld), JSON.stringify(changedNew), ipAddress, userAgent)

    return handleSuccess("Shipment updated successfully");
  } catch (error) {
    throw error;
  }
};

const checkStatus = async (oldDoc, newStatus) => {
  const validOrderFlow = ['processing', 'delivering', 'delivered'];
  const finalStatus = ['canceled', 'goods_received']

  if (finalStatus.includes(oldDoc.status)) {
    throw createError.BadRequest('F37');
  }
  if (newStatus === 'canceled' && oldDoc.status === 'processing') {
    return true
  }
  if (newStatus === oldDoc.status) throw createError.BadRequest('F66')

  const currentIndex = validOrderFlow.indexOf(oldDoc.status);
  const nextIndex = validOrderFlow.indexOf(newStatus);
  if (nextIndex === -1) {
    throw createError.BadRequest('F38');
  }

  if (nextIndex !== currentIndex + 1) {
    throw createError.BadRequest('F46');
  }

  if (newStatus === 'delivered') {
    const batchCodes = oldDoc.batches.map(b => b.batchCode);
    const orders = await db.Order.find({
      orderCode: oldDoc.orderCode,
      'batch.batchCode': { $in: batchCodes }
    }).lean();

    const allExported = orders.length > 0 &&
      orders.every(order => {
        const matchedBatches = order.batch.filter(b => batchCodes.includes(b.batchCode));
        return matchedBatches.length > 0 && matchedBatches.every(b => b.isExport === true);
      });

    if (!allExported) {
      throw createError.BadRequest('F56');
    }
  }

  return true
}

const handleCreate = async (userId, context, companyId, data) => {
  try {
    const { orderService } = require('./index');

    const batchesInput = data.batches || [];
    if (!batchesInput.length) throw createError.BadRequest('F52');
    const batchCodes = batchesInput.map(b => b.batchCode);

    const [orderRes, batchDocs] = await Promise.all([
      orderService.handleGetOneOrderByOrderCode(data.orderCode),
      db.Batch.find({ batchCode: { $in: batchCodes } }, { batchCode: 1 }).lean()
    ]);

    const orderDoc = orderRes?.data[0];
    if (!orderDoc) throw createError.BadRequest('F50');

    if (!['instock', 'processing', 'delivering'].includes(orderDoc.status)) {
      throw createError.BadRequest('F62');
    }

    if (orderDoc.fromCompanyId.toString() !== companyId.toString()) {
      throw createError.Forbidden('C2');
    }

    const orderBatches = orderDoc.products.flatMap(p => p.batch);
    const orderBatchMap = new Map(orderBatches.map(b => [b.batchCode, b]));

    for (const b of batchesInput) {
      const orderBatch = orderBatchMap.get(b.batchCode);
      if (!orderBatch) throw createError.BadRequest(`F51: ${b.batchCode}`);

      if (orderBatch.isExport)
        throw createError.BadRequest(`F56: ${b.batchCode}`);

      if (b.quantity > orderBatch.quantity)
        throw createError.BadRequest(`F63: ${b.batchCode}`);
    }

    data.shipCode = await counterHandle('Shipment', 'SHIP');

    Object.assign(data, {
      toCompanyId: orderDoc.toCompanyId,
      fromCompanyId: orderDoc.fromCompanyId,
      createdBy: userId,
    });

    const newShipment = await db.Shipment.create(data);

    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'create', 'shipment', newShipment._id, null, null, ipAddress, userAgent)

    return handleSuccess('Shipment created successfully', { shipCode: data.shipCode });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOneShipment,
  getAllShipmentByUserId,
  handleGetAllShipmentByUserId,
  handleGetAllShipmentByCompany,
  handleCreate,
  handleUpdateData,
  handleStopShipment,
  handleGetOneShipment,
  handleGetShipmentByOrderCode,
  handleUpdateReceiving
}


