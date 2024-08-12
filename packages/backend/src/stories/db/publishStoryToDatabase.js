const { tap } = require('ramda');

function publishStoryToDatabase(log, connect) {
  const publishStory = (storyId) => ({
    name: 'publishStory',
    text: `
      UPDATE story
      SET published = true
      WHERE story.id = $1
    `,
    values: [storyId],
  });

  return (storyId) => {
    log.info({ storyId }, 'Marking story as published in the DB');

    return connect().then((connection) =>
      connection
        .query(publishStory(storyId))
        .then(
          tap(() =>
            log.debug({ storyId }, 'Marked story as published in the DB')
          )
        )
    );
  };
}

module.exports = {
  publishStoryToDatabase,
};
