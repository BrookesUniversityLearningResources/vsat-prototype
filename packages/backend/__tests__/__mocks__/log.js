const Log = require('pino');
const Config = require('config');

const log = Log(Config.get('log'));

module.exports = {
  log,
};
