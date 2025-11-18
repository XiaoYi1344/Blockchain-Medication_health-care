const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');
const { authenticationMiddleware, uploadMiddleware, authorizationMiddleware } = require('../middlewares');

router.post('/forgot-password', userController.forgotPassword);
router.post('/new-password', userController.newPassword);

router.use(authenticationMiddleware)
router.get('/', userController.getUser);
router.post('/get-all', authorizationMiddleware(['read-all-account']), userController.getAllUsers);
router.get('/get-all', authorizationMiddleware(['read-account-staff']), userController.getAllStaffs);
router.get('/get-all-admin', authorizationMiddleware(['read-account-admin']), userController.getAllAdmin);
router.post('/', authorizationMiddleware(['create-account']), userController.createUser);
router.put('/', uploadMiddleware.avatarUpload, userController.updateUser);
router.put('/change-password', userController.changePassword);
router.delete('/', userController.deleteAccount);
router.delete('/:userId', authorizationMiddleware(['delete-account']), userController.deleteUser);
router.put('/update-state', authorizationMiddleware(['stop-account']), userController.updateStatusUser);

module.exports = router;
