const express = require('express');
const router = express.Router();
const { traceabilityController } = require('../controllers');

router.post('/', traceabilityController.traceability);

module.exports = router;
