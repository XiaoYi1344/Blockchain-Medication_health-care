const { AsyncLocalStorage } = require("async_hooks");
const asyncLocalStorage = new AsyncLocalStorage();

const contextMiddleware = (req, res, next) => {
  req.context = {
    ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    userAgent: req.headers["user-agent"]
  };
  next();
};

const getContext = () => asyncLocalStorage.getStore();

module.exports = { contextMiddleware, getContext };