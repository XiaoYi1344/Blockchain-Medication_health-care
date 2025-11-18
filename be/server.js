require('dotenv').config();
const express = require('express');
const app = express();
const router = require("./routes");
const connectDB = require('./config/db');
const { errorHandle } = require("./middlewares/index");
const { contextMiddleware } = require("./middlewares/context.middleware");
const cookieParser = require("cookie-parser");
const { checkAndRunDailyJob } = require('./utils/cronjob.util');

const cors = require('cors');

// Allow all origins (CORS *)
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Middleware gắn ipAddress & userAgent vào req.context
app.use(contextMiddleware);

app.use('/api', router);

const PORT = process.env.PORT || 3000;

// Middleware xử lý lỗi - đặt ở cuối cùng
app.use(errorHandle);

// Chỉ cần dùng app.listen nếu không dùng socket
connectDB().then(() => {
   checkAndRunDailyJob()
   app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
   });
});