const { saveSceneToDatabase } = require('./saveSceneToDatabase');

function saveStoryToDatabase(log, connect) {
  const saveScene = saveSceneToDatabase(log, connect);

  const insertStory = (story) => ({
    name: 'insertStory',
    text: `
      INSERT INTO story (title)
      VALUES ($1)
      RETURNING id
    `,
    values: [story.title],
  });

  const updateStory = (story) => ({
    name: 'updateStory',
    text: `
      UPDATE story
      SET title = $2
      WHERE story.id = $1
      RETURNING id
    `,
    values: [story.id, story.title],
  });

  const upsert = (story) =>
    story.id ? updateStory(story) : insertStory(story);

  const linkStoryWithAuthor = `
    INSERT INTO author_to_story (author_id, story_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `;

  return (story) => {
    log.info({ story }, 'Saving story to DB');

    return connect().then((connection) =>
      connection
        .query(upsert(story))
        .then(({ rows }) => {
          const storyId = rows[0].id;
          return Promise.all(
            story.scenes.map(associateSceneWithStory(storyId)).map(saveScene)
          ).then((scenes) => ({
            ...story,
            id: storyId,
            authors: story.authors,
            scenes,
          }));
        })
        .then((story) =>
          Promise.all(
            story.authors.map((author) =>
              connection.query(linkStoryWithAuthor, [author.id, story.id])
            )
          ).then(() => {
            log.info({ story }, 'Saved story to DB');
            return story;
          })
        )
    );
  };
}

function associateSceneWithStory(storyId) {
  return (scene) => ({ ...scene, storyId });
}

module.exports = {
  saveStoryToDatabase,
};
