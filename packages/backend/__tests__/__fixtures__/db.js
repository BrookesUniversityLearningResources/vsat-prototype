function transactionalTest(connect, f) {
  return connect().then((connection) =>
    connection
      .query('BEGIN')
      .then(f)
      .finally(() => connection.query('ROLLBACK'))
  );
}

function thunk(connect) {
  return () => connect;
}

function releaseConnectionAndClosePool(connect, pool) {
  return (done) =>
    connect()
      .then((connection) => connection.release())
      .then(() => pool.end())
      .finally(done);
}

module.exports = {
  transactionalTest,
  thunk,
  releaseConnectionAndClosePool,
};
