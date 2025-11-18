const express = require('express');
const router = express.Router();
const { sellerCustomController } = require('../controllers');
const { authenticationMiddleware, authorizationMiddleware } = require('../middlewares');

router.use(authenticationMiddleware)
router.get('/get-all', authorizationMiddleware(['read-seller-customer']), sellerCustomController.getAll);
router.put('/', authorizationMiddleware(['update-seller-customer']), sellerCustomController.update);

module.exports = router;
