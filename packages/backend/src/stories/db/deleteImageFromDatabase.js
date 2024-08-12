function deleteImageFromDatabase(log, connect) {
  const deleteImage = (imageId) => ({
    name: 'deleteImage',
    text: `
      DELETE FROM image
      WHERE image.id = $1
    `,
    values: [imageId],
  });

  const updateSceneToRemoveImage = (sceneId) => ({
    name: 'updateSceneToRemoveImage',
    text: `
      UPDATE scene
      SET image_id = NULL
      WHERE scene.id = $1
      RETURNING story_id
    `,
    values: [sceneId],
  });

  return ({ sceneId, imageId }) => {
    log.info({ sceneId, imageId }, 'Deleting image from DB');

    return connect().then((connection) =>
      connection
        .query(deleteImage(imageId))
        .then(() => connection.query(updateSceneToRemoveImage(sceneId)))
        .then(({ rows }) => {
          const storyId = rows && rows[0] ? rows[0]['story_id'] : null;
          return { storyId, sceneId };
        })
    );
  };
}

module.exports = {
  deleteImageFromDatabase,
};
