const User = require("./user.model")
const Token = require("./token.model")
const Role = require("./role.model")
const Permission = require("./permission.model")
const PermissionRole = require("./permissionRole.model")
const PermissionUser = require("./permissionUser.model")
const RoleUser = require("./roleUser.model")
const Company = require("./company.model")
const CompanyDocument = require("./companyDocument.model")
const AuditLog = require("./auditLog.model")
const Counter = require("./counter.model")
const Category = require("./category.model")
const Product = require("./product.model")
const Batch = require("./batch.model")
const Location = require("./location.model")
const Inventory = require("./inventory.model")
const InventoryHistory = require("./inventoryHistory.model")
const Notification = require("./notification.model")
const NotificationRecipient = require("./notificationRecipient.model")
const Order = require("./order.model")
const Shipment = require("./shipment.model")
const SellerCustom = require("./sellerCustom.model")
const ReceivingRecord = require("./receivingRecord.model")

module.exports = {
   User,
   Token,
   Role,
   Permission,
   PermissionRole,
   PermissionUser,
   RoleUser,
   Company,
   CompanyDocument,
   AuditLog,
   Counter,
   Category,
   Product,
   Batch,
   Location,
   Inventory,
   InventoryHistory,
   Notification,
   NotificationRecipient,
   Order,
   Shipment,
   SellerCustom,
   ReceivingRecord
};
