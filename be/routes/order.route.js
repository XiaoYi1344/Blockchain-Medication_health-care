const express = require('express');
const router = express.Router();
const { orderController } = require('../controllers');
const { authenticationMiddleware, authorizationMiddleware } = require('../middlewares');

router.use(authenticationMiddleware)
router.get('/get-all', authorizationMiddleware(['read-created-order']), orderController.getCreatedOrders);
router.get('/get-all-received', authorizationMiddleware(['read-order']), orderController.getAllOrderReceivedOfCompany);
router.get('/get-all-unreceived', authorizationMiddleware(['read-order']), orderController.getAllOrderUnreceivedOfCompany);
router.post('/', authorizationMiddleware(['create-order']), orderController.create);
router.put('/', authorizationMiddleware(['update-order']), orderController.update);
router.put('/received', authorizationMiddleware(['update-order']), orderController.receivedOrder);
router.get('/get-one/:orderCode', authorizationMiddleware(['read-order']), orderController.getOneOrderByOrderCode);
router.put('/:orderCode', authorizationMiddleware(['cancel-order']), orderController.cancelOrder);

module.exports = router;
