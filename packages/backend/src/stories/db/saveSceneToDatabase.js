const { tap } = require('ramda');

function saveSceneToDatabase(log, connect) {
  const insertScene = (scene) => ({
    name: 'insertScene',
    text: `
      INSERT INTO scene (title, content, story_id, is_opening_scene)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `,
    values: [scene.title, scene.content, scene.storyId, scene.isOpeningScene],
  });

  const updateScene = (scene) => ({
    name: 'updateScene',
    text: `
      UPDATE scene
      SET title = $2,
          content = $3,
          story_id = $4,
          is_opening_scene = $5
      WHERE scene.id = $1
      RETURNING id
    `,
    values: [
      scene.id,
      scene.title,
      scene.content,
      scene.storyId,
      scene.isOpeningScene,
    ],
  });

  const upsert = (scene) =>
    scene.id ? updateScene(scene) : insertScene(scene);

  return (scene) => {
    log.info({ scene }, 'Saving scene to DB');

    return Promise.resolve(toSceneWithDefaults(scene)).then((scene) =>
      connect().then((connection) =>
        connection
          .query(upsert(scene))
          .then(getSceneIdFromResult)
          .then(withId(scene))
          .then(tap((scene) => log.debug({ scene }, 'Saved scene to DB')))
      )
    );
  };
}

function getSceneIdFromResult(result) {
  return result.rows[0].id;
}

function withId(scene) {
  return (id) => ({
    ...scene,
    id,
  });
}

function toSceneWithDefaults(scene) {
  return {
    ...scene,
    isOpeningScene: scene.isOpeningScene || false,
  };
}

module.exports = {
  saveSceneToDatabase,
};
