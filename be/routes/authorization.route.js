const express = require('express');
const router = express.Router();
const { authorizationController } = require('../controllers');
const { authenticationMiddleware, authorizationMiddleware } = require('../middlewares');

router.use(authenticationMiddleware)
router.post('/assign-user-role', authorizationController.assignUserRole);
router.post('/assign-user-permission', authorizationMiddleware(['assign-user-permission']), authorizationController.assignUserPermission);
router.post('/assign-permission-role', authorizationMiddleware(['assign-role-permission']), authorizationController.assignPermissionRole);

module.exports = router;
