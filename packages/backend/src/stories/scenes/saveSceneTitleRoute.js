const Express = require('express');
const HttpStatus = require('http-status-codes');
const { isJust, maybeToNullable } = require('sanctuary');

const { getPathParameter, getBody } = require('../../express');
const { validateRequest } = require('../validation');
const {
  validateStoryId,
  validateSceneId,
  validateSceneTitle,
} = require('../validation/story');

const getStoryId = getPathParameter('storyId');
const getSceneId = getPathParameter('sceneId');

function saveSceneTitleRoute(saveSceneTitle, getStory) {
  return Express.Router().post(
    '/story/:storyId/scene/:sceneId/title',
    validateRequest(
      validateStoryId(getStoryId),
      validateSceneId()(getSceneId),
      validateSceneTitle(getBody)
    ),
    (req, res) => {
      const storyId = Number.parseInt(getStoryId(req), 10);

      return saveSceneTitle({
        storyId,
        sceneId: Number.parseInt(getSceneId(req), 10),
        title: req.body.title,
      })
        .then(() => getStory(storyId))
        .then((story) =>
          isJust(story)
            ? res.status(HttpStatus.OK).json(maybeToNullable(story))
            : res.status(HttpStatus.NOT_FOUND).json()
        );
    }
  );
}

module.exports = {
  saveSceneTitleRoute,
};
