const { tap } = require('ramda');

function saveSceneContentToDatabase(log, connect) {
  const updateContent = ({ sceneId, content }) => ({
    name: 'updateScene',
    text: `
      UPDATE scene
      SET content = $2
      WHERE scene.id = $1
    `,
    values: [sceneId, content],
  });

  return ({ sceneId, content }) => {
    log.info({ sceneId }, 'Saving scene content to DB');

    return connect().then((connection) =>
      connection
        .query(updateContent({ sceneId, content }))
        .then(tap(() => log.debug({ sceneId }, 'Saved scene content to DB')))
    );
  };
}

module.exports = {
  saveSceneContentToDatabase,
};
