const { tap } = require('ramda');

function saveStoryTitleToDatabase(log, connect) {
  const updateTitle = ({ storyId, title }) => ({
    name: 'updateStoryTitle',
    text: `
      UPDATE story
      SET title = $2
      WHERE story.id = $1
    `,
    values: [storyId, title],
  });

  return ({ storyId, title }) => {
    log.info({ storyId }, 'Saving story title to DB');

    return connect().then((connection) =>
      connection
        .query(updateTitle({ storyId, title }))
        .then(tap(() => log.debug({ storyId }, 'Saved story title to DB')))
    );
  };
}

module.exports = {
  saveStoryTitleToDatabase,
};
