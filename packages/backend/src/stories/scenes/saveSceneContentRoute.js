const Express = require('express');
const HttpStatus = require('http-status-codes');
const { isJust, maybeToNullable } = require('sanctuary');

const { getPathParameter, getBody } = require('../../express');
const { validateRequest } = require('../validation');
const {
  validateStoryId,
  validateSceneId,
  validateSceneContent,
} = require('../validation/story');

const getStoryId = getPathParameter('storyId');
const getSceneId = getPathParameter('sceneId');

function saveSceneContentRoute(saveSceneContent, getStory) {
  return Express.Router().post(
    '/story/:storyId/scene/:sceneId/content',
    validateRequest(
      validateStoryId(getStoryId),
      validateSceneId()(getSceneId),
      validateSceneContent(getBody)
    ),
    (req, res) => {
      const storyId = Number.parseInt(getStoryId(req), 10);

      return saveSceneContent({
        storyId,
        sceneId: Number.parseInt(getSceneId(req)),
        content: req.body.content,
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
  saveSceneContentRoute,
};
