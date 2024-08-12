function deleteSceneFromDatabase(log, connect) {
  const deleteSceneFromStory = ({ storyId, sceneId }) => ({
    name: 'deleteSceneFromStory',
    text: `
      DELETE FROM scene
      WHERE id = $1
        AND story_id = $2
      RETURNING image_id, audio_id
    `,
    values: [sceneId, storyId],
  });

  return ({ storyId, sceneId }) => {
    log.info({ storyId, sceneId }, 'Deleting scene from DB');

    return connect()
      .then((connection) =>
        connection.query(deleteSceneFromStory({ storyId, sceneId }))
      )
      .then(({ rows }) => {
        const [imageId, audioId] =
          rows.length === 1 ? [rows[0]['image_id'], rows[0]['audio_id']] : null;
        return {
          storyId,
          sceneId,
          imageId,
          audioId,
        };
      });
  };
}

module.exports = {
  deleteSceneFromDatabase,
};
