const Express = require('express');
const HttpStatus = require('http-status-codes');
const { isJust, maybeToNullable } = require('sanctuary');

const {
  getPathParameter,
  getBody,
  withAsyncErrorHandling,
} = require('../express');
const { validateRequest } = require('./validation');
const {
  validateStoryId,
  validateCompleteStory,
} = require('./validation/story');
const { initialSceneContent } = require('./index');

const getStoryId = getPathParameter('storyId');

function saveStoryRoute(saveStory) {
  return Express.Router().put(
    '/story/:storyId',
    validateRequest(
      validateStoryId(getStoryId),
      validateCompleteStory(getBody)
    ),
    withAsyncErrorHandling((req, res) => {
      const story = req.body;

      return saveStory(story).then((story) =>
        res.status(HttpStatus.OK).json(story)
      );
    })
  );
}

function createNewSceneInStoryRoute(createNewSceneInStory, getStory) {
  return Express.Router().post(
    '/story/:storyId/scene/',
    validateRequest(validateStoryId(getStoryId)),
    withAsyncErrorHandling((req, res) => {
      const storyId = Number.parseInt(getStoryId(req), 10);

      return createNewSceneInStory({
        storyId,
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

function createNewSceneInStory(log, saveScene) {
  return ({ storyId }) => {
    const newScene = {
      storyId,
      ...initialSceneContent(),
    };

    log.info({ newScene }, 'Creating new scene in story');

    return saveScene(newScene);
  };
}

module.exports = {
  saveStoryRoute,
  createNewSceneInStoryRoute,
  createNewSceneInStory,
};
