const Express = require('express');
const HttpStatus = require('http-status-codes');
const { isJust, maybeToNullable } = require('sanctuary');

const { getPathParameter, withAsyncErrorHandling } = require('../express');
const { validateRequest } = require('./validation');
const { validateStoryId } = require('./validation/story');

const getStoryId = getPathParameter('storyId');

function publishStoryRoute(publishStory, getStory) {
  return Express.Router().post(
    '/story/:storyId/publish',
    validateRequest(validateStoryId(getStoryId)),
    withAsyncErrorHandling((req, res) => {
      const storyId = Number.parseInt(getStoryId(req), 10);

      return publishStory(storyId)
        .then(() => getStory(storyId))
        .then((story) =>
          isJust(story)
            ? res.status(HttpStatus.OK).json(maybeToNullable(story))
            : res.status(HttpStatus.NOT_FOUND).json()
        );
    })
  );
}

function unpublishStoryRoute(unpublishStory, getStory) {
  return Express.Router().post(
    '/story/:storyId/unpublish',
    validateRequest(validateStoryId(getStoryId)),
    withAsyncErrorHandling((req, res) => {
      const storyId = Number.parseInt(getStoryId(req), 10);

      return unpublishStory(storyId)
        .then(() => getStory(storyId))
        .then((story) =>
          isJust(story)
            ? res.status(HttpStatus.OK).json(maybeToNullable(story))
            : res.status(HttpStatus.NOT_FOUND).json()
        );
    })
  );
}

module.exports = {
  publishStoryRoute,
  unpublishStoryRoute,
};
