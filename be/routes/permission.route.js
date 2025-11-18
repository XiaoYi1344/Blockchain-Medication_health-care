const express = require('express');
const router = express.Router();
const { permissionController } = require('../controllers');
const { authenticationMiddleware, authorizationMiddleware } = require('../middlewares');

router.use(authenticationMiddleware)
router.get('/get-all', authorizationMiddleware(['read-all-permission']), permissionController.getAllPermission);
router.post('/get', authorizationMiddleware(['read-permission']), permissionController.getAllPermissionByType);
router.post('/', authorizationMiddleware(['create-permission']), permissionController.create);
router.put('/', authorizationMiddleware(['update-permission']), permissionController.update);
router.get('/get-by-role/:roleId', authorizationMiddleware(['read-permission']), permissionController.getAllPermissionByRole);
router.get('/get-by-user/:userId', permissionController.getAllPermissionByUser);
router.delete('/:permissionId', authorizationMiddleware(['delete-permission']), permissionController.deletePermission);

module.exports = router;
