const errorHandle = require("./error.middleware")
const uploadMiddleware = require("./upload.middleware")
const authenticationMiddleware = require("./authentication.middleware")
const authorizationMiddleware = require("./authorization.middleware")
const uploadFileMiddleware = require("./uploadFile.middleware")
const contextMiddleware = require("./context.middleware")

module.exports = {
   errorHandle,
   uploadMiddleware,
   authenticationMiddleware,
   authorizationMiddleware,
   uploadFileMiddleware,
   contextMiddleware
}