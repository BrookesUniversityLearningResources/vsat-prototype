const { isJust, maybeToNullable, Nothing, Just } = require('sanctuary');
const { getAuthorFromDatabaseById } = require('./getAuthorFromDatabase');

function getStoriesByAuthorFromDatabase(log, connect) {
  const getAuthor = getAuthorFromDatabaseById(log, connect);

  const forStoriesByAuthor = (authorId) => ({
    name: 'getStoriesByAuthor',
    text: `
      SELECT
        story.id as story_id,
        story.title as story_title,
        story.published as story_published,
        author.id as author_id,
        author.name as author_name
      FROM author
        INNER JOIN author_to_story a2s ON author.id = a2s.author_id
        INNER JOIN story ON story.id = a2s.story_id
      WHERE author.id = $1
      ORDER BY story.id
    `,
    values: [authorId],
  });

  return (authorId) => {
    log.info({ authorId }, "Getting author's stories from DB");

    return connect().then((connection) =>
      connection.query(forStoriesByAuthor(authorId)).then(({ rows }) => {
        if (rows.length === 0) {
          log.debug({ authorId }, "Author hasn't written any stories");
          return getAuthor(authorId).then((author) =>
            isJust(author)
              ? Just(authorWithNoStories(maybeToNullable(author)))
              : Nothing
          );
        } else {
          return Just(toStoriesByAuthor(rows));
        }
      })
    );
  };
}

function toStoriesByAuthor(rows) {
  return rows.reduce(
    (result, row) => {
      result.stories.push({
        id: row['story_id'],
        title: row['story_title'],
        published: row['story_published'],
      });
      return result;
    },
    authorWithNoStories({
      id: rows[0]['author_id'],
      name: rows[0]['author_name'],
    })
  );
}

function authorWithNoStories(author) {
  return {
    author,
    stories: [],
  };
}

module.exports = {
  getStoriesByAuthorFromDatabase,
};
