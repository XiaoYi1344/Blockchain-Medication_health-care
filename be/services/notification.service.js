const db = require("../models");
const createError = require("http-errors");
const handleSuccess = require("../utils/success.util");
const { default: mongoose } = require("mongoose");
const auditLogHandle = require("../utils/auditLog.util");

const getOneNotification = async (id, fil = { isActive: true }) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw createError.BadRequest('B6 B7');
    }
    fil._id = id;

    const notification = await db.Notification.findOne(fil);
    return notification;
  } catch (error) {
    throw error;
  }
};

const handleGetOneNotification = async (id, fil = { isActive: true }) => {
  try {
    const notification = await getOneNotification(id, fil);
    if (!notification) throw createError.NotFound('F49');
    return handleSuccess('Get notification successful', notification);
  } catch (error) {
    throw error;
  }
};

const handleGetAllNotificationAdmin = async (userId) => {
  try {
    const notifications = await db.Notification.find({ senderId: userId }).lean();
    return handleSuccess('Get all notifications successful', notifications || []);
  } catch (error) {
    throw error;
  }
};

const handleGetAllNotification = async (userId) => {
  try {
    const notificationRecipients = await db.NotificationRecipient.find({ userId }).populate({ path: 'notificationId', match: { isActive: true }, select: '-senderId -userId -isActive' }).lean();
    const notifications = notificationRecipients
      .filter(nr => nr.notificationId)
      .map(nr => ({
        ...nr.notificationId,
        isRead: nr.isRead
      }));
    return handleSuccess('Get all notifications by company successful', notifications || []);
  } catch (error) {
    throw error;
  }
};

const handleStopNotification = async (userId, context, id = null, isActive) => {
  try {
    await handleGetOneNotification(id);

    await db.Notification.findByIdAndUpdate(id, { isActive });

    const { ipAddress, userAgent } = context
    await auditLogHandle.createLog(userId, 'stop', 'notification', id, null, null, ipAddress, userAgent)

    return handleSuccess('Stop notification successful');
  } catch (error) {
    throw error;
  }
};

const handleCreate = async ({ userId = null, context = null, batchCode = null, data, recipientId = null, companyId = null }) => {
  try {
    const { batchService, userService } = require('./index');
    let batch = null

    if (!data.title || !data.message) {
      throw createError.BadRequest('B19');
    }

    data.senderId = userId;
    if (batchCode !== null && data.type === 'request') {
      batch = (await batchService.handleGetBatchByCode(batchCode)).data;
      if (!batch.ownerCompanyId.some(id => id.toString() === companyId.toString())) {
        throw createError.BadRequest('C2');
      }

      data.relatedEntityType = 'batch';
      data.relatedEntityId = batch._id;
      const admins = (await userService.handleGetAllAdmin(batch.manufacturerId)).data;

      const manuAdmin = admins.find(admin =>
        admin.companyId.toString() === batch.manufacturerId.toString()
      );
      if (!manuAdmin) throw createError.NotFound('F82');
      recipientId = manuAdmin._id
    }

    const newNotification = await db.Notification.create(data)

    if (data.type === 'system' || data.type === 'other') {
      await handleCreateSystemRecipient(newNotification._id)
    } else {
      if (!recipientId) throw createError.BadRequest('F81');
      await handleCreateRecipient(newNotification._id, recipientId)
    }

    if (context) {
      const { ipAddress, userAgent } = context
      await auditLogHandle.createLog(userId, 'create', 'notification', newNotification._id, null, null, ipAddress, userAgent)
    }
    return handleSuccess('Notification created successfully');
  } catch (error) {
    throw error;
  }
};

const handleCreateSystemRecipient = async (notificationId) => {
  try {
    const users = await db.User.find({ isActive: true }).select('_id').lean();

    if (users.length === 0) {
      return handleSuccess('No active users to notify');
    }

    const bulkOps = users.map(user => ({
      insertOne: {
        document: {
          notificationId,
          userId: user._id
        }
      }
    }));

    await db.NotificationRecipient.bulkWrite(bulkOps);

    return handleSuccess('Notification recipients created successfully');
  } catch (error) {
    throw error;
  }
};

const handleCreateRecipient = async (notificationId, recipientId) => {
  try {
    const { userService } = require('./index');
    const user = (await userService.handleGetOneUser(recipientId)).data;

    await db.NotificationRecipient.create({
      notificationId,
      userId: user._id
    });

    return handleSuccess('Notification recipient created successfully');
  } catch (error) {
    throw error;
  }
};

const handleUpdateRecipient = async (userId, notificationIds) => {
  try {
    await db.NotificationRecipient.updateMany(
      {
        userId,
        notificationId: { $in: notificationIds },
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );
    return handleSuccess('Notification recipient update successfully');
  } catch (error) {
    throw error;
  }
};

const handleDeleteRecipient = async (userId) => {
  try {
    await db.Notification.deleteMany({ userId });
    return handleSuccess('Delete notification recipient successful');
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOneNotification,
  handleGetAllNotificationAdmin,
  handleGetAllNotification,
  handleCreate,
  handleStopNotification,
  handleGetOneNotification,
  handleCreateSystemRecipient,
  handleCreateRecipient,
  handleUpdateRecipient,
  handleDeleteRecipient
}


