const express = require('express');
const router = express.Router();
const { auditLogController } = require('../controllers');
const { authenticationMiddleware } = require('../middlewares');

router.use(authenticationMiddleware)
router.post('/', auditLogController.getAuditLog);

module.exports = router;