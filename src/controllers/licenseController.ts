// // src/controllers/licenseController.ts
// import dayjs from 'dayjs';

// export const createLicense = async (req, res) => {
//   try {
//     const { name, licenseId, expiryDate, type, images } = req.body;

//     // dùng dayjs parse ngày
//     const expiry = dayjs(expiryDate, 'YYYY-MM-DD');
//     if (!expiry.isValid()) {
//       return res.status(400).json({ success: false, message: 'Invalid expiryDate' });
//     }

//     // logic tạo license ...
//     return res.json({ success: true, result: createdLicense });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };
