const express = require('express');
const router = express.Router();
const { receivingRecordsController } = require('../controllers');
const { authenticationMiddleware, authorizationMiddleware, uploadMiddleware } = require('../middlewares');

router.use(authenticationMiddleware)
router.put('/', authorizationMiddleware(['update-receive-record']), uploadMiddleware.multipleUpload, receivingRecordsController.update);
router.get('/get-by-ship/:shipCode', authorizationMiddleware(['read-receive-record']), receivingRecordsController.getOneRecordByShipCode);
router.get('/:orderCode', authorizationMiddleware(['read-receive-record']), receivingRecordsController.getAllRoleByOrder);

module.exports = router;
