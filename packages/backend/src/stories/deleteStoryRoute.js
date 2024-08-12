const Express = require('express');
const HttpStatus = require('http-status-codes');

const { imageName } = require('./scenes/image');
const { audioName } = require('./scenes/audio');

const { getPathParameter, withAsyncErrorHandling } = require('../express');
const { validateRequest } = require('./validation');
const { validateStoryId } = require('./validation/story');

const getStoryId = getPathParameter('storyId');

function deleteStoryRoute(deleteStory) {
  return Express.Router().delete(
    '/story/:storyId',
    validateRequest(validateStoryId(getStoryId)),
    withAsyncErrorHandling((req, res) => {
      const storyId = Number.parseInt(getStoryId(req), 10);

      return deleteStory(storyId).then(() => res.status(HttpStatus.OK).json());
    })
  );
}

function deleteStory(
  log,
  getScenesForStory,
  deleteStoryFromDatabase,
  deleteImageFromStorage,
  deleteAudioFromStorage
) {
  return (storyId) => {
    return getScenesForStory(storyId)
      .then((scenes) => [
        scenes.filter((scene) => scene.image).map((scene) => scene.id),
        scenes.filter((scene) => scene.audio).map((scene) => scene.id),
      ])
      .then(([scenesWithImages, scenesWithAudio]) => {
        log.info(
          { storyId },
          'Deleting story with %d images and %d audio files',
          scenesWithImages.length,
          scenesWithAudio.length
        );
        return deleteStoryFromDatabase(storyId).then(() =>
          Promise.all([
            ...scenesWithImages
              .map((sceneId) => imageName(storyId, sceneId))
              .map(deleteImageFromStorage),
            ...scenesWithAudio
              .map((sceneId) => audioName(storyId, sceneId))
              .map(deleteAudioFromStorage),
          ])
        );
      });
  };
}

module.exports = {
  deleteStory,
  deleteStoryRoute,
};
