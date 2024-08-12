const { tap } = require('ramda');

function saveAuthorToDatabase(log, connect) {
  const insertAuthor = (author) => ({
    name: 'insertAuthor',
    text: `
      INSERT INTO author (name, email)
      VALUES ($1, $2)
      RETURNING id
    `,
    values: [author.name, author.email],
  });

  const updateAuthor = (author) => ({
    name: 'updateAuthor',
    text: `
      UPDATE author
      SET name = $2
      WHERE author.id = $1
      RETURNING id
    `,
    values: [author.id, author.name],
  });

  const upsert = (author) =>
    author.id ? updateAuthor(author) : insertAuthor(author);

  return (author) => {
    log.info({ author }, 'Saving author to DB');

    return connect().then((connection) =>
      connection
        .query(upsert(author))
        .then(({ rows }) => toAuthorWithId(author, rows[0].id))
        .then(tap((author) => log.info({ author }, 'Saved author to DB')))
    );
  };
}

function toAuthorWithId(author, id) {
  return {
    ...author,
    id,
  };
}

module.exports = {
  saveAuthorToDatabase,
};
