const db = require("../models");
const createError = require("http-errors");
const { default: mongoose } = require("mongoose");
const { auditLogHandle, handleSuccess, cryptoHandle, cloudinary, imgIPFSHandle, dayjsHandle } = require("../utils/index");

const getOneReceivingRecord = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }

    const receive = await db.ReceivingRecord.findById(id).lean();
    if (receive.expectedDate) receive.expectedDate = dayjsHandle.dayjs.tz(receive.expectedDate).toDate();
    if (receive.receivingDate) receive.receivingDate = dayjsHandle.dayjs.tz(receive.receivingDate).toDate();
    return receive;
  } catch (error) {
    throw error;
  }
};

const handleGetOneReceivingRecord = async (id) => {
  try {
    const receive = await getOneReceivingRecord(id);
    if (!receive) throw createError.NotFound('F77');
    return handleSuccess('Get receive successful', receive);
  } catch (error) {
    throw error;
  }
};

const handleGetOneRecordByShipCode = async (shipCode) => {
  try {
    const receive = await db.ReceivingRecord.findOne({ shipCode });
    if (!receive) throw createError.NotFound('F77');
    return handleSuccess('Get receive successful', receive);
  } catch (error) {
    throw error;
  }
};

const handleGetAllReceivingRecordByOrder = async (orderCode, companyId) => {
  try {
    const receives = await db.ReceivingRecord.find({ orderCode }).lean();
    if (companyId !== receives[0].companyId.toString()) throw createError.Unauthorized('C2');
    const result = receives.map(r => ({
      ...r,
      expectedDate: r.expectedDate ? dayjsHandle.dayjs(r.expectedDate).tz().format('YYYY-MM-DD HH:mm') : null,
      receivingDate: r.receivingDate ? dayjsHandle.dayjs(r.receivingDate).tz().format('YYYY-MM-DD HH:mm') : null,
    }));

    return handleSuccess('Get all receives by orderCode successful', result);
  } catch (error) {
    throw error;
  }
};

const handleUpdateData = async (userId, context, companyId, id, receivedQuantity, remarks, images, status = null) => {
  try {
    const { shipmentService, batchService } = require('./index');
    const record = await getOneReceivingRecord(id);
    if (!record) throw createError.NotFound('F77');

    if (record.status === 'completed' && (!status || status !== 'recall')) {
      await handleDeleteImages(images);
      throw createError.BadRequest('F76');
    }
    if (!Array.isArray(record.receivedQuantity)) {
      await handleDeleteImages(images);
      throw createError.BadRequest('F77');
    }

    let updateData = {};
    if (remarks) updateData.remarks = remarks;
    const codes = record.expectedQuantity.map(eq => eq.batchCode);
    let filBatch = await db.Batch.find({ batchCode: { $in: codes } }).lean();
    const b = filBatch.some(b => b.state === 'RECALL' || b.state === 'RECALL_PENDING');
    if (b) {
      filBatch = batches.filter(b => b.state !== 'RECALL' && b.state !== 'RECALL_PENDING');
      status = 'recall'
    }
    if (receivedQuantity && receivedQuantity.length !== filBatch.length) {
      const img = images.map(i => i.hash);
      if (record.status === 'processing') {
        const data = {
          orderCode: record.orderCode,
          expectedDate: dayjsHandle.dayjs(record.expectedDate).format('YYYY-MM-DD HH:mm'),
          receivingDate: dayjsHandle.dayjs().tz().format('YYYY-MM-DD HH:mm'),
          expectedQuantity: cryptoHandle.cleanMongooseDoc(record.expectedQuantity),
          receivedQuantity,
          remarks,
          images: img,
          status: 'completed'
        };
        updateData.txHash = cryptoHandle.hashData(data);
        updateData.status = 'completed';
      }

      updateData.images = images;
      updateData.receivedQuantity = receivedQuantity;
      updateData.receivingDate = new Date();

      const batchCodes = record.batches?.map((b) => b.batchCode) || [];

      if (batchCodes.length > 0) {
        const recallBatches = await db.Batch.find({
          batchCode: { $in: batchCodes },
          state: "RECALL_PENDING",
        }).lean();

        for (const b of recallBatches) {
          const activeShipments = await db.Shipment.find({
            "batches.batchCode": b.batchCode,
            status: { $nin: ["recall", "delivered", "goods_received"] },
          }).lean();

          if (activeShipments.length === 0) {
            await batchService.handleUpdateState({
              userId,
              context,
              batchCode: b.batchCode,
              state: "RECALL",
              forceRecall: true,
              companyId: b.manufacturerId,
              locationId: null,
            });
          }
        }
      }
    }

    const changedOld = {};
    const changedNew = {};
    for (const key of Object.keys(updateData)) {
      if (record[key] !== updateData[key]) {
        changedOld[key] = record[key];
        changedNew[key] = updateData[key];
      }
    }

    if (['processing', 'completed'].includes(record.status)) {
      await shipmentService.handleUpdateReceiving(
        userId,
        context,
        record.shipCode,
        record.orderCode,
        'goods_received',
        dayjsHandle.dayjs().tz().format('YYYY-MM-DD HH:mm'),
        companyId
      );
      await db.ReceivingRecord.findByIdAndUpdate(id, updateData);
    }

    const { ipAddress, userAgent } = context;
    await auditLogHandle.createLog(userId, 'update', 'receivingRecord', id, JSON.stringify(changedOld), JSON.stringify(changedNew), ipAddress, userAgent);

    const response = { message: 'Receiving record updated successfully' };
    if (updateData.txHash) response.txHash = updateData.txHash;
    return handleSuccess(response);
  } catch (error) {
    await handleDeleteImages(images);
    throw error;
  }
};

const handleDeleteImages = async (images) => {
  if (!images || images.length === 0) return;
  const ids = images.map(i => i.public_id);
  const hashes = images.map(i => i.hash);
  await Promise.all([
    cloudinary.handleDeleteImgs(ids),
    imgIPFSHandle.deleteFiles(hashes)
  ]);
};

const handleCreate = async (data) => {
  try {
    await db.ReceivingRecord.create(data)
    return handleSuccess('ReceivingRecord created successfully');
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOneReceivingRecord,
  handleGetAllReceivingRecordByOrder,
  handleCreate,
  handleUpdateData,
  handleGetOneReceivingRecord,
  handleGetOneRecordByShipCode
}


