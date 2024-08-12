const { imageName } = require('./image');

const Express = require('express');
const multer = require('multer');
const HttpStatus = require('http-status-codes');

const { getPathParameter } = require('../../express');
const { validateRequest } = require('../validation');
const { validateStoryId, validateSceneId } = require('../validation/story');

const getStoryId = getPathParameter('storyId');
const getSceneId = getPathParameter('sceneId');

function saveSceneImageRoute(log, saveSceneImage) {
  return Express.Router().post(
    '/story/:storyId/scene/:sceneId/image',
    validateRequest(validateStoryId(getStoryId), validateSceneId()(getSceneId)),
    multer().single('scene-image'),
    (req, res) => {
      const storyId = Number.parseInt(getStoryId(req), 10);
      const sceneId = Number.parseInt(getSceneId(req), 10);

      return saveSceneImage({
        storyId,
        sceneId,
        image: {
          name: imageName(storyId, sceneId),
          data: req.file.buffer,
        },
      }).then((image) => {
        log.info({ storyId, sceneId, image }, 'Saved image');
        return res.status(HttpStatus.OK).json(image);
      });
    }
  );
}

module.exports = {
  saveSceneImageRoute,
};
