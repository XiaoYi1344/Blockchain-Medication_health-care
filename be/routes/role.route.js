const express = require('express');
const router = express.Router();
const { roleController } = require('../controllers');
const { authenticationMiddleware, authorizationMiddleware } = require('../middlewares');

router.use(authenticationMiddleware)
router.get('/get-all', authorizationMiddleware(['read-role-admin']), roleController.getAllRoleAdmin);
router.post('/', authorizationMiddleware(['create-role-admin']), roleController.create);
router.put('/', authorizationMiddleware(['update-role']), roleController.update);
router.post('/create-role', authorizationMiddleware(['create-role-company']), roleController.createCompanyRole);
router.put('/update-role', authorizationMiddleware(['update-role']), roleController.updateCompanyRole);
router.get('/get-all-company', authorizationMiddleware(['read-role']), roleController.getAllRoleByCompany);
router.delete('/:roleId', authorizationMiddleware(['delete-role']), roleController.deleteRole);

module.exports = router;
