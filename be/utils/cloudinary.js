const cloudinary = require('cloudinary').v2;
const handleSuccess = require('../utils/success.util');

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createOneImg = async (file) => {
   const base64String = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
   const img = await cloudinary.uploader.upload(base64String);
   return img.public_id;
};

const createImgs = async (files) => {
   return Promise.all(files.map((file) => createOneImg(file)));
};

const deleteImage = async (publicId) => {
   try {
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result === "ok" || result.result === "not found") {
         return handleSuccess("Image deleted successfully or not found");
      } else {
         console.error("Cloudinary delete error:", result);
         throw createError.InternalServerError("Failed to delete image from Cloudinary");
      }
   } catch (error) {
      throw error;
   }
};

const handleDeleteOneImg = async (image = null) => {
   if (!image) return true;
   await deleteImage(image);
   return true;
};

const handleDeleteImgs = async (images = []) => {
   if (!images.length) return true;
   await Promise.all(images.map((image) => deleteImage(image)));
   return true;
};

module.exports = {
   cloudinary,
   createOneImg,
   createImgs,
   deleteImage,
   handleDeleteOneImg,
   handleDeleteImgs,
};