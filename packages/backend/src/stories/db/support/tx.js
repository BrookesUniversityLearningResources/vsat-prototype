const KEY_FOR_TX_CONNECTION = 'vsp@tx:connection';

function makeTransactional(
  log,
  connect,
  namespace,
  key = KEY_FOR_TX_CONNECTION
) {
  return (delegate) => (...args) =>
    namespace.runAndReturn(() =>
      connect().then((connection) => {
        namespace.set(key, connection);
        log.debug('Starting transaction');
        return connection
          .query('BEGIN')
          .then(() => {
            log.debug('Transaction started');
            return delegate.apply(null, args);
          })
          .then((result) => {
            log.debug('Committing transaction');
            return connection.query('COMMIT').then(() => {
              log.debug('Transaction committed');
              return result;
            });
          })
          .catch((err) => {
            log.debug({ err }, 'Rolling back transaction');
            return connection.query('ROLLBACK').then(() => {
              log.warn({ err }, 'Transaction rolled back');
              return Promise.reject(err);
            });
          })
          .finally(() => {
            log.debug('Releasing connection');
            connection.release();
          });
      })
    );
}

function getTransactionalConnectionFromNamespace(
  log,
  namespace,
  key = KEY_FOR_TX_CONNECTION
) {
  return () =>
    new Promise((resolve, reject) => {
      log.debug('Getting tx connection');
      const connection = namespace.get(key);
      if (!connection) {
        return reject(
          Error(
            `No connection found in namespace "${namespace.name}" under the key "${key}"`
          )
        );
      }
      return resolve(connection);
    });
}

module.exports = {
  makeTransactional,
  getTransactionalConnectionFromNamespace,
};
