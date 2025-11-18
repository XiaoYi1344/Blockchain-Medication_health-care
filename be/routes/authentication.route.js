const express = require("express");
const router = express.Router();
const { authenticationMiddleware } = require('../middlewares');
const { authenticationController } = require("../controllers")

router.post('/login', authenticationController.login);
router.post('/register', authenticationController.register);
router.post('/verify-otp', authenticationController.verifyAccount);
router.get('/refresh-access', authenticationController.refreshAccessToken);
router.post('/resend-otp', authenticationController.againSendOtp);
router.post('/stop-verify-otp', authenticationController.stopVerifyOtp);

router.use(authenticationMiddleware)
router.get('/logout', authenticationController.logOut);

module.exports = router