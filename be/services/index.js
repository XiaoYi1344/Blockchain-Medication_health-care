const userService = require("./user.service")
const authenticationService = require("./authentication.service")
const authorizationService = require("./authorization.service")
const permissionService = require("./permission.service")
const roleService = require("./role.service")
const companyService = require("./company.service")
const companyDocumentService = require("./companyDocument.service")
const categoryService = require("./category.service")
const productService = require("./product.service")
const batchService = require("./batch.service")
const locationService = require("./location.service")
const inventoryService = require("./inventory.service")
const inventoryHistoryService = require("./inventoryHistory.service")
const notificationService = require("./notification.service")
const orderService = require("./order.service")
const shipmentService = require("./shipment.service")
const verifyHashService = require("./verifyHash.service")
const sellerCustomService = require("./sellerCustom.service")
const receivingRecordsService = require("./receivingRecords.service")
const auditLogService = require("./auditLog.service")
const traceabilityService = require("./traceability.service")

module.exports = {
   userService,
   authenticationService,
   authorizationService,
   permissionService,
   roleService,
   companyService,
   companyDocumentService,
   categoryService,
   productService,
   batchService,
   locationService,
   inventoryService,
   inventoryHistoryService,
   notificationService,
   orderService,
   shipmentService,
   verifyHashService,
   sellerCustomService,
   receivingRecordsService,
   auditLogService,
   traceabilityService
};
