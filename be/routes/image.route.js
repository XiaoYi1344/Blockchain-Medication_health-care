const express = require('express');
const router = express.Router();
const { imageController } = require('../controllers');

router.get('/:publicId', imageController.getImageById); // 👈 GET theo publicId

module.exports = router;
