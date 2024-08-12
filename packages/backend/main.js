const Log = require('pino');
const Config = require('config');

const {
  createRoutes,
  createMiddleware,
  createExpressApplication,
  createTransactionalServices,
} = require('./src');

const log = Log({
  ...Config.get('log'),
  serializers: {
    err: Log.stdSerializers.err,
    req: Log.stdSerializers.req,
    res: Log.stdSerializers.res,
  },
}, process.stdout);

const [tx, getConnection] = createTransactionalServices(log);

const app = createExpressApplication(
  log,
  createRoutes(log, tx, getConnection),
  createMiddleware(log, tx, getConnection)
);

const port = Config.get('port');

return app.listen(port, () => log.info({ port }, 'Server started'));
