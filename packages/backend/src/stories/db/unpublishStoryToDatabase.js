const { tap } = require('ramda');

function unpublishStoryToDatabase(log, connect) {
  const unpublishStory = (storyId) => ({
    name: 'unpublishStory',
    text: `
      UPDATE story
      SET published = false
      WHERE story.id = $1
    `,
    values: [storyId],
  });

  return (storyId) => {
    log.info({ storyId }, 'Marking story as unpublished in the DB');

    return connect().then((connection) =>
      connection
        .query(unpublishStory(storyId))
        .then(
          tap(() =>
            log.debug({ storyId }, 'Marked story as unpublished in the DB')
          )
        )
    );
  };
}

module.exports = {
  unpublishStoryToDatabase,
};
