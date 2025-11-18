const handleError = (err, req, res, next) => {
   // Nếu là lỗi validate của Mongoose
   console.log(err)
   if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({
         success: false,
         message: 'B1',
         // errors
      });
   }
   if (err.name === 'MongoServerError' || err.code) {
      return res.status(500).json({
         success: false,
         message: 'A1',
      });
   }
   const status = err.status || 500;
   let message = err.message || 'A1'
   if (err.status === 500) {
      message = 'A1'
   }

   return res.status(status).json({
      success: false,
      message
   });
};

module.exports = handleError;
