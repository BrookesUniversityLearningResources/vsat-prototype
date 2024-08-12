function deleteAudioFromDatabase(log, connect) {
  const deleteAudio = (audioId) => ({
    name: 'deleteAudio',
    text: `
      DELETE FROM audio
      WHERE audio.id = $1
    `,
    values: [audioId],
  });

  const updateSceneToRemoveAudio = (sceneId) => ({
    name: 'updateSceneToRemoveAudio',
    text: `
      UPDATE scene
      SET audio_id = NULL
      WHERE scene.id = $1
      RETURNING story_id
    `,
    values: [sceneId],
  });

  return ({ sceneId, audioId }) => {
    log.info({ sceneId, audioId }, 'Deleting audio from DB');

    return connect().then((connection) =>
      connection
        .query(deleteAudio(audioId))
        .then(() => connection.query(updateSceneToRemoveAudio(sceneId)))
        .then(({ rows }) => {
          const storyId = rows && rows[0] ? rows[0]['story_id'] : null;
          return { storyId, sceneId };
        })
    );
  };
}

module.exports = {
  deleteAudioFromDatabase,
};
