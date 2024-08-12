const { Just, Nothing } = require('sanctuary');

function getAuthorFromDatabaseById(log, connect) {
  const forAuthorBy = (authorId) => ({
    name: 'getAuthorById',
    text: `
      SELECT
        author.id as author_id,
        author.name as author_name,
        author.email as author_email
      FROM author
      WHERE author.id = $1
    `,
    values: [authorId],
  });

  return (id) => {
    log.info({ id }, 'Getting author from DB by ID');

    return connect()
      .then((connection) => connection.query(forAuthorBy(id)))
      .then(({ rows }) => {
        return rows.length === 0 ? Nothing : Just(toAuthor(rows[0]));
      });
  };
}

function getAuthorFromDatabaseByEmail(log, connect) {
  const forAuthorBy = (email) => ({
    name: 'getAuthorByEmail',
    text: `
      SELECT
        author.id as author_id,
        author.name as author_name,
        author.email as author_email
      FROM author
      WHERE author.email = $1
    `,
    values: [email],
  });

  return (email) => {
    log.info({ email }, 'Getting author from DB by email');

    return connect()
      .then((connection) => connection.query(forAuthorBy(email)))
      .then(({ rows }) =>
        rows.length === 0 ? Nothing : Just(toAuthor(rows[0]))
      );
  };
}

function toAuthor(row) {
  return {
    id: row['author_id'],
    name: row['author_name'],
    email: row['author_email'],
  };
}

module.exports = {
  getAuthorFromDatabaseById,
  getAuthorFromDatabaseByEmail,
};
