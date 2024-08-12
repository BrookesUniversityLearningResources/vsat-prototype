const { Just, Nothing } = require('sanctuary');

const {
  getScenesForStoryFromDatabase,
} = require('./getScenesForStoryFromDatabase');

function getStoryFromDatabase(log, connect) {
  const getScenesFor = getScenesForStoryFromDatabase(log, connect);

  const forStory = (storyId) => ({
    name: 'getStory',
    text: `
      SELECT
        story.title as story_title,
        story.published as story_published,
        author.id as author_id,
        author.name as author_name
      FROM story
        INNER JOIN author_to_story a2s ON story.id = a2s.story_id
        INNER JOIN author ON author.id = a2s.author_id
      WHERE story.id = $1
      ORDER BY author.name, story.title
    `,
    values: [storyId],
  });

  return (storyId) => {
    log.info({ storyId }, 'Getting story from DB');

    return connect()
      .then((connection) => connection.query(forStory(storyId)))
      .then(({ rows }) => {
        if (rows.length === 0) {
          log.debug({ storyId }, 'No story found');
          return Nothing;
        }

        const story = rows.reduce(toStoryWithAuthors, blankStory(storyId));

        return getScenesFor(storyId).then(toStoryWithScenes(story)).then(Just);
      });
  };
}

function toStoryWithAuthors(story, row) {
  return {
    ...story,
    title: row['story_title'],
    published: row['story_published'],
    authors: [].concat(story.authors).concat([
      {
        id: row['author_id'],
        name: row['author_name'],
      },
    ]),
  };
}

function toStoryWithScenes(story) {
  return (scenes) => ({
    ...story,
    scenes,
  });
}

function blankStory(id) {
  return {
    id,
    authors: [],
  };
}

module.exports = {
  getStoryFromDatabase,
};
