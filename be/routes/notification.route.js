const express = require('express');
const router = express.Router();
const { notificationController } = require('../controllers');
const { authenticationMiddleware, authorizationMiddleware } = require('../middlewares');

router.use(authenticationMiddleware)
router.get('/get', authorizationMiddleware(['read-notification-admin']), notificationController.getAllNotificationAdmin);
router.get('/get-all', notificationController.getAllNotification);
router.post('/', authorizationMiddleware(['create-notification']), notificationController.create);
router.put('/', notificationController.updateRecipient);
router.put('/:notificationId', authorizationMiddleware(['stop-notification']), notificationController.stopNotification);

module.exports = router;
