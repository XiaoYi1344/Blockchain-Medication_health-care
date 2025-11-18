const fs = require('fs');
const path = require('path');
const db = require("../models");
const { notificationService, userService, companyService } = require('../services');
const { dayjs } = require('./dayjs.util');

const LOG_DIR = path.join(process.cwd(), 'log');
const CRON_FILE = path.join(LOG_DIR, 'status_cron.json');

const readStatus = () => {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
  if (!fs.existsSync(CRON_FILE))
    fs.writeFileSync(CRON_FILE, JSON.stringify({ lastRun: null }), 'utf8');
  return JSON.parse(fs.readFileSync(CRON_FILE, 'utf8'));
};
const writeStatus = (data) =>
  fs.writeFileSync(CRON_FILE, JSON.stringify(data, null, 2), 'utf8');

const checkAndRunDailyJob = async () => {
  const today = dayjs().tz().format('YYYY-MM-DD');
  const status = readStatus();
  if (status.lastRun === today)
    return console.log(`✔️  Cron hôm nay (${today}) đã chạy.`);

  console.log(`✔️  Chạy cron job (${today})...`);
  await Promise.all([checkLicense(), checkWarehouse(), cleanToken()]);
  writeStatus({ lastRun: today, runAt: new Date().toISOString() });
  console.log(`✔️  Ghi log cron-status.json (${today})`);
};

// === License ===
const checkLicense = async () => {
  try {
    const now = dayjs().tz('Asia/Ho_Chi_Minh');
    const today = now.startOf('day');
    const nextMonth = now.add(1, 'month').endOf('day');

    const [expired, upcoming] = await Promise.all([
      db.CompanyDocument.find({ status: { $nin: ['expire', 'revoked'] }, expiryDate: { $lte: today.toDate() } })
        .populate('companyId', 'name companyCode').lean(),
      db.CompanyDocument.find({
        status: 'active',
        expiryDate: { $gt: today.toDate(), $lte: nextMonth.toDate() }
      }).populate('companyId', 'name companyCode').lean()
    ]);

    if (expired.length) {
      console.log(`❗${expired.length} license hết hạn.`);
      await db.CompanyDocument.updateMany(
        { _id: { $in: expired.map(x => x._id) } },
        { $set: { status: 'expired' } }
      );
      await Promise.allSettled(expired.map(li => sendNotify(li, 'expired', now.subtract(7, 'day'))));
    } else console.log('⚡ Không có license hết hạn.');

    if (upcoming.length) {
      console.log(`❗${upcoming.length} license sắp hết hạn.`);
      await Promise.allSettled(upcoming.map(li => sendNotify(li, 'upcoming', now.subtract(30, 'day'))));
    } else console.log('⚡ Không có license sắp hết hạn.');
  } catch (err) {
    console.error('Lỗi kiểm tra license:', err);
  }
};

const sendNotify = async (li, type, since) => {
  try {
    const company = (await companyService.handleGetOneCompany(li.companyId._id))?.data;
    const user = await userService.getUserByCompanyAndRole(company);
    if (!user?._id) return;

    const exist = await db.Notification.exists({
      type: 'license',
      relatedEntityId: li._id,
      createdAt: { $gte: since.toDate() },
      message: { $regex: /(expire|expired)/i }
    });
    if (exist) return;

    const isExpired = type === 'expired';
    await notificationService.handleCreate({
      userId: null,
      context: null,
      data: {
        title: isExpired ? "License expired" : "License expiring soon",
        message: isExpired
          ? `License expired on ${dayjs(li.expiryDate).format('YYYY-MM-DD')}.`
          : `License will expire on ${dayjs(li.expiryDate).format('YYYY-MM-DD')}.`,
        type: 'license',
        relatedEntityType: 'license',
        relatedEntityId: li._id
      },
      recipientId: user._id
    });
  } catch (e) {
    console.error(`Lỗi gửi thông báo license ${li._id}:`, e.message);
  }
};

// === Warehouse ===
const checkWarehouse = async () => {
  try {
    const THRESHOLD = 0.8;
    const locs = await db.Location.find({ isActive: true }).populate('companyId', 'name');
    if (!locs.length) return console.log('Không có kho hoạt động.');

    const grouped = locs.reduce((acc, l) => {
      const id = l.companyId?._id?.toString();
      if (id) (acc[id] ||= []).push(l);
      return acc;
    }, {});

    for (const [cid, list] of Object.entries(grouped)) {
      const companyName = list[0].companyId?.name || 'Unknown';
      const nearlyFull = Object.entries(
        list.reduce((a, l) => ((a[l.type] ||= []).push(l), a), {})
      )
        .filter(([_, arr]) => arr.every(l => l.currentQuantity / l.maximum >= THRESHOLD))
        .map(([type]) => type);

      if (!nearlyFull.length) continue;

      console.log(`❗ ${companyName} - ${nearlyFull.join(', ')} gần đầy.`);
      const company = await companyService.handleGetOneCompany(cid);
      const user = await userService.getUserByCompanyAndRole(company.data);
      if (!user?._id) continue;

      const exist = await db.Notification.exists({
        title: 'Warehouse capacity warning',
        type: 'warehouse',
        createdAt: { $gte: dayjs().subtract(30, 'day').toDate() }
      });
      if (!exist)
        await notificationService.handleCreate({
          userId: null,
          context: null,
          data: {
            title: 'Warehouse capacity warning',
            message: `Your company’s ${nearlyFull.join(', ')} warehouses are nearly full.`,
            type: 'warehouse',
            relatedEntityType: 'location',
          },
          recipientId: user._id
        });
    }
  } catch (e) {
    console.error('Lỗi kiểm tra kho đầy:', e);
  }
};

// === Token Cleanup ===
const cleanToken = async () => {
  try {
    const now = dayjs().tz('Asia/Ho_Chi_Minh').toDate();
    const expired = await db.Token.find({ type: 'login', expirationTime: { $lt: now } }).select('_id').lean();
    if (!expired.length) return console.log('⚡ Không có token hết hạn.');

    const res = await db.Token.deleteMany({ _id: { $in: expired.map(t => t._id) } });
    console.log(`Xóa ${res.deletedCount} token hết hạn.`);
  } catch (e) {
    console.error('Lỗi xóa token:', e);
  }
};

module.exports = { checkAndRunDailyJob };