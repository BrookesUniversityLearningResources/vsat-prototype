const { tap } = require('ramda');

function saveSceneAudioToDatabase(log, connect) {
  const saveAudio = saveAudioToDatabase(log, connect);

  const updateSceneAudio = (sceneId, audioId) => ({
    name: 'updateSceneAudio',
    text: `
      UPDATE scene
      SET audio_id = $2
      WHERE id = $1
      RETURNING id
    `,
    values: [sceneId, audioId],
  });

  return (sceneId, audio) => {
    log.debug({ sceneId, audio }, 'Saving scene audio to DB');

    return saveAudio(audio).then((audio) =>
      connect().then((connection) =>
        connection.query(updateSceneAudio(sceneId, audio.id)).then(() => {
          log.debug({ sceneId, audio }, 'Saved scene audio to DB');
          return audio;
        })
      )
    );
  };
}

function saveAudioToDatabase(log, connect) {
  const insertAudio = (audio) => ({
    name: 'insertAudio',
    text: `
      INSERT INTO audio (url)
      VALUES ($1)
      RETURNING id, url
    `,
    values: [audio.url],
  });

  const updateAudio = (audio) => ({
    name: 'updateAudio',
    text: `
      UPDATE audio
      SET url        = $2
      WHERE audio.id = $1
      RETURNING id, url
    `,
    values: [audio.id, audio.url],
  });

  const upsert = (audio) =>
    audio.id ? updateAudio(audio) : insertAudio(audio);

  return (audio) => {
    log.info({ audio }, 'Saving audio to DB');

    return connect().then((connection) =>
      connection
        .query(upsert(audio))
        .then(({ rows }) => toAudio(rows[0]))
        .then(tap((audio) => log.debug({ audio }, 'Saved audio to DB')))
    );
  };
}

function toAudio(row) {
  return {
    id: row['id'],
    url: row['url'],
  };
}

module.exports = {
  saveAudioToDatabase,
  saveSceneAudioToDatabase,
};
