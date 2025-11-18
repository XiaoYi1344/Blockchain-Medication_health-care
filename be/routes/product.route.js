const express = require('express');
const router = express.Router();
const { productController } = require('../controllers');
const { authenticationMiddleware, authorizationMiddleware, uploadMiddleware } = require('../middlewares');

router.get('/get-all', productController.getAllProduct);
router.get('/get-one', productController.getOneProduct);

router.use(authenticationMiddleware)
router.get('/get-approved', authorizationMiddleware(['read-all-product']), productController.getAllProductApproved);
router.get('/get-for-approval', authorizationMiddleware(['read-all-product']), productController.getProductsForApproval);
router.get('/get-for-user', authorizationMiddleware(['read-all-product']), productController.getAllProductUser);
router.get('/get-for-order', authorizationMiddleware(['read-product-for-order']), productController.getAllProductForOrder);
router.post('/', authorizationMiddleware(['create-product']), uploadMiddleware.multipleUpload, productController.create);
router.put('/', authorizationMiddleware(['update-product']), uploadMiddleware.multipleUpload, productController.update);
router.put('/update-primary', authorizationMiddleware(['update-product-primary-image']), uploadMiddleware.singleUpload, productController.updatePrimaryImage);
router.put('/approval', authorizationMiddleware(['approval-product']), productController.approvalProduct);
router.delete('/:productId', authorizationMiddleware(['delete-product']), productController.deleteProduct);
router.put('/:productId', authorizationMiddleware(['create-product']), productController.sendProduct);

module.exports = router;
