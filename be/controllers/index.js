const userController = require("./user.controller")
const authenticationController = require("./authentication.controller")
const authorizationController = require("./authorization.controller")
const imageController = require("./image.controller")
const permissionController = require("./permission.controller")
const roleController = require("./role.controller")
const companyController = require("./company.controller")
const companyDocumentController = require("./companyDocument.controller")
const categoryController = require("./category.controller")
const productController = require("./product.controller")
const batchController = require("./batch.controller")
const locationController = require("./location.controller")
const inventoryController = require("./inventory.controller")
const inventoryHistoryController = require("./inventoryHistory.controller")
const notificationController = require("./notification.controller")
const orderController = require("./order.controller")
const shipmentController = require("./shipment.controller")
const verifyHashController = require("./verifyHash.controller")
const sellerCustomController = require("./sellerCustom.controller")
const receivingRecordsController = require("./receivingRecords.controller")
const auditLogController = require("./auditLog.controller")
const traceabilityController = require("./traceability.controller")

module.exports = {
   userController,
   authenticationController,
   authorizationController,
   imageController,
   permissionController,
   roleController,
   companyController,
   companyDocumentController,
   categoryController,
   productController,
   batchController,
   locationController,
   inventoryController,
   inventoryHistoryController,
   notificationController,
   orderController,
   shipmentController,
   verifyHashController,
   sellerCustomController,
   receivingRecordsController,
   auditLogController,
   traceabilityController
};
