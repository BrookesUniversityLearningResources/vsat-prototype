const Express = require('express');
const HttpStatus = require('http-status-codes');

const { imageName } = require('./scenes/image');
const { audioName } = require('./scenes/audio');

const { getPathParameter, withAsyncErrorHandling } = require('../express');
const { validateRequest } = require('./validation');
const {
  validateStoryId,
  validateSceneId,
  validateImageId,
  validateAudioId,
} = require('./validation/story');

const getStoryId = getPathParameter('storyId');
const getSceneId = getPathParameter('sceneId');
const getImageId = getPathParameter('imageId');
const getAudioId = getPathParameter('audioId');

function deleteSceneRoute(deleteScene) {
  return Express.Router().delete(
    '/story/:storyId/scene/:sceneId',
    validateRequest(validateStoryId(getStoryId), validateSceneId()(getSceneId)),
    withAsyncErrorHandling((req, res) => {
      const storyId = Number.parseInt(getStoryId(req), 10);
      const sceneId = Number.parseInt(getSceneId(req), 10);

      return deleteScene({ storyId, sceneId }).then(() =>
        res.status(HttpStatus.OK).json()
      );
    })
  );
}

function deleteImageRoute(deleteImage) {
  return Express.Router().delete(
    '/scene/:sceneId/image/:imageId',
    validateRequest(validateSceneId()(getSceneId), validateImageId(getImageId)),
    withAsyncErrorHandling((req, res) => {
      const sceneId = Number.parseInt(getSceneId(req), 10);
      const imageId = Number.parseInt(getImageId(req), 10);

      return deleteImage({ sceneId, imageId }).then(() =>
        res.status(HttpStatus.OK).json()
      );
    })
  );
}

function deleteAudioRoute(deleteAudio) {
  return Express.Router().delete(
    '/scene/:sceneId/audio/:audioId',
    validateRequest(validateSceneId()(getSceneId), validateAudioId(getAudioId)),
    (req, res) => {
      const sceneId = Number.parseInt(getSceneId(req), 10);
      const audioId = Number.parseInt(getAudioId(req), 10);

      return deleteAudio({ sceneId, audioId }).then(() =>
        res.status(HttpStatus.OK).json()
      );
    }
  );
}

function deleteImage(log, deleteImageFromDatabase, deleteImageFromStorage) {
  return ({ sceneId, imageId }) => {
    log.info({ sceneId, imageId }, 'Deleting image');
    return deleteImageFromDatabase({ sceneId, imageId }).then(({ storyId }) => {
      if (storyId) {
        const name = imageName(storyId, sceneId);
        log.info({ name }, 'Deleting image from cloud storage');
        return deleteImageFromStorage(name);
      }
    });
  };
}

function deleteAudio(log, deleteAudioFromDatabase, deleteAudioFromStorage) {
  return ({ sceneId, audioId }) => {
    log.info({ sceneId, audioId }, 'Deleting audio');
    return deleteAudioFromDatabase({ sceneId, audioId }).then(({ storyId }) => {
      if (storyId) {
        const name = audioName(storyId, sceneId);
        log.info({ name }, 'Deleting audio from cloud storage');
        return deleteAudioFromStorage(name);
      }
    });
  };
}

function deleteScene(
  deleteSceneFromDatabase,
  deleteImageFromStorage,
  deleteAudioFromStorage
) {
  return ({ storyId, sceneId }) =>
    deleteSceneFromDatabase({ storyId, sceneId }).then(
      ({ imageId, audioId }) => {
        if (imageId) {
          return deleteImageFromStorage(imageName(storyId, sceneId)).then(
            () => {
              return audioId
                ? deleteAudioFromStorage(audioName(storyId, sceneId))
                : Promise.resolve({ storyId, sceneId, imageId, audioId });
            }
          );
        }
      }
    );
}

module.exports = {
  deleteScene,
  deleteSceneRoute,
  deleteImage,
  deleteImageRoute,
  deleteAudio,
  deleteAudioRoute,
};
