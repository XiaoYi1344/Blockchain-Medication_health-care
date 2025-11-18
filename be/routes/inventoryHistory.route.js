const express = require('express');
const router = express.Router();
const { inventoryHistoryController } = require('../controllers');
const { authenticationMiddleware, authorizationMiddleware } = require('../middlewares');

router.use(authenticationMiddleware)
router.get('/get-all', authorizationMiddleware(['read-inventory-history']), inventoryHistoryController.getAllInventoryByCompany);

module.exports = router;
