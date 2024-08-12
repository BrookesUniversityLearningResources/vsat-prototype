const { Nothing, Just } = require('sanctuary');
function getPublishedStoriesFromDatabase(log, connect) {
  const forPublishedStories = () => ({
    name: 'getPublishedStories',
    text: `
        SELECT
            story.id as story_id,
            story.title as story_title,
            author.id as author_id,
            author.name as author_name,
            image.thumbnail_url as image_url
        FROM author
                 INNER JOIN author_to_story a2s ON author.id = a2s.author_id
                 INNER JOIN story ON story.id = a2s.story_id
                 INNER JOIN scene ON story.id = scene.story_id
                 LEFT JOIN image ON scene.image_id = image.id
        WHERE story.published = true
        ORDER BY story.title
    `,
    values: [],
  });
  return () => {
    log.info('Getting published stories from DB');
    return connect().then((connection) =>
      connection.query(forPublishedStories()).then(({ rows }) => {
        if (rows.length === 0) {
          log.debug('There are no published stories');
          return Nothing;
        } else {
          return Just(toStories(rows));
        }
      })
    );
  };
}
function toStories(rows) {
  return Object.values(
    rows.reduce((stories, row) => {
      const id = row['story_id'];
      const author = {
        id: row['author_id'],
        name: row['author_name'],
      };
      if (stories[id]) {
        const story = stories[id];
        story.authors.push(author);
      } else {
        stories[id] = {
          id: row['story_id'],
          title: row['story_title'],
          authors: [author],
          imageUrl: row['image_url'],
        };
      }
      return stories;
    }, {})
  );
}
module.exports = {
  getPublishedStoriesFromDatabase,
};
