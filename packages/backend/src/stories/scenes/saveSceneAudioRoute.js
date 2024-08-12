const { audioName } = require('./audio');

const Express = require('express');
const multer = require('multer');
const HttpStatus = require('http-status-codes');

const { getPathParameter } = require('../../express');
const { validateRequest } = require('../validation');
const { validateStoryId, validateSceneId } = require('../validation/story');

const getStoryId = getPathParameter('storyId');
const getSceneId = getPathParameter('sceneId');

function saveSceneAudioRoute(log, saveSceneAudio) {
  return Express.Router().post(
    '/story/:storyId/scene/:sceneId/audio',
    validateRequest(validateStoryId(getStoryId), validateSceneId()(getSceneId)),
    multer().single('scene-audio'),
    (req, res) => {
      const storyId = Number.parseInt(getStoryId(req), 10);
      const sceneId = Number.parseInt(getSceneId(req), 10);

      return saveSceneAudio({
        storyId,
        sceneId,
        audio: {
          name: audioName(storyId, sceneId),
          data: req.file.buffer,
        },
      }).then((audio) => {
        log.info({ storyId, sceneId, audio }, 'Saved audio');
        return res.status(HttpStatus.OK).json(audio);
      });
    }
  );
}

module.exports = {
  saveSceneAudioRoute,
};
