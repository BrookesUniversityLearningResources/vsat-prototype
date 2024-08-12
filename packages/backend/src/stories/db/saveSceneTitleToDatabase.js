const { tap } = require('ramda');

function saveSceneTitleToDatabase(log, connect) {
  const updateTitle = ({ sceneId, title }) => ({
    name: 'updateSceneTitle',
    text: `
      UPDATE scene
      SET title = $2
      WHERE scene.id = $1
    `,
    values: [sceneId, title],
  });

  return ({ sceneId, title }) => {
    log.info({ sceneId }, 'Saving scene title to DB');

    return connect().then((connection) =>
      connection
        .query(updateTitle({ sceneId, title }))
        .then(tap(() => log.debug({ sceneId }, 'Saved scene title to DB')))
    );
  };
}

module.exports = {
  saveSceneTitleToDatabase,
};
