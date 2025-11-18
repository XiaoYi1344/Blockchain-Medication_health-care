const { cloudinary } = require("../utils/cloudinary")

const getImageById = async (req, res, next) => {
   try {
      const { publicId } = req.params;
      const result = await cloudinary.api.resource(publicId);
      // Redirect trình duyệt về ảnh gốc
      return res.redirect(result.secure_url);
   } catch (error) {
      next(error);
   }
};

module.exports = {
   getImageById
};
