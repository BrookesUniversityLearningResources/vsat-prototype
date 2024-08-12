const cloudinary = require('cloudinary').v2;

function saveSceneAudio(uploadAudio, saveAudio) {
  return ({ sceneId, audio }) =>
    uploadAudio(audio.name, audio.data).then((audio) =>
      saveAudio(sceneId, audio)
    );
}

function audioName(storyId, sceneId) {
  return `${storyId}-${sceneId}`;
}

function uploadAudioViaCloudinary(defaultOptions = {}) {
  const upload = cloudinary.uploader.upload_stream;

  return (name, data /* buffer */, customOptions = {}) =>
    new Promise((resolve, reject) =>
      upload(
        {
          ...defaultOptions,
          ...customOptions,
          resource_type: 'video',
          public_id: name,
        },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            const url = result.secure_url;
            resolve({
              url,
            });
          }
        }
      ).end(data)
    );
}

function deleteAudioFromCloudinary(
  log,
  defaultOptions = {
    resource_type: 'video',
    invalidate: true,
  }
) {
  const deleteAudio = cloudinary.uploader.destroy;
  return (name, customOptions = {}) =>
    new Promise((resolve, reject) =>
      deleteAudio(name, { ...defaultOptions, ...customOptions }, (err) => {
        if (err) {
          log.warn({ err, name }, 'Error when deleting audio from Cloudinary');
          return reject(err);
        }
        log.info({ name }, 'Deleted audio from Cloudinary');
        return resolve();
      })
    );
}

module.exports = {
  audioName,
  uploadAudioViaCloudinary,
  saveSceneAudio,
  deleteAudioFromCloudinary,
};
