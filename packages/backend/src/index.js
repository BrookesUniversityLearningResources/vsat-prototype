const { createExpressApplication } = require('./app');
const {
  createRoutes,
  createMiddleware,
  createTransactionalServices,
} = require('./dependencies');

module.exports = {
  createRoutes,
  createMiddleware,
  createExpressApplication,
  createTransactionalServices,
};
