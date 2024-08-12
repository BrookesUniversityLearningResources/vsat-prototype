const Express = require('express');
const HttpStatus = require('http-status-codes');
const { isJust, maybeToNullable } = require('sanctuary');

const {
  getPathParameter,
  getBody,
  withAsyncErrorHandling,
} = require('../express');
const { validateRequest } = require('./validation');
const { validateStoryId, validateStoryTitle } = require('./validation/story');

const getStoryId = getPathParameter('storyId');

function saveStoryTitleRoute(saveStoryTitle, getStory) {
  return Express.Router().post(
    '/story/:storyId/title',
    validateRequest(validateStoryId(getStoryId), validateStoryTitle(getBody)),
    withAsyncErrorHandling((req, res) => {
      const storyId = Number.parseInt(getStoryId(req), 10);

      return saveStoryTitle({
        storyId,
        title: req.body.title,
      })
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
  saveStoryTitleRoute,
};
