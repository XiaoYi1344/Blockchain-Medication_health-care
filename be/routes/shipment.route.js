const express = require('express');
const router = express.Router();
const { shipmentController } = require('../controllers');
const { authenticationMiddleware, authorizationMiddleware } = require('../middlewares');

router.use(authenticationMiddleware)
router.get('/get-all', authorizationMiddleware(['read-all-shipment']), shipmentController.getAllShipmentByCompany);
router.get('/get-by-user', authorizationMiddleware(['read-shipment']), shipmentController.getAllShipmentByUserId);
router.post('/', authorizationMiddleware(['create-shipment']), shipmentController.create);
router.put('/', authorizationMiddleware(['update-shipment']), shipmentController.update);
router.get('/get-by-code/:orderCode', authorizationMiddleware(['read-shipment']), shipmentController.getAllShipmentByCode);
router.put('/:shipmentId', authorizationMiddleware(['stop-shipment']), shipmentController.stopShipment);

module.exports = router;
