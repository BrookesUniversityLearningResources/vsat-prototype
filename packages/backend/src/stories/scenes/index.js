const { saveSceneImageRoute } = require('./saveSceneImageRoute');
const { saveSceneAudioRoute } = require('./saveSceneAudioRoute');
const { saveSceneTitleRoute } = require('./saveSceneTitleRoute');
const { saveSceneContentRoute } = require('./saveSceneContentRoute');
const {
  saveSceneImage,
  uploadImageViaCloudinary,
  deleteImageFromCloudinary,
} = require('./image');
const {
  saveSceneAudio,
  uploadAudioViaCloudinary,
  deleteAudioFromCloudinary,
} = require('./audio');

function toSceneName(scene) {
  return scene.title
    .toLowerCase()
    .replace(/[,.'":?!£$%&*(){}\\]+/g, '')
    .replace(/ /g, '-');
}

module.exports = {
  toSceneName,
  saveSceneImage,
  saveSceneImageRoute,
  uploadImageViaCloudinary,
  saveSceneTitleRoute,
  saveSceneContentRoute,
  deleteImageFromCloudinary,
  saveSceneAudio,
  saveSceneAudioRoute,
  uploadAudioViaCloudinary,
  deleteAudioFromCloudinary,
};
