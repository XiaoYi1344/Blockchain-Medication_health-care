const express = require('express');
const router = express.Router();
const { companyDocumentController } = require('../controllers');
const { authenticationMiddleware, authorizationMiddleware, uploadMiddleware } = require('../middlewares');

router.use(authenticationMiddleware)
router.get('/', authorizationMiddleware(['read-license']), companyDocumentController.getLicenses);
router.post('/create-license', authorizationMiddleware(['create-license']), uploadMiddleware.multipleUpload, companyDocumentController.create);
router.put('/update-license', authorizationMiddleware(['management-license']), companyDocumentController.managementLicense);

module.exports = router;
