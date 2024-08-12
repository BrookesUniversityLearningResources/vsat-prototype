const Express = require('express');
const HttpStatus = require('http-status-codes');
const { isJust, maybeToNullable } = require('sanctuary');

const { getPathParameter, withAsyncErrorHandling } = require('../express');
const { validateAuthorId } = require('./validation/author');
const { validateRequest } = require('./validation');

function getStoriesByAuthorRoute(getStoriesByAuthor) {
  const getAuthorId = getPathParameter('authorId');

  return Express.Router().get(
    '/author/:authorId/stories',
    validateRequest(validateAuthorId(getAuthorId)),
    withAsyncErrorHandling((req, res) => {
      const authorId = Number.parseInt(getAuthorId(req), 10);

      return getStoriesByAuthor(authorId).then((data) =>
        isJust(data)
          ? res.status(HttpStatus.OK).json(maybeToNullable(data))
          : res.status(HttpStatus.NOT_FOUND).send()
      );
    })
  );
}

module.exports = {
  getStoriesByAuthorRoute,
};
