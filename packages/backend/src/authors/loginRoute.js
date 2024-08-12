const Express = require('express');
const HttpStatusCodes = require('http-status-codes');
const { withAsyncErrorHandling } = require('../express');

function loginRoute(log, authenticate) {
  return Express.Router().post(
    '/login',
    authenticate,
    withAsyncErrorHandling(async (req, res) => {
      if (req.user) {
        log.info({ req, user: req.user }, 'Login successful');

        return res.status(HttpStatusCodes.OK).json(req.user);
      } else {
        log.info({ req }, 'Login failed');

        return res.status(HttpStatusCodes.UNAUTHORIZED).json();
      }
    })
  );
}

module.exports = { loginRoute };
