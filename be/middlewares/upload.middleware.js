// middlewares/upload.middleware.js
const multer = require('multer');
const path = require('path');
const createError = require('http-errors');

function createUpload() {
   // Chỉ cần memory storage cho Cloudinary
   const storage = multer.memoryStorage();

   const fileFilter = (req, file, cb) => {
      const allowedTypes = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.includes(ext)) {
         cb(null, true);
      } else {
         cb(createError.Conflict('Only image files are allowed (.jpg, .jpeg, .png, .webp)'));
      }
   };

   return multer({
      storage,
      limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
      fileFilter
   });
}

module.exports = {
   singleUpload: createUpload().single('image'),
   avatarUpload: createUpload().single('avatar'),
   multipleUpload: createUpload().array('images', 5)
};