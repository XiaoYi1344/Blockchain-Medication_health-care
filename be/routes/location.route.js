const express = require('express');
const router = express.Router();
const { locationController } = require('../controllers');
const { authenticationMiddleware, authorizationMiddleware } = require('../middlewares');

router.use(authenticationMiddleware)
router.post('/', authorizationMiddleware(['create-location']), locationController.create);
router.put('/', authorizationMiddleware(['update-location']), locationController.update);
router.post('/get-all', authorizationMiddleware(['read-all-location']), locationController.getAllLocationByCompany);

module.exports = router;
