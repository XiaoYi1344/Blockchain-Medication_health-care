const express = require('express');
const router = express.Router();
const { categoryController } = require('../controllers');
const { authenticationMiddleware, authorizationMiddleware } = require('../middlewares');

router.post('/all', categoryController.getAllCategory);
router.post('/get', categoryController.getOneCategory);

router.use(authenticationMiddleware)
router.post('/', authorizationMiddleware(['create-category']), categoryController.create);
router.put('/', authorizationMiddleware(['update-category']), categoryController.update);
router.put('/approval', authorizationMiddleware(['approval-category']), categoryController.approval);
router.post('/get-all-company', categoryController.getAllCategoryCompany);
router.post('/get-one', categoryController.getOneCategory);
router.delete('/:categoryId', authorizationMiddleware(['delete-category']), categoryController.deleteCategory);

module.exports = router;
