const express = require('express');
const router = express.Router();
const { inventoryController } = require('../controllers');
const { authenticationMiddleware, authorizationMiddleware } = require('../middlewares');

router.use(authenticationMiddleware)
router.post('/', authorizationMiddleware(['create-inventory']), inventoryController.create);
router.get('/get-all', authorizationMiddleware(['read-all-inventory']), inventoryController.getAllInventoryByCompany);
router.post('/export', authorizationMiddleware(['export-inventory']), inventoryController.exportProduct);
router.put('/', authorizationMiddleware(['update-inventory']), inventoryController.update);

module.exports = router;
