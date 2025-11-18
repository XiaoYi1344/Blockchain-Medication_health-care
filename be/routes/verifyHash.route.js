const express = require('express');
const router = express.Router();
const { verifyHashController } = require('../controllers');
const { authenticationMiddleware } = require('../middlewares');

router.use(authenticationMiddleware)
router.post('/', verifyHashController.verifyHash);

module.exports = router;
