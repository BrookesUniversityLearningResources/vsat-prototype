const HttpStatusCodes = require('http-status-codes');
const Express = require('express');

function pingRoute(data) {
  return Express.Router().get('/ping', (req, res) =>
    res.status(HttpStatusCodes.OK).json(data)
  );
}

module.exports = { pingRoute };
