const Express = require('express');
const HttpStatus = require('http-status-codes');
const { isJust, maybeToNullable } = require('sanctuary');

const { withAsyncErrorHandling } = require('../express');

function getPublishedStoriesRoute(getStories) {
  return Express.Router().get(
    '/stories',
    withAsyncErrorHandling((req, res) => {
      return getStories().then((stories) =>
        isJust(stories)
          ? res.status(HttpStatus.OK).json(maybeToNullable(stories))
          : res.status(HttpStatus.NOT_FOUND).json()
      );
    })
  );
}

module.exports = { getPublishedStoriesRoute };
