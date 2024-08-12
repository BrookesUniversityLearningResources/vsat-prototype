const Express = require('express');
const HttpStatus = require('http-status-codes');
const { isJust, maybeToNullable } = require('sanctuary');

const { getPathParameter, withAsyncErrorHandling } = require('../express');
const { validateRequest } = require('./validation');
const { validateStoryId } = require('./validation/story');

const getStoryId = getPathParameter('storyId');

function getStoryRoute(getStory) {
  return Express.Router().get(
    '/story/:storyId',
    validateRequest(validateStoryId(getStoryId)),
    withAsyncErrorHandling((req, res) => {
      const id = Number.parseInt(getStoryId(req), 10);
      return getStory(id).then((story) =>
        isJust(story)
          ? res.status(HttpStatus.OK).json(maybeToNullable(story))
          : res.status(HttpStatus.NOT_FOUND).json()
      );
    })
  );
}

module.exports = { getStoryRoute };
