const express = require('express');
const router = express.Router();
const { companyController } = require('../controllers');
const { authenticationMiddleware, authorizationMiddleware, uploadMiddleware } = require('../middlewares');

router.use(authenticationMiddleware)
router.get('/get-all', authorizationMiddleware(['read-all-company']), companyController.getAllCompany);
router.get('/', authorizationMiddleware(['read-company']), companyController.getOneCompany);
router.post('/', authorizationMiddleware(['create-company']), companyController.create);
router.put('/', authorizationMiddleware(['update-company']), uploadMiddleware.multipleUpload, companyController.update);
router.put('/approval', authorizationMiddleware(['approval-company']), companyController.updateStatus);
router.get('/:companyCode', authorizationMiddleware(['read-company']), companyController.getOneCompanyByCode);
router.post('/:companyId', authorizationMiddleware(['stop-company']), companyController.updateIsActiveCompany);

module.exports = router;
