const express = require('express');
const router = express.Router();
const { batchController } = require('../controllers');
const { authenticationMiddleware, authorizationMiddleware, uploadMiddleware } = require('../middlewares');

router.use(authenticationMiddleware)
router.get('/get-all', authorizationMiddleware(['read-batch']), batchController.getAllBatch);
router.get('/get', authorizationMiddleware(['read-batch']), batchController.getAllBatchByCompany);
router.post('/', authorizationMiddleware(['create-batch']), uploadMiddleware.multipleUpload, batchController.create);
router.put('/', authorizationMiddleware(['update-batch']), uploadMiddleware.multipleUpload, batchController.update);
router.put('/approval', authorizationMiddleware(['approval-batch']), batchController.approval);
router.put('/update-state', authorizationMiddleware(['update-state-batch']), batchController.updateState);
router.get('/get/:batchCode', batchController.getOneBatch);
router.get('/:batchCode', batchController.getBatch);

module.exports = router;
